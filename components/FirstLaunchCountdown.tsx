'use client'

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
    <div className="my-10">
      <div className="bg-white rounded-2xl border-4 border-[#E5E5E5] hover:border-orange-400 transition-all duration-300 p-8 group">
        <div className="text-center">
          {/* Icon and Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/assets/images/logo.svg" 
              alt="Sheep It" 
              width={40} 
              height={40}
              className="opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <h2 className="text-2xl font-bold text-[#2D2D2D]">
              Launching August 4th
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="text-[#666666] mb-6 max-w-lg mx-auto">
            Be part of the first batch of products to launch on Sheep It
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="bg-[#F5F5F5] rounded-lg w-16 h-16 flex items-center justify-center mb-1 group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl font-bold text-[#2D2D2D]">{String(timeLeft.days).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-[#999999]">Days</span>
            </div>
            <div className="text-center">
              <div className="bg-[#F5F5F5] rounded-lg w-16 h-16 flex items-center justify-center mb-1 group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl font-bold text-[#2D2D2D]">{String(timeLeft.hours).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-[#999999]">Hours</span>
            </div>
            <div className="text-center">
              <div className="bg-[#F5F5F5] rounded-lg w-16 h-16 flex items-center justify-center mb-1 group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl font-bold text-[#2D2D2D]">{String(timeLeft.minutes).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-[#999999]">Minutes</span>
            </div>
            <div className="text-center">
              <div className="bg-[#F5F5F5] rounded-lg w-16 h-16 flex items-center justify-center mb-1 group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl font-bold text-[#2D2D2D]">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-[#999999]">Seconds</span>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D2D2D] text-white rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
          >
            Submit Your Product
          </Link>

          {/* Info */}
          <p className="text-xs text-[#999999] mt-4">
            Limited spots • Weekly launches every Monday after
          </p>
        </div>
      </div>
    </div>
  )
}