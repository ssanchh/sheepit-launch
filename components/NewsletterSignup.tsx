'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

interface NewsletterSignupProps {
  className?: string
  variant?: 'default' | 'compact'
}

export default function NewsletterSignup({ className = '', variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      toast.success('Welcome to the Sheep It newsletter! 🐑')
      setEmail('')
      setFirstName('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1D1D1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    )
  }

  return (
    <div className={`bg-white rounded-xl p-6 sm:p-8 border-4 border-[#E5E5E5] ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#2D2D2D] mb-2">
          Stay in the loop
        </h3>
        <p className="text-sm sm:text-base text-[#666666] mb-6">
          Get weekly updates on new launches, winner announcements, and exclusive tips.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="flex-1 px-4 py-3 border-2 border-[#E5E5E5] rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
              disabled={loading}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 border-2 border-[#E5E5E5] rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1D1D1D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
        </form>
        
        <p className="text-xs text-[#999999] mt-4">
          No spam, unsubscribe anytime. By subscribing, you agree to our terms.
        </p>
      </div>
    </div>
  )
}