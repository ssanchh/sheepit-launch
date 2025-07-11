'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Bell, BellOff, Mail } from 'lucide-react'

interface EmailPreferencesProps {
  userId: string
}

export default function EmailPreferences({ userId }: EmailPreferencesProps) {
  const [preferences, setPreferences] = useState({
    product_approved: true,
    product_rejected: true,
    new_comment: true,
    product_live: true,
    vote_milestone: true,
    weekly_newsletter: true,
    product_tips: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setPreferences(data)
    }
    setLoading(false)
  }

  const updatePreference = async (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('email_preferences')
      .upsert({
        user_id: userId,
        [key]: value,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      toast.error('Failed to update preferences')
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }))
    } else {
      toast.success('Preferences updated')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const notificationGroups = [
    {
      title: 'Product Notifications',
      icon: Bell,
      items: [
        { key: 'product_approved', label: 'Product approved', description: 'When your product is approved' },
        { key: 'product_rejected', label: 'Product rejected', description: 'When your product needs changes' },
        { key: 'product_live', label: 'Product goes live', description: 'When your product launches' },
        { key: 'new_comment', label: 'New comments', description: 'When someone comments on your product' },
        { key: 'vote_milestone', label: 'Vote milestones', description: 'When your product hits vote milestones' },
      ]
    },
    {
      title: 'Newsletter & Updates',
      icon: Mail,
      items: [
        { key: 'weekly_newsletter', label: 'Weekly newsletter', description: 'Top products and winner announcements' },
        { key: 'product_tips', label: 'Product tips', description: 'Tips to improve your launch success' },
      ]
    }
  ]

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6">Email Preferences</h2>
      
      <div className="space-y-8">
        {notificationGroups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-2 mb-4">
              <group.icon className="w-5 h-5 text-[#666666]" />
              <h3 className="font-medium text-[#2D2D2D]">{group.title}</h3>
            </div>
            
            <div className="space-y-3">
              {group.items.map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#D5D5D5] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences[item.key as keyof typeof preferences]}
                    onChange={(e) => updatePreference(item.key as keyof typeof preferences, e.target.checked)}
                    disabled={saving}
                    className="mt-0.5 w-4 h-4 text-orange-600 bg-white border-[#D5D5D5] rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#2D2D2D] text-sm">{item.label}</div>
                    <div className="text-sm text-[#666666] mt-0.5">{item.description}</div>
                  </div>
                  {preferences[item.key as keyof typeof preferences] ? (
                    <Bell className="w-4 h-4 text-green-600" />
                  ) : (
                    <BellOff className="w-4 h-4 text-[#999999]" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#F5F5F5] rounded-lg">
        <p className="text-sm text-[#666666]">
          <strong>Note:</strong> You'll always receive important account and security-related emails.
        </p>
      </div>
    </div>
  )
}