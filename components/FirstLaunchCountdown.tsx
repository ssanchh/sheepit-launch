'use client'

import { useState, useEffect } from 'react'
import { Calendar, Rocket, Users } from 'lucide-react'
import Link from 'next/link'

export default function FirstLaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const firstLaunch = new Date('2025-08-04T00:00:00')
      const now = new Date()
      const diff = firstLaunch.getTime() - now.getTime()

      if (diff <= 0) {
        return null
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Set initial time
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Don't render if past launch date
  if (!timeLeft) {
    return null
  }

  return (
    <div className="relative my-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl" />
      
      {/* Content */}
      <div className="relative px-8 py-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-orange-200 mb-6">
          <Rocket className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-600">First Launch</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#2D2D2D] mb-3">
          We're launching on August 4th!
        </h2>
        
        {/* Description */}
        <p className="text-lg text-[#666666] mb-8 max-w-2xl mx-auto">
          Be part of history. Join our inaugural launch party where the first batch of indie products will go live together.
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-[#2D2D2D]">{String(timeLeft.days).padStart(2, '0')}</span>
            </div>
            <span className="text-sm text-[#666666]">Days</span>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-[#2D2D2D]">{String(timeLeft.hours).padStart(2, '0')}</span>
            </div>
            <span className="text-sm text-[#666666]">Hours</span>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-[#2D2D2D]">{String(timeLeft.minutes).padStart(2, '0')}</span>
            </div>
            <span className="text-sm text-[#666666]">Minutes</span>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-[#2D2D2D]">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
            <span className="text-sm text-[#666666]">Seconds</span>
          </div>
        </div>

        {/* CTA */}
        <Link 
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg"
        >
          <Calendar className="w-5 h-5" />
          Reserve Your Spot for Launch Day
        </Link>

        {/* Additional info */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#666666]">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Limited spots available</span>
          </div>
          <div className="w-1 h-1 bg-[#999999] rounded-full" />
          <div>
            <span>Weekly launches every Monday after</span>
          </div>
        </div>
      </div>
    </div>
  )
}