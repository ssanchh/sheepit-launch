'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Check, Clock, Zap, Shield, ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function MVPServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idea: '',
    features: '',
    timeline: 'urgent'
  })

  const features = [
    { icon: Zap, title: 'Fast Development', description: '14-day turnaround from kickoff to launch' },
    { icon: Shield, title: 'Fixed Price', description: '$2,000 flat fee, no surprises' },
    { icon: Clock, title: 'Launch Ready', description: 'Automatic submission to next Monday batch' }
  ]

  const processSteps = [
    { day: 'Day 1-2', title: 'Discovery & Planning', description: 'We discuss your idea and define the MVP scope' },
    { day: 'Day 3-5', title: 'Design & Setup', description: 'UI/UX design and project architecture' },
    { day: 'Day 6-11', title: 'Development', description: 'Building your core features' },
    { day: 'Day 12-13', title: 'Testing & Polish', description: 'Bug fixes and final adjustments' },
    { day: 'Day 14', title: 'Launch', description: 'Deploy to production and submit to Sheep It' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send email via mailto for now
      const subject = encodeURIComponent('MVP Building Service Request')
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Timeline: ${formData.timeline === 'urgent' ? 'ASAP' : 'Flexible'}

Idea Description:
${formData.idea}

Core Features:
${formData.features}
      `)
      
      window.location.href = `mailto:mvp@sheepit.io?subject=${subject}&body=${body}`
      
      toast.success('Request sent! We\'ll get back to you within 24 hours.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        idea: '',
        features: '',
        timeline: 'urgent'
      })
    } catch (error) {
      toast.error('Failed to send request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            MVP Building Service
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Launch your idea in 2 weeks. We build your MVP while you focus on finding customers.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 text-center hover:border-purple-400 transition-all">
              <feature.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-[#2D2D2D] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#666666]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl border-4 border-[#E5E5E5] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Full-stack web application (React + Node.js or similar)',
              'Up to 3 core features based on your requirements',
              'Mobile-responsive design that works on all devices',
              'Basic user authentication (signup, login, password reset)',
              'Database setup and basic data models',
              'Deployment to production (Vercel, Netlify, or similar)',
              '30 days of bug fixes after launch',
              'Source code ownership transfers to you',
              'Basic documentation for future development',
              'Automatic submission to next Monday\'s Sheep It batch'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-[#666666]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-4 border-[#E5E5E5] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">The Process</h2>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full flex-shrink-0">
                  {step.day}
                </div>
                <div>
                  <h3 className="font-semibold text-[#2D2D2D] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#666666]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Proposal Form */}
        <div className="bg-white rounded-2xl border-4 border-[#E5E5E5] p-8">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Submit Your Proposal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#E5E5E5] rounded-lg focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#E5E5E5] rounded-lg focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Describe Your Idea
              </label>
              <textarea
                id="idea"
                required
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border-2 border-[#E5E5E5] rounded-lg focus:border-purple-400 focus:outline-none transition-colors resize-none"
                placeholder="What problem are you solving? Who is your target audience?"
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Core Features (Up to 3)
              </label>
              <textarea
                id="features"
                required
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-[#E5E5E5] rounded-lg focus:border-purple-400 focus:outline-none transition-colors resize-none"
                placeholder="1. User registration and profiles\n2. Product marketplace\n3. Payment processing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Timeline
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timeline"
                    value="urgent"
                    checked={formData.timeline === 'urgent'}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-[#666666]">I need this ASAP (start within 3 days)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timeline"
                    value="flexible"
                    checked={formData.timeline === 'flexible'}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-[#666666]">I'm flexible with the start date</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
              <p className="text-sm text-[#666666]">
                We'll review your proposal and get back to you within 24 hours
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit Proposal'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}