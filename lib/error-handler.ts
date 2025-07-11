import { toast } from 'sonner'

export interface AppError {
  message: string
  code?: string
  status?: number
}

export function handleError(error: unknown, showToast = true): AppError {
  console.error('Application error:', error)

  let errorMessage = 'An unexpected error occurred'
  let errorCode: string | undefined
  let status: number | undefined

  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object') {
    const err = error as any
    errorMessage = err.message || err.error || errorMessage
    errorCode = err.code
    status = err.status
  }

  // Show user-friendly messages for common errors
  const userMessage = getUserFriendlyMessage(errorMessage, errorCode)
  
  if (showToast) {
    toast.error(userMessage)
  }

  return {
    message: userMessage,
    code: errorCode,
    status
  }
}

function getUserFriendlyMessage(message: string, code?: string): string {
  // Handle specific error codes
  if (code) {
    switch (code) {
      case 'AUTH_REQUIRED':
        return 'Please sign in to continue'
      case 'ADMIN_REQUIRED':
        return 'Admin access required'
      case 'PRODUCT_NOT_FOUND':
        return 'Product not found'
      case 'NOT_IN_QUEUE':
        return 'This product is not in the queue'
      case 'NOT_APPROVED':
        return 'This product must be approved first'
      case 'MISSING_FIELDS':
        return 'Please fill in all required fields'
    }
  }

  // Handle common error patterns
  if (message.includes('Network')) {
    return 'Network error. Please check your connection.'
  }
  
  if (message.includes('duplicate')) {
    return 'This already exists. Please try a different value.'
  }
  
  if (message.includes('Invalid email') || message.includes('Invalid password')) {
    return 'Invalid email or password'
  }
  
  if (message.includes('rate limit')) {
    return 'Too many requests. Please try again later.'
  }

  if (message.includes('Payment')) {
    return 'Payment processing error. Please try again.'
  }

  // Return the original message if no pattern matches
  return message
}

// Wrapper for async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    showToast?: boolean
    fallback?: T
    onError?: (error: AppError) => void
  }
): Promise<T | undefined> {
  try {
    return await operation()
  } catch (error) {
    const appError = handleError(error, options?.showToast ?? true)
    
    if (options?.onError) {
      options.onError(appError)
    }
    
    return options?.fallback
  }
}