"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FileCard } from "@/components/files/file-card"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight, ChevronLeft } from "lucide-react"
import type { StudyFile } from "@/lib/types"

interface SearchResultsProps {
  files: StudyFile[]
  totalCount: number
  currentPage: number
  totalPages: number
  searchQuery?: string
}

export function SearchResults({
  files,
  totalCount,
  currentPage,
  totalPages,
  searchQuery,
}: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/search?${params.toString()}`)
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">لم يتم العثور على نتائج</h3>
        <p className="text-muted-foreground max-w-md">
          {searchQuery
            ? `لم نجد ملفات تطابق "${searchQuery}". جرب كلمات بحث مختلفة أو قم بتعديل الفلاتر.`
            : "لا توجد ملفات تطابق معايير البحث الحالية. جرب تعديل الفلاتر."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* عدد النتائج */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {searchQuery && (
            <span>
              نتائج البحث عن &quot;{searchQuery}&quot; -&nbsp;
            </span>
          )}
          <span className="font-medium text-foreground">{totalCount}</span> ملف
        </p>
      </div>

      {/* قائمة الملفات */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>

      {/* التصفح */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
