"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Upload, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import type { Subject, ContentType, AcademicYear, Level } from "@/lib/types"
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, FILE_TYPE_LABELS } from "@/lib/types"

interface UploadFormProps {
  subjects: Subject[]
  contentTypes: ContentType[]
  academicYears: AcademicYear[]
  levels: Level[]
  userLevelId: string
}

export function UploadForm({
  subjects,
  contentTypes,
  academicYears,
  levels,
  userLevelId,
}: UploadFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [contentTypeId, setContentTypeId] = useState("")
  const [academicYearId, setAcademicYearId] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // تصفية المواد حسب المستوى المختار
  const filteredSubjects = selectedLevel
    ? subjects.filter(s => s.level_id === selectedLevel)
    : subjects

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError("نوع الملف غير مسموح. الأنواع المسموحة: PDF, Word, PowerPoint, الصور")
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("حجم الملف يتجاوز الحد الأقصى (50 ميجابايت)")
      return
    }

    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("يرجى إدخال عنوان الملف")
      return
    }

    if (!subjectId) {
      setError("يرجى اختيار المادة")
      return
    }

    if (!contentTypeId) {
      setError("يرجى اختيار نوع المحتوى")
      return
    }

    if (!academicYearId) {
      setError("يرجى اختيار العام الدراسي")
      return
    }

    if (!file) {
      setError("يرجى اختيار ملف للرفع")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("subjectId", subjectId)
      formData.append("contentTypeId", contentTypeId)
      formData.append("academicYearId", academicYearId)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "فشل رفع الملف")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/file/${data.file.id}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء رفع الملف")
    } finally {
      setIsUploading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">تم رفع الملف بنجاح!</h2>
          <p className="text-muted-foreground">جارٍ تحويلك لصفحة الملف...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* منطقة رفع الملف */}
      <Card>
        <CardContent className="p-6">
          <Label className="mb-4 block">الملف</Label>
          
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-primary/50"
                }
              `}
            >
              <input
                type="file"
                accept={ALLOWED_FILE_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  اسحب الملف هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, Word, PowerPoint, أو صور (الحد الأقصى 50 ميجابايت)
                </p>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {FILE_TYPE_LABELS[file.type] || file.type} - {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات الملف */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* العنوان */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الملف *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ملخص مادة البرمجة - الفصل الأول"
              className="h-11"
            />
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف الملف (اختياري)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أضف وصفاً للملف يساعد الآخرين على فهم محتواه..."
              rows={3}
            />
          </div>

          {/* نوع المحتوى */}
          <div className="space-y-2">
            <Label>نوع المحتوى *</Label>
            <Select value={contentTypeId} onValueChange={setContentTypeId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="اختر نوع المحتوى" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المستوى والمادة */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>المستوى الدراسي</Label>
              <Select value={selectedLevel} onValueChange={(val) => {
                setSelectedLevel(val)
                setSubjectId("")
              }}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المادة *</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={
                    filteredSubjects.length === 0 
                      ? "اختر المستوى أولاً" 
                      : "اختر المادة"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* العام الدراسي */}
          <div className="space-y-2">
            <Label>العام الدراسي *</Label>
            <Select value={academicYearId} onValueChange={setAcademicYearId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="اختر العام الدراسي" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name} {year.is_current && "(الحالي)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* زر الرفع */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جارٍ رفع الملف...
          </>
        ) : (
          <>
            <Upload className="ml-2 h-5 w-5" />
            رفع الملف
          </>
        )}
      </Button>
    </form>
  )
}
