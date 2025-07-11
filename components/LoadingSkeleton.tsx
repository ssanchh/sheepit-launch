export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg"></div>
          <div>
            <div className="h-5 w-32 bg-[#F5F5F5] rounded mb-2"></div>
            <div className="h-4 w-48 bg-[#F5F5F5] rounded mb-2"></div>
            <div className="h-3 w-24 bg-[#F5F5F5] rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-10 bg-[#F5F5F5] rounded-lg"></div>
          <div className="w-24 h-10 bg-[#F5F5F5] rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export function ProductListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 bg-[#F5F5F5] rounded-full"></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-24 bg-[#F5F5F5] rounded"></div>
          <div className="h-3 w-16 bg-[#F5F5F5] rounded"></div>
        </div>
        <div className="h-4 w-full bg-[#F5F5F5] rounded"></div>
      </div>
    </div>
  )
}

export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  )
}