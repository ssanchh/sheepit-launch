'use client'

import { useState, useEffect } from 'react'
import { getTimeUntilSunday } from '../lib/utils'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilSunday())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilSunday())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center">
      <div className="text-sm text-gray-600 mb-2">Time until next launch period</div>
      <div className="flex items-center justify-center space-x-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">days</div>
        </div>
        <div className="text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">hours</div>
        </div>
        <div className="text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">mins</div>
        </div>
        <div className="text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">secs</div>
        </div>
      </div>
    </div>
  )
} 