import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { ApiError, handleApiError, requireAuth } from '@/lib/api-error-handler'
import { sendNewCommentEmail } from '@/lib/email/service'

export async function POST(request: NextRequest) {
  try {
    const { content, productId, weekId } = await request.json()
    
    if (!content || !productId || !weekId) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS')
    }

    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    requireAuth(user)
    
    if (!user) {
      throw new ApiError('User not authenticated', 401, 'UNAUTHORIZED')
    }

    // Insert the comment
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert([{
        content: content.trim(),
        user_id: user.id,
        product_id: productId,
        week_id: weekId,
      }])
      .select()
      .single()

    if (insertError) throw insertError

    // Get product and owner details for email notification
    const { data: product } = await supabase
      .from('products')
      .select(`
        name,
        created_by,
        users:users!created_by (
          email,
          first_name
        )
      `)
      .eq('id', productId)
      .single()

    // Get commenter details
    const { data: commenter } = await supabase
      .from('users')
      .select('first_name, last_name, handle')
      .eq('id', user.id)
      .single()

    // Send email notification if it's not the owner commenting on their own product
    if (product && product.created_by !== user.id) {
      const productOwner = Array.isArray(product.users) ? product.users[0] : product.users
      
      if (productOwner?.email) {
        const commenterName = commenter?.handle 
          ? `@${commenter.handle}`
          : commenter?.first_name 
          ? `${commenter.first_name}${commenter.last_name ? ' ' + commenter.last_name : ''}`
          : 'Someone'

        // Send notification in the background (don't wait for it)
        sendNewCommentEmail(
          product.created_by,
          product.name,
          productId,
          commenterName,
          content
        ).catch(error => {
          console.error('Failed to send comment notification:', error)
        })
      }
    }

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    return handleApiError(error)
  }
}