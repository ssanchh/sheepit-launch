import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    // Check for common database errors
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'This resource already exists' },
        { status: 409 }
      )
    }

    if (error.message.includes('foreign key')) {
      return NextResponse.json(
        { error: 'Referenced resource not found' },
        { status: 400 }
      )
    }

    if (error.message.includes('JWT')) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

export function requireAuth(user: any) {
  if (!user) {
    throw new ApiError('Authentication required', 401, 'AUTH_REQUIRED')
  }
}

export function requireAdmin(user: any, isAdmin: boolean) {
  requireAuth(user)
  if (!isAdmin) {
    throw new ApiError('Admin access required', 403, 'ADMIN_REQUIRED')
  }
}