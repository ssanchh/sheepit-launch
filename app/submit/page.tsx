'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Upload, AlertCircle, Sparkles, Globe, Users, Image as ImageIcon, Twitter, X, Zap, Crown } from 'lucide-react'
import Image from 'next/image'
import Header from '../../components/Header'
import { useLoginModal } from '@/contexts/LoginModalContext'

interface ProductDraft {
  name: string
  tagline: string
  description: string
  website_url: string
  logo_file?: File
  logo_preview?: string
  video_url: string
  featured_image_file?: File
  featured_image_preview?: string
  screenshot_files?: File[]
  screenshot_previews?: string[]
  twitter_url: string
  team_type: 'solo' | 'team' | ''
  primary_goal: string
  categories: string[]
}

function SubmitContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null)
  const [activeSection, setActiveSection] = useState('basics')
  
  // Check for premium or featured flags
  const isPremium = searchParams.get('premium') === 'true'
  const isFeatured = searchParams.get('featured') === 'true'
  const [product, setProduct] = useState<ProductDraft>({
    name: '',
    tagline: '',
    description: '',
    website_url: '',
    video_url: '',
    twitter_url: '',
    screenshot_files: [],
    screenshot_previews: [],
    team_type: '',
    primary_goal: '',
    categories: []
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductDraft, string>>>({})

  // Refs for sections
  const basicsRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!authLoading && !user) {
      openLoginModal('/submit')
      return
    }
    
    if (user) {
      checkProfileCompletion()
    }
  }, [user, authLoading, router])

  const checkProfileCompletion = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('profile_completed')
      .eq('id', user?.id)
      .single()
    
    if (data) {
      setProfileCompleted(data.profile_completed || false)
      if (!data.profile_completed) {
        toast.error('Please complete your profile first')
        router.push('/dashboard?tab=profile')
      }
    }
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      basics: basicsRef,
      details: detailsRef,
      media: mediaRef,
      links: linksRef
    }
    
    refs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sections = [
    { id: 'basics', name: 'Basics', icon: Sparkles },
    { id: 'details', name: 'Details', icon: Users },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'links', name: 'Links', icon: Globe }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductDraft, string>> = {}
    
    if (!product.name) newErrors.name = 'Product name is required'
    if (!product.tagline) newErrors.tagline = 'Tagline is required'
    if (product.tagline && product.tagline.length > 60) newErrors.tagline = 'Tagline must be 60 characters or less'
    if (!product.description) newErrors.description = 'Description is required'
    if (product.description && product.description.length < 50) newErrors.description = 'Description must be at least 50 characters'
    if (!product.team_type) newErrors.team_type = 'Please select team type'
    if (product.categories.length === 0) newErrors.categories = 'Add at least one category'
    if (!product.website_url) newErrors.website_url = 'Website URL is required'
    if (product.website_url && !isValidUrl(product.website_url)) newErrors.website_url = 'Please enter a valid URL'
    
    setErrors(newErrors)
    
    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0]
      if (['name', 'tagline'].includes(firstError)) scrollToSection('basics')
      else if (['description', 'team_type', 'categories'].includes(firstError)) scrollToSection('details')
      else if (['website_url'].includes(firstError)) scrollToSection('links')
    }
    
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

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB')
        return
      }
      
      setProduct({ 
        ...product, 
        featured_image_file: file,
        featured_image_preview: URL.createObjectURL(file)
      })
    }
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentScreenshots = product.screenshot_files || []
    
    if (currentScreenshots.length + files.length > 3) {
      toast.error('You can upload a maximum of 3 screenshots')
      return
    }
    
    const newFiles: File[] = []
    const newPreviews: string[] = []
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`)
        continue
      }
      newFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }
    
    setProduct({
      ...product,
      screenshot_files: [...currentScreenshots, ...newFiles],
      screenshot_previews: [...(product.screenshot_previews || []), ...newPreviews]
    })
  }

  const removeScreenshot = (index: number) => {
    const newFiles = [...(product.screenshot_files || [])]
    const newPreviews = [...(product.screenshot_previews || [])]
    
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setProduct({
      ...product,
      screenshot_files: newFiles,
      screenshot_previews: newPreviews
    })
  }

  const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const category = categoryInput.trim()
      if (category && !product.categories.includes(category) && product.categories.length < 5) {
        setProduct(prev => ({
          ...prev,
          categories: [...prev.categories, category]
        }))
        setCategoryInput('')
        setErrors({ ...errors, categories: undefined })
      }
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== categoryToRemove)
    }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      let logo_url = ''
      let featured_image_url = ''
      let screenshot_urls: string[] = []
      
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
      
      // Upload featured image if provided
      if (product.featured_image_file) {
        const fileExt = product.featured_image_file.name.split('.').pop()
        const fileName = `featured-${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-logos')
          .upload(fileName, product.featured_image_file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-logos')
          .getPublicUrl(fileName)
        
        featured_image_url = publicUrl
      }
      
      // Upload screenshots if provided
      if (product.screenshot_files && product.screenshot_files.length > 0) {
        for (const file of product.screenshot_files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `screenshot-${Math.random()}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-logos')
            .upload(fileName, file)
          
          if (uploadError) throw uploadError
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-logos')
            .getPublicUrl(fileName)
          
          screenshot_urls.push(publicUrl)
        }
      }
      
      const { error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          website_url: product.website_url,
          logo_url,
          video_url: product.video_url,
          featured_image_url,
          screenshot_urls,
          twitter_url: product.twitter_url,
          team_type: product.team_type,
          primary_goal: product.primary_goal,
          categories: product.categories,
          created_by: user?.id,
          status: 'pending'
        }])
      
      if (error) throw error
      
      toast.success('Product submitted for review!')
      router.push('/dashboard?tab=products')
    } catch (error: any) {
      console.error('Error submitting product:', error)
      toast.error(error.message || 'Failed to submit product')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || profileCompleted === null) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2D2D2D]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-sm font-semibold text-[#999999] uppercase tracking-wider mb-6">Product Information</h2>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                      activeSection === section.id
                        ? 'bg-[#2D2D2D] text-white'
                        : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#2D2D2D]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Submit Your Product</h1>
            <p className="text-[#666666]">Share your creation with thousands of makers and early adopters</p>
          </div>

          <div className="space-y-12">
            {/* Basics Section */}
            <section ref={basicsRef} id="basics" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D]">The Basics</h2>
              </div>
              
              <div className="space-y-6">
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
              </div>
            </section>

            {/* Details Section */}
            <section ref={detailsRef} id="details" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D]">Product Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Description
                    <span className="text-[#999999] ml-2">({product.description.length} characters)</span>
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    rows={6}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Team Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProduct({ ...product, team_type: 'solo' })}
                      className={`px-4 py-3 rounded-lg border ${
                        product.team_type === 'solo' 
                          ? 'border-[#2D2D2D] bg-[#F5F5F5] text-[#2D2D2D]' 
                          : 'border-[#E5E5E5] text-[#666666] hover:border-[#D5D5D5]'
                      } font-medium transition-all`}
                    >
                      👤 Solo Founder
                    </button>
                    <button
                      type="button"
                      onClick={() => setProduct({ ...product, team_type: 'team' })}
                      className={`px-4 py-3 rounded-lg border ${
                        product.team_type === 'team' 
                          ? 'border-[#2D2D2D] bg-[#F5F5F5] text-[#2D2D2D]' 
                          : 'border-[#E5E5E5] text-[#666666] hover:border-[#D5D5D5]'
                      } font-medium transition-all`}
                    >
                      👥 Team
                    </button>
                  </div>
                  {errors.team_type && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.team_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Categories
                    <span className="text-[#999999] ml-2">(Up to 5 tags)</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyDown={handleAddCategory}
                      className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Type a category and press Enter (e.g., SaaS, Productivity, AI)"
                      disabled={product.categories.length >= 5}
                    />
                    {product.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#2D2D2D] text-white"
                          >
                            {category}
                            <button
                              onClick={() => removeCategory(category)}
                              className="ml-2 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.categories && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.categories}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    What's your primary goal? (optional)
                  </label>
                  <select
                    value={product.primary_goal}
                    onChange={(e) => setProduct({ ...product, primary_goal: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a goal...</option>
                    <option value="traffic">Get more traffic</option>
                    <option value="users">Acquire early users</option>
                    <option value="feedback">Collect feedback</option>
                    <option value="validation">Validate the idea</option>
                    <option value="exposure">Build brand awareness</option>
                    <option value="network">Connect with other makers</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Media Section */}
            <section ref={mediaRef} id="media" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D]">Media</h2>
              </div>

              <div className="space-y-6">
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

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Featured Image or Screenshot
                    <span className="text-[#999999] ml-2">(Recommended)</span>
                  </label>
                  {product.featured_image_preview ? (
                    <div className="relative">
                      <Image
                        src={product.featured_image_preview}
                        alt="Featured image preview"
                        width={600}
                        height={338}
                        className="w-full rounded-lg border border-[#E5E5E5] object-cover"
                      />
                      <button
                        onClick={() => setProduct({ ...product, featured_image_file: undefined, featured_image_preview: undefined })}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="block w-full border-2 border-dashed border-[#E5E5E5] rounded-lg p-8 text-center cursor-pointer hover:border-[#D5D5D5] transition-colors">
                      <Upload className="w-8 h-8 text-[#999999] mx-auto mb-2" />
                      <p className="text-sm text-[#666666]">Upload a screenshot or image</p>
                      <p className="text-xs text-[#999999] mt-1">PNG, JPG up to 10MB (16:9 ratio recommended)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Product Screenshots
                    <span className="text-[#999999] ml-2">(Up to 3, optional)</span>
                  </label>
                  <div className="space-y-3">
                    {/* Display uploaded screenshots */}
                    {product.screenshot_previews && product.screenshot_previews.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {product.screenshot_previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={preview}
                              alt={`Screenshot ${index + 1}`}
                              width={200}
                              height={112}
                              className="w-full h-24 object-cover rounded-lg border border-[#E5E5E5]"
                            />
                            <button
                              onClick={() => removeScreenshot(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload button if less than 3 screenshots */}
                    {(!product.screenshot_files || product.screenshot_files.length < 3) && (
                      <label className="block w-full border-2 border-dashed border-[#E5E5E5] rounded-lg p-4 text-center cursor-pointer hover:border-[#D5D5D5] transition-colors">
                        <Upload className="w-6 h-6 text-[#999999] mx-auto mb-2" />
                        <p className="text-sm text-[#666666]">Add screenshots</p>
                        <p className="text-xs text-[#999999] mt-1">PNG, JPG up to 10MB each</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Links Section */}
            <section ref={linksRef} id="links" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#2D2D2D]">Links</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={product.website_url}
                    onChange={(e) => setProduct({ ...product, website_url: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.website_url ? 'border-red-300' : 'border-[#E5E5E5]'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="https://myproduct.com"
                  />
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
                  <input
                    type="url"
                    value={product.video_url}
                    onChange={(e) => setProduct({ ...product, video_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-sm text-[#666666]">
                    YouTube, Vimeo, or Loom links work best
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Twitter/X (optional)
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <input
                      type="url"
                      value={product.twitter_url}
                      onChange={(e) => setProduct({ ...product, twitter_url: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 text-[#666666] hover:text-[#2D2D2D] transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCFA]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1E1E1E]"></div>
        </div>
      </div>
    }>
      <SubmitContent />
    </Suspense>
  )
}