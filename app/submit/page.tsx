'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Upload, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(50, 'Product name must be 50 characters or less'),
  tagline: z.string().min(1, 'Tagline is required').max(120, 'Tagline must be 120 characters or less'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be 500 characters or less'),
  website_url: z.string().url('Please enter a valid URL'),
  video_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

type ProductFormData = z.infer<typeof productSchema>

export default function SubmitPage() {
  const [uploading, setUploading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()

  // Debug logging function
  const addDebugLog = (message: string) => {
    console.log('[SUBMIT DEBUG]', message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addDebugLog('useEffect triggered')
    addDebugLog(`loading: ${loading}, user: ${user ? 'exists' : 'null'}`)
    
    if (!loading && user) {
      addDebugLog('Starting profile check')
      checkProfileCompletion()
    } else if (!loading && !user) {
      addDebugLog('No user found, redirecting to login')
    }
  }, [user, loading])

  const checkProfileCompletion = async () => {
    addDebugLog('checkProfileCompletion called')
    try {
      addDebugLog('Making supabase query...')
      const { data, error } = await supabase
        .from('users')
        .select('profile_completed')
        .eq('id', user?.id)
        .single()

      addDebugLog(`Query result - data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}`)

      if (error && error.code === 'PGRST116') {
        addDebugLog('No profile record exists')
        setProfileCompleted(false)
        return
      }

      if (data) {
        addDebugLog(`Profile completed: ${data.profile_completed}`)
        setProfileCompleted(data.profile_completed || false)
      } else {
        addDebugLog('No data returned')
        setProfileCompleted(false)
      }
    } catch (error) {
      addDebugLog(`Error in checkProfileCompletion: ${error}`)
      setProfileCompleted(true) // Allow proceed on error
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  // Add timeout fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profileCompleted === null && user && !loading) {
        addDebugLog('TIMEOUT: Forcing profile completion to true')
        setProfileCompleted(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [profileCompleted, user, loading])

  // Redirect to login if not authenticated
  if (!loading && !user) {
    addDebugLog('Redirecting to login - no user')
    router.push('/login')
    return null
  }

  // Show loading with debug info if profile completion is still being checked
  if (profileCompleted === null && user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Submit Page...</h1>
              <p className="text-gray-600 mb-4">Checking profile completion...</p>
              
              <div className="text-left bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <div className="text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                  {debugInfo.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  addDebugLog('User clicked skip - forcing completion')
                  setProfileCompleted(true)
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Skip Check & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }



  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file size must be less than 2MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null

    setUploading(true)
    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('product-logos')
      .upload(fileName, logoFile)

    if (error) {
      toast.error('Error uploading logo')
      setUploading(false)
      return null
    }

    const { data } = supabase.storage
      .from('product-logos')
      .getPublicUrl(fileName)

    setUploading(false)
    return data.publicUrl
  }

  const onSubmit = async (data: ProductFormData) => {
    if (!user) return

    try {
      // First, get the current active week
      const { data: weekData, error: weekError } = await supabase
        .from('weeks')
        .select('id')
        .eq('active', true)
        .single()

      if (weekError || !weekData) {
        toast.error('No active week found. Please try again later.')
        return
      }

      let logoUrl = null
      
      if (logoFile) {
        logoUrl = await uploadLogo()
        if (!logoUrl) return // Upload failed
      }

      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: data.name,
            tagline: data.tagline,
            description: data.description,
            website_url: data.website_url,
            video_url: data.video_url || null,
            logo_url: logoUrl,
            created_by: user.id,
            week_id: weekData.id,
            status: 'pending', // Requires admin approval
          },
        ])

      if (error) {
        toast.error('Error submitting product')
        console.error('Error:', error)
        return
      }

      toast.success('Product submitted successfully! It will be reviewed by our team.')
      reset()
      setLogoFile(null)
      setLogoPreview(null)
      router.push('/')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading authentication...</p>
          <div className="text-sm text-gray-500">
            This might indicate an issue with the useAuth hook
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Product</h1>
          <p className="text-gray-600">
            Get your indie startup in front of the community this week
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="My Awesome Product"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
                Tagline *
              </label>
              <input
                type="text"
                id="tagline"
                {...register('tagline')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="A brief, catchy description of your product"
              />
              {errors.tagline && (
                <p className="mt-1 text-sm text-red-600">{errors.tagline.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell us more about your product, what problem it solves, and why people should care..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="website_url"
                  {...register('website_url')}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://myproduct.com"
                />
                <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.website_url && (
                <p className="mt-1 text-sm text-red-600">{errors.website_url.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="video_url"
                  {...register('video_url')}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.video_url && (
                <p className="mt-1 text-sm text-red-600">{errors.video_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {logoPreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Submission Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Products must be functional and publicly accessible</li>
                <li>• No spam, adult content, or illegal products</li>
                <li>• All submissions require approval before going live</li>
                <li>• You can only submit one product per week</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting || uploading ? 'Submitting...' : 'Submit Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 