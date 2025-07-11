'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Header from '@/components/Header'
import { Upload, Globe, FileText, Video, Save, Send, ArrowLeft, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useLoginModal } from '@/contexts/LoginModalContext'

interface ProductDraft {
  name: string
  tagline: string
  description: string
  website_url: string
  logo_file?: File
  logo_preview?: string
  video_url: string
}

export default function LaunchDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { openLoginModal } = useLoginModal()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<ProductDraft>({
    name: '',
    tagline: '',
    description: '',
    website_url: '',
    video_url: ''
  })
  const [errors, setErrors] = useState<Partial<ProductDraft>>({})

  useEffect(() => {
    if (user) {
      loadDraft()
    }
  }, [user])

  const loadDraft = async () => {
    // In a real app, you'd load saved drafts from a drafts table
    const savedDraft = localStorage.getItem(`product-draft-${user?.id}`)
    if (savedDraft) {
      const draft = JSON.parse(savedDraft)
      setProduct(draft)
      toast.info('Draft loaded from previous session')
    }
  }

  const saveDraft = async () => {
    setSaving(true)
    localStorage.setItem(`product-draft-${user?.id}`, JSON.stringify(product))
    toast.success('Draft saved!')
    setSaving(false)
  }

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<ProductDraft> = {}
    
    switch (stepNumber) {
      case 1:
        if (!product.name) newErrors.name = 'Product name is required'
        if (!product.tagline) newErrors.tagline = 'Tagline is required'
        if (product.tagline && product.tagline.length > 60) newErrors.tagline = 'Tagline must be 60 characters or less'
        break
      case 2:
        if (!product.description) newErrors.description = 'Description is required'
        if (product.description && product.description.length < 50) newErrors.description = 'Description must be at least 50 characters'
        break
      case 3:
        if (!product.website_url) newErrors.website_url = 'Website URL is required'
        if (product.website_url && !isValidUrl(product.website_url)) newErrors.website_url = 'Please enter a valid URL'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      saveDraft()
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo must be less than 5MB')
        return
      }
      
      setProduct({ 
        ...product, 
        logo_file: file,
        logo_preview: URL.createObjectURL(file)
      })
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit a product')
      openLoginModal('/launch')
      return
    }
    
    if (!validateStep(3)) return
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      let logo_url = ''
      
      // Upload logo if provided
      if (product.logo_file) {
        const fileExt = product.logo_file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-logos')
          .upload(fileName, product.logo_file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-logos')
          .getPublicUrl(fileName)
        
        logo_url = publicUrl
      }
      
      // Create product
      const { error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          website_url: product.website_url,
          logo_url,
          video_url: product.video_url,
          created_by: user?.id,
          status: 'pending'
        }])
      
      if (error) throw error
      
      // Clear draft
      localStorage.removeItem(`product-draft-${user?.id}`)
      
      toast.success('Product submitted for review!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error submitting product:', error)
      toast.error(error.message || 'Failed to submit product')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Description', icon: Sparkles },
    { number: 3, title: 'Links & Media', icon: Globe },
    { number: 4, title: 'Review', icon: Check }
  ]

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Sign In Banner for Non-Authenticated Users */}
        {!user && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <p className="text-sm text-yellow-800">
                  Please sign in to submit your product. Your progress will be saved as you go.
                </p>
              </div>
              <button
                onClick={() => openLoginModal('/launch')}
                className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  step >= s.number 
                    ? 'bg-[#2D2D2D] text-white' 
                    : 'bg-white border-2 border-[#E5E5E5] text-[#999999]'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 transition-all ${
                    step > s.number ? 'bg-[#2D2D2D]' : 'bg-[#E5E5E5]'
                  }`} style={{ width: '100px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map(s => (
              <span key={s.number} className={`font-medium ${
                step >= s.number ? 'text-[#2D2D2D]' : 'text-[#999999]'
              }`}>
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Let's start with the basics</h2>
                <p className="text-[#666666]">Tell us about your product</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-300' : 'border-[#E5E5E5]'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="My Awesome Product"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Tagline
                    <span className="text-[#999999] ml-2">({product.tagline.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={product.tagline}
                    onChange={(e) => setProduct({ ...product, tagline: e.target.value })}
                    maxLength={60}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.tagline ? 'border-red-300' : 'border-[#E5E5E5]'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="A short and catchy description"
                  />
                  {errors.tagline && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.tagline}
                    </p>
                  )}
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Logo (optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    {product.logo_preview ? (
                      <div className="relative">
                        <Image
                          src={product.logo_preview}
                          alt="Logo preview"
                          width={80}
                          height={80}
                          className="rounded-lg border border-[#E5E5E5]"
                        />
                        <button
                          onClick={() => setProduct({ ...product, logo_file: undefined, logo_preview: undefined })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 border-2 border-dashed border-[#E5E5E5] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#D5D5D5] transition-colors">
                        <Upload className="w-6 h-6 text-[#999999]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="text-sm text-[#666666]">
                      <p>PNG, JPG up to 5MB</p>
                      <p>Recommended: 200x200px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Describe your product</h2>
                <p className="text-[#666666]">Help users understand what makes your product special</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Description
                  <span className="text-[#999999] ml-2">({product.description.length} characters)</span>
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description ? 'border-red-300' : 'border-[#E5E5E5]'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                  placeholder="Explain what your product does, who it's for, and what makes it unique..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for a great description:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Explain the problem your product solves</li>
                    <li>• Highlight key features and benefits</li>
                    <li>• Mention your target audience</li>
                    <li>• Keep it concise but informative</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Links & Media */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Where can people find you?</h2>
                <p className="text-[#666666]">Add links to help users learn more</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <input
                      type="url"
                      value={product.website_url}
                      onChange={(e) => setProduct({ ...product, website_url: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.website_url ? 'border-red-300' : 'border-[#E5E5E5]'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      placeholder="https://myproduct.com"
                    />
                  </div>
                  {errors.website_url && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.website_url}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Demo Video URL (optional)
                  </label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <input
                      type="url"
                      value={product.video_url}
                      onChange={(e) => setProduct({ ...product, video_url: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <p className="mt-1 text-sm text-[#666666]">
                    YouTube, Vimeo, or Loom links work best
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Review your submission</h2>
                <p className="text-[#666666]">Make sure everything looks good before submitting</p>
              </div>

              <div className="space-y-6">
                {/* Preview Card */}
                <div className="bg-[#FDFCFA] rounded-xl p-6 border border-[#E5E5E5]">
                  <div className="flex items-start space-x-4">
                    {product.logo_preview ? (
                      <Image
                        src={product.logo_preview}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-lg border border-[#E5E5E5]"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg flex items-center justify-center border border-[#E5E5E5]">
                        <span className="text-[#666666] font-medium text-lg">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2D2D2D]">{product.name}</h3>
                      <p className="text-[#666666] mt-1">{product.tagline}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-[#2D2D2D] mb-1">Description</h4>
                      <p className="text-sm text-[#666666]">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <a href={product.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                      {product.video_url && (
                        <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          Demo Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Your product will be reviewed by our team</li>
                    <li>• You'll receive an email once approved</li>
                    <li>• Approved products join the launch queue</li>
                    <li>• Products go live based on queue position</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E5E5E5]">
            <div className="flex items-center space-x-3">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-[#666666] hover:text-[#2D2D2D] flex items-center transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-4 py-2 text-[#666666] hover:text-[#2D2D2D] flex items-center transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1D1D1D] flex items-center transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}