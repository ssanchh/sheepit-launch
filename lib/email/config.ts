import { Resend } from 'resend'

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    name: 'Sheep It',
    email: process.env.EMAIL_FROM || 'notifications@sheepit.com'
  },
  replyTo: process.env.EMAIL_REPLY_TO || 'hello@sheepit.com',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// Email types for logging
export const EMAIL_TYPES = {
  // Transactional
  WELCOME: 'welcome',
  PRODUCT_APPROVED: 'product_approved',
  PRODUCT_REJECTED: 'product_rejected',
  NEW_COMMENT: 'new_comment',
  PRODUCT_LIVE: 'product_live',
  VOTE_MILESTONE: 'vote_milestone',
  PASSWORD_RESET: 'password_reset',
  
  // Marketing (handled by Beehiiv)
  WEEKLY_NEWSLETTER: 'weekly_newsletter',
  PRODUCT_TIPS: 'product_tips'
} as const

export type EmailType = typeof EMAIL_TYPES[keyof typeof EMAIL_TYPES]

// Beehiiv configuration
export const BEEHIIV_CONFIG = {
  apiKey: process.env.BEEHIIV_API_KEY || '',
  publicationId: process.env.BEEHIIV_PUBLICATION_ID || '',
  webhookSecret: process.env.BEEHIIV_WEBHOOK_SECRET || ''
}