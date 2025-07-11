'use client'

import { useState, useRef } from 'react'
import { Bold, List, Type } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  error = false
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)

  const updateSelection = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart)
      setSelectionEnd(textareaRef.current.selectionEnd)
    }
  }

  const insertFormatting = (before: string, after: string = '') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    const newText = beforeText + before + selectedText + after + afterText
    onChange(newText)

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      if (selectedText) {
        // If text was selected, place cursor after the formatting
        textarea.setSelectionRange(
          start + before.length,
          end + before.length
        )
      } else {
        // If no text selected, place cursor between formatting marks
        textarea.setSelectionRange(
          start + before.length,
          start + before.length
        )
      }
    }, 0)
  }

  const handleBold = () => {
    insertFormatting('**', '**')
  }

  const handleBulletPoint = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeText = value.substring(0, start)
    const afterText = value.substring(start)
    
    // Find the start of the current line
    const lastNewline = beforeText.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    
    // Insert bullet point at the beginning of the line
    const newText = 
      value.substring(0, lineStart) + 
      '• ' + 
      value.substring(lineStart)
    
    onChange(newText)
    
    // Set cursor position after bullet point
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + 2, lineStart + 2)
    }, 0)
  }

  const handleHeading = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeText = value.substring(0, start)
    
    // Find the start of the current line
    const lastNewline = beforeText.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    
    // Insert heading at the beginning of the line
    const newText = 
      value.substring(0, lineStart) + 
      '### ' + 
      value.substring(lineStart)
    
    onChange(newText)
    
    // Set cursor position after heading markup
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + 4, lineStart + 4)
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded transition-colors"
          title="Bold (selected text)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleBulletPoint}
          className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded transition-colors"
          title="Bullet point"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleHeading}
          className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded transition-colors"
          title="Heading"
        >
          <Type className="w-4 h-4" />
        </button>
        <div className="ml-auto px-2 text-xs text-gray-500">
          Supports Markdown formatting
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={updateSelection}
        onClick={updateSelection}
        onKeyUp={updateSelection}
        rows={6}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-300' : 'border-[#E5E5E5]'
        } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono text-sm ${className}`}
        placeholder={placeholder}
      />
      
      <p className="text-xs text-gray-500">
        **bold text**, • bullet points, ### headings
      </p>
    </div>
  )
}