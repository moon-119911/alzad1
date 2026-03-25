import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, 
  Eye, 
  Download, 
  Star, 
  Calendar, 
  Building2, 
  GraduationCap,
  Layers,
  BookOpen
} from "lucide-react"
import type { StudyFile } from "@/lib/types"
import { formatDate } from "@/lib/date-utils"

interface FileDetailsProps {
  file: StudyFile
  averageRating: number
  ratingsCount: number
}

const contentTypeIcons: Record<string, typeof FileText> = {
  "ملزمة": BookOpen,
  "كتاب": FileText,
  "ملخص": FileText,
  "نموذج اختبار": FileText,
}

export function FileDetails({ file, averageRating, ratingsCount }: FileDetailsProps) {
  const ContentIcon = contentTypeIcons[file.content_type?.name || ""] || FileText

  const getInitials = (name: string | null) => {
    if (!name) return "م"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* العنوان والنوع */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <ContentIcon className="h-3 w-3" />
            {file.content_type?.name || "ملف"}
          </Badge>
          <Badge variant="outline">
            {file.academic_year?.name}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-balance">
          {file.title}
        </h1>

        {file.description && (
          <p className="text-muted-foreground leading-relaxed">
            {file.description}
          </p>
        )}
      </div>

      {/* الإحصائيات */}
      <div className="flex flex-wrap items-center gap-6 py-4 border-y">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="h-5 w-5" />
          <span>{file.views_count} مشاهدة</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Download className="h-5 w-5" />
          <span>{file.downloads_count} تحميل</span>
        </div>
        {ratingsCount > 0 && (
          <div className="flex items-center gap-2 text-amber-600">
            <Star className="h-5 w-5 fill-current" />
            <span>{averageRating.toFixed(1)} ({ratingsCount} تقييم)</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-5 w-5" />
          <span>{formatFileSize(file.file_size)}</span>
        </div>
      </div>

      {/* معلومات المادة */}
      <div className="grid gap-4 sm:grid-cols-2">
        {file.subject && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">المادة</p>
              <p className="font-medium">{file.subject.name}</p>
            </div>
          </div>
        )}

        {file.subject?.level && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Layers className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">المستوى</p>
              <p className="font-medium">{file.subject.level.name}</p>
            </div>
          </div>
        )}

        {file.subject?.major && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">التخصص</p>
              <p className="font-medium">{file.subject.major.name}</p>
            </div>
          </div>
        )}

        {file.subject?.major?.university && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">الجامعة</p>
              <p className="font-medium">{file.subject.major.university.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* الرافع */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={file.uploader?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(file.uploader?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{file.uploader?.full_name || "مستخدم"}</p>
            <p className="text-sm text-muted-foreground">رافع الملف</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDate(file.created_at)}
        </div>
      </div>
    </div>
  )
}
