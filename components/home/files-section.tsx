import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileCard } from "@/components/file-card"
import { ArrowLeft, FileX } from "lucide-react"
import type { StudyFile } from "@/lib/types"

interface FilesSectionProps {
  title: string
  description: string
  files: StudyFile[]
  viewAllHref: string
  emptyMessage?: string
}

export function FilesSection({
  title,
  description,
  files,
  viewAllHref,
  emptyMessage = "لا توجد ملفات",
}: FilesSectionProps) {
  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        {files.length > 0 && (
          <Link href={viewAllHref}>
            <Button variant="outline" className="gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <FileX className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </section>
  )
}
