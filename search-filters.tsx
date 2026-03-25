"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X, SlidersHorizontal } from "lucide-react"
import type { ContentType, Level, AcademicYear, Subject } from "@/lib/types"

interface SearchFiltersProps {
  contentTypes: ContentType[]
  levels: Level[]
  academicYears: AcademicYear[]
  subjects: Subject[]
  currentFilters: {
    q?: string
    type?: string
    level?: string
    year?: string
    subject?: string
    sort?: string
  }
}

export function SearchFilters({
  contentTypes,
  levels,
  academicYears,
  subjects,
  currentFilters,
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(currentFilters.q || "")

  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // إعادة تعيين الصفحة عند تغيير الفلاتر
    params.delete("page")
    
    router.push(`/search?${params.toString()}`)
  }, [router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("q", search || null)
  }

  const clearFilters = () => {
    setSearch("")
    router.push("/search")
  }

  const hasActiveFilters = currentFilters.q || currentFilters.type || 
    currentFilters.level || currentFilters.year || currentFilters.subject

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5" />
          تصفية النتائج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* البحث */}
        <form onSubmit={handleSearch} className="space-y-2">
          <Label htmlFor="search">البحث</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="ابحث بالعنوان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* نوع المحتوى */}
        <div className="space-y-2">
          <Label>نوع المحتوى</Label>
          <Select
            value={currentFilters.type || "all"}
            onValueChange={(value) => updateFilters("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="جميع الأنواع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              {contentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* المستوى */}
        <div className="space-y-2">
          <Label>المستوى الدراسي</Label>
          <Select
            value={currentFilters.level || "all"}
            onValueChange={(value) => updateFilters("level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="جميع المستويات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستويات</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* العام الدراسي */}
        <div className="space-y-2">
          <Label>العام الدراسي</Label>
          <Select
            value={currentFilters.year || "all"}
            onValueChange={(value) => updateFilters("year", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="جميع الأعوام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأعوام</SelectItem>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* المادة */}
        {subjects.length > 0 && (
          <div className="space-y-2">
            <Label>المادة</Label>
            <Select
              value={currentFilters.subject || "all"}
              onValueChange={(value) => updateFilters("subject", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المواد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* الترتيب */}
        <div className="space-y-2">
          <Label>الترتيب حسب</Label>
          <Select
            value={currentFilters.sort || "newest"}
            onValueChange={(value) => updateFilters("sort", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="most_downloaded">الأكثر تحميلاً</SelectItem>
              <SelectItem value="most_viewed">الأكثر مشاهدة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* زر مسح الفلاتر */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
            مسح الفلاتر
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
