'use client'

import { useState, useEffect } from 'react'
import { getTimeUntilSunday } from '../lib/utils'
import { createClient } from '../utils/supabase/client'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasTransitioned, setHasTransitioned] = useState(false)
  const [isBeforeFirstLaunch, setIsBeforeFirstLaunch] = useState(true)

  const triggerWeekTransition = async () => {
    if (isTransitioning || hasTransitioned) return
    
    setIsTransitioning(true)
    console.log('🚀 Triggering automatic week transition...')
    
    try {
      const supabase = createClient()
      
      // Use the new automatic transition function
      const { data, error } = await supabase.rpc('auto_weekly_transition')
      
      if (error) {
        console.error('❌ Week transition failed:', error)
        throw error
      }
      
      const result = data?.[0]
      if (result) {
        console.log('✅ Week transition completed:', result.message)
        console.log(`📦 ${result.products_made_live} products made live`)
        setHasTransitioned(true)
        
        // Refresh the page to show new live products
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }
      
    } catch (error) {
      console.error('❌ Week transition failed:', error)
    } finally {
      setIsTransitioning(false)
    }
  }

  useEffect(() => {
    // Check if we're before the first launch
    const firstLaunch = new Date('2025-08-04T00:00:00')
    const now = new Date()
    setIsBeforeFirstLaunch(now < firstLaunch)
    
    // Set initial time only on client
    try {
      setTimeLeft(getTimeUntilSunday())
    } catch (error) {
      console.error('Error getting time until Sunday:', error)
    }
    
    const timer = setInterval(() => {
      try {
        const newTimeLeft = getTimeUntilSunday()
        setTimeLeft(newTimeLeft)
        
        // Check if countdown reached 0
        if (newTimeLeft && 
            newTimeLeft.days === 0 && 
            newTimeLeft.hours === 0 && 
            newTimeLeft.minutes === 0 && 
            newTimeLeft.seconds === 0) {
          triggerWeekTransition()
        }
      } catch (error) {
        console.error('Error updating countdown:', error)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Show transition status
  if (isTransitioning) {
    return (
      <div className="text-left">
        <div className="text-xs text-indigo-600 mb-1">Transitioning...</div>
        <div className="text-sm font-mono font-semibold text-indigo-600">New Week!</div>
      </div>
    )
  }

  if (hasTransitioned) {
    return (
      <div className="text-left">
        <div className="text-xs text-green-600 mb-1">Started!</div>
        <div className="text-sm font-mono font-semibold text-green-600">New Cycle</div>
      </div>
    )
  }

  // Show special message before first launch
  if (isBeforeFirstLaunch) {
    return (
      <div className="text-left">
        <div className="text-xs text-orange-600 mb-1">First Launch</div>
        <div className="text-sm font-semibold text-orange-600">Aug 4, 2025</div>
      </div>
    )
  }
  
  if (!timeLeft || typeof timeLeft !== 'object' || typeof timeLeft.days !== 'number') {
    return (
      <div className="text-left">
        <div className="text-xs text-gray-500 mb-1">Ends in</div>
        <div className="text-sm font-mono font-semibold text-gray-400">--:--:--:--</div>
      </div>
    )
  }

  return (
    <div className="text-left">
      <div className="text-xs text-gray-500 mb-1">Ends in</div>
      <div className="flex items-center gap-1 text-sm font-mono">
        <span className="font-semibold text-gray-900">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-gray-400">:</span>
        <span className="font-semibold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-gray-400">:</span>
        <span className="font-semibold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-gray-400">:</span>
        <span className="font-semibold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  )
} 