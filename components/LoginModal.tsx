'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { X, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export default function LoginModal({ isOpen, onClose, redirectTo = '/' }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signInWithEmail, signInWithGoogle, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && isOpen) {
      onClose()
      router.push(redirectTo)
    }
  }, [user, isOpen, redirectTo, router, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signInWithEmail(email)
    
    if (error) {
      toast.error(error.message)
    } else {
      setEmailSent(true)
      toast.success('Check your email for the login link!')
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    
    if (error) {
      toast.error(error.message)
    }
    
    setLoading(false)
  }

  const resetModal = () => {
    setEmailSent(false)
    setEmail('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={resetModal}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={resetModal}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {emailSent ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
                Check your email!
              </h3>
              <p className="text-[#666666] mb-6">
                We've sent a magic link to <span className="font-medium text-[#2D2D2D]">{email}</span>
              </p>
              <button
                onClick={resetModal}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Image 
                  src="/assets/images/logo.svg" 
                  alt="Sheep It" 
                  width={64} 
                  height={64}
                  className="mx-auto mb-4"
                />
                <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
                  Welcome back
                </h2>
                <p className="text-[#666666]">
                  Sign in to submit and vote on products
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-[#2D2D2D] placeholder-[#999999]"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2D2D2D] text-white py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {loading ? 'Sending...' : 'Send magic link'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E5E5]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-[#999999]">or</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white border border-[#E5E5E5] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-[#2D2D2D]">Continue with Google</span>
              </button>

              {/* Footer text */}
              <p className="text-center text-sm text-[#999999] mt-6">
                By signing in, you agree to our{' '}
                <a href="/terms-and-conditions" className="text-orange-600 hover:text-orange-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-orange-600 hover:text-orange-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}