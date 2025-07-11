import { resend, EMAIL_CONFIG, EMAIL_TYPES, type EmailType } from './config'
import { createClient } from '@/utils/supabase/server'
import { ProductApprovedEmail } from './templates/product-approved'
import { NewCommentEmail } from './templates/new-comment'
import { WelcomeEmail } from './templates/welcome'

interface EmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
  userId?: string
  emailType: EmailType
}

export async function sendEmail({ to, subject, react, userId, emailType }: EmailOptions) {
  try {
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.email}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      reply_to: EMAIL_CONFIG.replyTo,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    // Log email in database
    if (data?.id) {
      const supabase = createClient()
      await supabase.from('email_logs').insert({
        user_id: userId,
        email: Array.isArray(to) ? to[0] : to,
        email_type: emailType,
        subject,
        provider: 'resend',
        provider_message_id: data.id,
        status: 'sent',
      })
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Specific email sending functions

export async function sendProductApprovedEmail(
  userEmail: string,
  userId: string,
  productName: string,
  productId: string,
  queuePosition?: number
) {
  const productUrl = `${EMAIL_CONFIG.baseUrl}/product/${productId}`
  
  // Get user's email preferences
  const supabase = createClient()
  const { data: prefs } = await supabase
    .from('email_preferences')
    .select('product_approved')
    .eq('user_id', userId)
    .single()

  if (prefs && !prefs.product_approved) {
    return { success: false, reason: 'User opted out' }
  }

  // Get user's name
  const { data: user } = await supabase
    .from('users')
    .select('first_name')
    .eq('id', userId)
    .single()

  return sendEmail({
    to: userEmail,
    subject: `🎉 ${productName} has been approved!`,
    react: ProductApprovedEmail({
      productName,
      productUrl,
      queuePosition,
      userName: user?.first_name,
    }),
    userId,
    emailType: EMAIL_TYPES.PRODUCT_APPROVED,
  })
}

export async function sendNewCommentEmail(
  productOwnerId: string,
  productName: string,
  productId: string,
  commenterName: string,
  commentText: string
) {
  const supabase = createClient()
  
  // Get product owner's email and preferences
  const { data: owner } = await supabase
    .from('users')
    .select('email, first_name')
    .eq('id', productOwnerId)
    .single()

  if (!owner?.email) {
    return { success: false, reason: 'Owner email not found' }
  }

  // Check email preferences
  const { data: prefs } = await supabase
    .from('email_preferences')
    .select('new_comment')
    .eq('user_id', productOwnerId)
    .single()

  if (prefs && !prefs.new_comment) {
    return { success: false, reason: 'User opted out' }
  }

  const productUrl = `${EMAIL_CONFIG.baseUrl}/product/${productId}`

  return sendEmail({
    to: owner.email,
    subject: `💬 New comment on ${productName}`,
    react: NewCommentEmail({
      productName,
      productUrl,
      commenterName,
      commentText: commentText.length > 200 
        ? commentText.substring(0, 200) + '...' 
        : commentText,
      userName: owner.first_name,
    }),
    userId: productOwnerId,
    emailType: EMAIL_TYPES.NEW_COMMENT,
  })
}

// Check if user has email notifications enabled
export async function checkEmailPreferences(userId: string, emailType: EmailType) {
  const supabase = createClient()
  const { data: prefs } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!prefs) return true // Default to enabled if no preferences

  const preferenceMap: Record<EmailType, keyof typeof prefs> = {
    [EMAIL_TYPES.PRODUCT_APPROVED]: 'product_approved',
    [EMAIL_TYPES.PRODUCT_REJECTED]: 'product_rejected',
    [EMAIL_TYPES.NEW_COMMENT]: 'new_comment',
    [EMAIL_TYPES.PRODUCT_LIVE]: 'product_live',
    [EMAIL_TYPES.VOTE_MILESTONE]: 'vote_milestone',
    [EMAIL_TYPES.WELCOME]: 'product_approved', // Always send welcome
    [EMAIL_TYPES.PASSWORD_RESET]: 'product_approved', // Always send security
    [EMAIL_TYPES.WEEKLY_NEWSLETTER]: 'weekly_newsletter',
    [EMAIL_TYPES.PRODUCT_TIPS]: 'product_tips',
  }

  const prefKey = preferenceMap[emailType]
  return prefKey ? Boolean(prefs[prefKey]) : true
}

// Send welcome email to new users
export async function sendWelcomeEmail(
  userEmail: string,
  userId: string,
  userName?: string
) {
  const dashboardUrl = `${EMAIL_CONFIG.baseUrl}/dashboard`
  const submitUrl = `${EMAIL_CONFIG.baseUrl}/submit`

  return sendEmail({
    to: userEmail,
    subject: 'Welcome to Sheep It! 🐑',
    react: WelcomeEmail({
      userName,
      dashboardUrl,
      submitUrl,
    }),
    userId,
    emailType: EMAIL_TYPES.WELCOME,
  })
}