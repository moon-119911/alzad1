"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Flag, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from "lucide-react"
import type { FileReport } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/date-utils"
import { REPORT_REASONS } from "@/lib/types"

interface ReportsListProps {
  reports: FileReport[]
}

export function ReportsList({ reports }: ReportsListProps) {
  const router = useRouter()
  const supabase = createClient()

  const [filter, setFilter] = useState<string>("all")
  const [processingId, setProcessingId] = useState<string | null>(null)

  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(r => r.status === filter)

  const handleUpdateStatus = async (reportId: string, status: string) => {
    setProcessingId(reportId)

    try {
      await supabase
        .from("file_reports")
        .update({ 
          status, 
          reviewed_at: new Date().toISOString() 
        })
        .eq("id", reportId)

      router.refresh()
    } catch (error) {
      console.error("Error updating report:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const getReasonLabel = (reason: string) => {
    return REPORT_REASONS.find(r => r.value === reason)?.label || reason
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">معلق</Badge>
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">تمت المراجعة</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">تم الحل</Badge>
      case "dismissed":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">مرفوض</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Flag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">لا توجد بلاغات</h3>
        <p className="text-muted-foreground">لم يتم تقديم أي بلاغات حتى الآن</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* الفلاتر */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="جميع البلاغات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع البلاغات</SelectItem>
            <SelectItem value="pending">المعلقة</SelectItem>
            <SelectItem value="reviewed">تمت مراجعتها</SelectItem>
            <SelectItem value="resolved">تم حلها</SelectItem>
            <SelectItem value="dismissed">المرفوضة</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">
          {filteredReports.length} بلاغ
        </span>
      </div>

      {/* قائمة البلاغات */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(report.status)}
                    <Badge variant="secondary">{getReasonLabel(report.reason)}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(report.created_at)}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium">
                      الملف: {report.file?.title || "ملف محذوف"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      المُبلِّغ: {report.reporter?.full_name || "مستخدم"}
                    </p>
                  </div>

                  {report.details && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {report.details}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {report.file && (
                    <Link href={`/file/${report.file.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        عرض الملف
                      </Button>
                    </Link>
                  )}

                  {report.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-green-600 hover:text-green-700"
                        onClick={() => handleUpdateStatus(report.id, "resolved")}
                        disabled={processingId === report.id}
                      >
                        {processingId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => handleUpdateStatus(report.id, "dismissed")}
                        disabled={processingId === report.id}
                      >
                        {processingId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        رفض
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
