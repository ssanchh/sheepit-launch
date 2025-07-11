'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ onSearch, placeholder = "Search products...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center ${isFocused ? 'ring-2 ring-orange-500' : ''} rounded-lg transition-all`}>
        <Search className="absolute left-3 w-5 h-5 text-[#999999]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-transparent text-[#2D2D2D] placeholder-[#999999]"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#666666]" />
          </button>
        )}
      </div>
      
      {query && (
        <div className="absolute top-full mt-1 text-xs text-[#666666]">
          Searching for "{query}"
        </div>
      )}
    </div>
  )
}