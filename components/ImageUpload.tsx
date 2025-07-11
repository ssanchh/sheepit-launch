'use client'

import { useState, useRef, DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  children?: React.ReactNode
}

export default function ImageUpload({ 
  onFileSelect, 
  accept = 'image/*',
  maxSize = 10,
  className = '',
  children
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      validateAndSelectFile(file)
    }
  }

  const validateAndSelectFile = (file: File) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File must be less than ${maxSize}MB`)
      return
    }

    onFileSelect(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSelectFile(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${className} ${
        isDragging 
          ? 'border-orange-500 bg-orange-50' 
          : 'border-[#E5E5E5] hover:border-[#D5D5D5]'
      } transition-colors cursor-pointer`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {children || (
        <>
          <Upload className="w-8 h-8 text-[#999999] mx-auto mb-2" />
          <p className="text-sm text-[#666666]">
            {isDragging ? 'Drop image here' : 'Click or drag to upload'}
          </p>
        </>
      )}
    </div>
  )
}