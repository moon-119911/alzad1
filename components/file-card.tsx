"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, 
  Download, 
  Eye, 
  Star, 
  BookOpen, 
  FileSpreadsheet,
  FileImage,
  Presentation,
  Calendar
} from "lucide-react"
import type { StudyFile } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/date-utils"

interface FileCardProps {
  file: StudyFile
}

const contentTypeIcons: Record<string, typeof FileText> = {
  "ملزمة": BookOpen,
  "كتاب": FileText,
  "ملخص": FileSpreadsheet,
  "نموذج اختبار": FileImage,
}

const fileTypeColors: Record<string, string> = {
  "application/pdf": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "application/msword": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "application/vnd.ms-powerpoint": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export function FileCard({ file }: FileCardProps) {
  const ContentIcon = contentTypeIcons[file.content_type?.name || ""] || FileText
  const fileTypeColor = fileTypeColors[file.file_type] || "bg-muted text-muted-foreground"

  const getInitials = (name: string | null) => {
    if (!name) return "م"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileTypeLabel = (type: string) => {
    if (type.includes("pdf")) return "PDF"
    if (type.includes("word") || type.includes("document")) return "Word"
    if (type.includes("powerpoint") || type.includes("presentation")) return "PPT"
    if (type.includes("image")) return "صورة"
    return "ملف"
  }

  return (
    <Link href={`/file/${file.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4 space-y-3">
          {/* العنوان والنوع */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-primary">
              <ContentIcon className="h-5 w-5 shrink-0" />
              <Badge variant="secondary" className="text-xs">
                {file.content_type?.name || "ملف"}
              </Badge>
            </div>
            <Badge className={`text-xs ${fileTypeColor}`}>
              {getFileTypeLabel(file.file_type)}
            </Badge>
          </div>

          {/* العنوان */}
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {file.title}
          </h3>

          {/* المادة */}
          {file.subject && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {file.subject.name}
            </p>
          )}

          {/* الإحصائيات */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {file.views_count}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {file.downloads_count}
            </span>
            {file.average_rating !== undefined && file.average_rating > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                {file.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {/* الرافع */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={file.uploader?.avatar_url || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(file.uploader?.full_name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {file.uploader?.full_name || "مستخدم"}
            </span>
          </div>

          {/* التاريخ */}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(file.created_at)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
