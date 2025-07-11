import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { ApiError, handleApiError, requireAdmin } from '@/lib/api-error-handler'
import { sendProductApprovedEmail } from '@/lib/email/service'
import { sendEmail } from '@/lib/email/service'
import { BaseEmailTemplate } from '@/lib/email/templates/base'
import { EMAIL_CONFIG, EMAIL_TYPES } from '@/lib/email/config'

export async function POST(request: NextRequest) {
  try {
    const { 
      productId, 
      productName, 
      status, 
      userEmail, 
      userId, 
      queuePosition,
      adminNotes 
    } = await request.json()
    
    if (!productId || !productName || !status || !userEmail || !userId) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS')
    }

    const supabase = createClient()
    
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user?.id || '')
      .single()
      
    requireAdmin(user, adminUser?.is_admin || false)

    // Send appropriate email based on status
    if (status === 'approved') {
      await sendProductApprovedEmail(
        userEmail,
        userId,
        productName,
        productId,
        queuePosition
      )
    } else if (status === 'rejected') {
      // Send rejection email
      const productUrl = `${EMAIL_CONFIG.baseUrl}/dashboard?tab=products`
      
      await sendEmail({
        to: userEmail,
        subject: `Update on ${productName}`,
        react: (
          <BaseEmailTemplate previewText={`Update on ${productName}`}>
            <div>
              <h2 style={{
                margin: '0 0 20px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#2D2D2D',
              }}>
                Product Update
              </h2>

              <p style={{
                margin: '0 0 20px',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#666666',
              }}>
                Thank you for submitting <strong>{productName}</strong> to Sheep It.
              </p>

              <p style={{
                margin: '0 0 20px',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#666666',
              }}>
                After careful review, we've decided not to approve this product at this time. 
                This could be due to various reasons such as incomplete information, 
                unclear product description, or not meeting our community guidelines.
              </p>

              {adminNotes && (
                <div style={{
                  margin: '0 0 30px',
                  padding: '20px',
                  backgroundColor: '#FDFCFA',
                  border: '1px solid #F5F5F5',
                  borderRadius: '8px',
                }}>
                  <p style={{
                    margin: '0 0 10px',
                    fontSize: '14px',
                    color: '#999999',
                  }}>
                    Feedback from our team:
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#2D2D2D',
                  }}>
                    {adminNotes}
                  </p>
                </div>
              )}

              <p style={{
                margin: '0 0 30px',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#666666',
              }}>
                You're welcome to update your product and resubmit it for review.
              </p>

              <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                <tr>
                  <td align="center">
                    <a
                      href={productUrl}
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#2D2D2D',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        borderRadius: '8px',
                      }}
                    >
                      View Your Products
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          </BaseEmailTemplate>
        ),
        userId,
        emailType: EMAIL_TYPES.PRODUCT_REJECTED,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}