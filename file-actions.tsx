"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Flag, 
  Loader2,
  LogIn
} from "lucide-react"
import type { StudyFile, UserProfile } from "@/lib/types"
import { REPORT_REASONS } from "@/lib/types"

interface FileActionsProps {
  file: StudyFile
  user: UserProfile | null
  userRating: number | null
  isSaved: boolean
}

export function FileActions({ file, user, userRating, isSaved: initialIsSaved }: FileActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isSaving, setIsSaving] = useState(false)
  const [rating, setRating] = useState(userRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isRating, setIsRating] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // زيادة عداد التحميلات
      await supabase
        .from("study_files")
        .update({ downloads_count: (file.downloads_count || 0) + 1 })
        .eq("id", file.id)

      // تحميل الملف
      const response = await fetch(`/api/file?pathname=${encodeURIComponent(file.file_pathname)}`)
      
      if (!response.ok) throw new Error("فشل التحميل")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.title + getFileExtension(file.file_type)
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      router.refresh()
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      if (isSaved) {
        await supabase
          .from("saved_files")
          .delete()
          .eq("file_id", file.id)
          .eq("user_id", user.id)
        setIsSaved(false)
      } else {
        await supabase
          .from("saved_files")
          .insert({ file_id: file.id, user_id: user.id })
        setIsSaved(true)
      }
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRate = async (newRating: number) => {
    if (!user) return

    setIsRating(true)
    setRating(newRating)

    try {
      const { data: existing } = await supabase
        .from("file_ratings")
        .select("id")
        .eq("file_id", file.id)
        .eq("user_id", user.id)
        .single()

      if (existing) {
        await supabase
          .from("file_ratings")
          .update({ rating: newRating, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
      } else {
        await supabase
          .from("file_ratings")
          .insert({ file_id: file.id, user_id: user.id, rating: newRating })
      }

      router.refresh()
    } catch (error) {
      console.error("Rating error:", error)
    } finally {
      setIsRating(false)
    }
  }

  const handleReport = async () => {
    if (!user || !reportReason) return

    setIsReporting(true)

    try {
      await supabase
        .from("file_reports")
        .insert({
          file_id: file.id,
          reporter_id: user.id,
          reason: reportReason,
          details: reportDetails || null,
        })

      setReportDialogOpen(false)
      setReportReason("")
      setReportDetails("")
    } catch (error) {
      console.error("Report error:", error)
    } finally {
      setIsReporting(false)
    }
  }

  const getFileExtension = (mimeType: string) => {
    const extensions: Record<string, string> = {
      "application/pdf": ".pdf",
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
      "application/vnd.ms-powerpoint": ".ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    }
    return extensions[mimeType] || ""
  }

  if (!user) {
    return (
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle className="text-lg">تحميل الملف</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            سجل دخولك لتتمكن من تحميل الملفات والتفاعل معها
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">إجراءات الملف</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* زر التحميل */}
        <Button 
          className="w-full gap-2 h-12" 
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          تحميل الملف
        </Button>

        {/* زر الحفظ */}
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSaved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaved ? "محفوظ" : "حفظ الملف"}
        </Button>

        {/* التقييم */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">قيّم هذا الملف</p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={isRating}
                className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              تقييمك: {rating} من 5
            </p>
          )}
        </div>

        {/* الإبلاغ */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              الإبلاغ عن مخالفة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>الإبلاغ عن ملف مخالف</DialogTitle>
              <DialogDescription>
                أخبرنا عن سبب إبلاغك عن هذا الملف
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>سبب الإبلاغ</Label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السبب" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تفاصيل إضافية (اختياري)</Label>
                <Textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="أضف تفاصيل إضافية..."
                  rows={3}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleReport}
                disabled={!reportReason || isReporting}
              >
                {isReporting ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : null}
                إرسال البلاغ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
