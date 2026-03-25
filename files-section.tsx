import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileCard } from "@/components/files/file-card"
import { ArrowLeft, FileText } from "lucide-react"
import type { StudyFile } from "@/lib/types"

interface FilesSectionProps {
  title: string
  description?: string
  files: StudyFile[]
  viewAllHref?: string
  emptyMessage?: string
}

export function FilesSection({ 
  title, 
  description, 
  files, 
  viewAllHref,
  emptyMessage = "لا توجد ملفات حالياً"
}: FilesSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {viewAllHref && files.length > 0 && (
          <Link href={viewAllHref}>
            <Button variant="ghost" className="gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {files.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </section>
  )
}
