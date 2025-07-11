import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { ApiError, handleApiError, requireAdmin } from '@/lib/api-error-handler'
import { sendProductApprovedEmail, sendEmail } from '@/lib/email/service'
import { ProductRejectedEmail } from '@/lib/email/templates/product-rejected'
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
        react: ProductRejectedEmail({
          productName,
          productUrl,
          adminNotes
        }),
        userId,
        emailType: EMAIL_TYPES.PRODUCT_REJECTED,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}