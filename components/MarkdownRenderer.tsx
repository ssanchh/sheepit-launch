'use client'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Simple markdown to HTML conversion
  const renderMarkdown = (text: string) => {
    // Split by newlines to handle line breaks
    const lines = text.split('\n')
    const processedLines = lines.map(line => {
      // Handle headers
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold text-[#2D2D2D] mt-4 mb-2">${line.substring(4)}</h3>`
      }
      
      // Handle bullet points
      if (line.startsWith('• ')) {
        return `<li class="ml-4">${processLine(line.substring(2))}</li>`
      }
      
      // Process inline formatting
      return `<p>${processLine(line)}</p>`
    })
    
    // Wrap consecutive bullet points in ul tags
    let html = processedLines.join('\n')
    html = html.replace(/(<li.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside space-y-1 my-2">${match}</ul>`)
    
    return html
  }
  
  const processLine = (line: string) => {
    // Handle bold text
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Handle line breaks (double space at end of line)
    line = line.replace(/  $/g, '<br />')
    
    return line
  }

  return (
    <div 
      className={`text-[#666666] whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}