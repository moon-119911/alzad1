import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, Download, Building2 } from "lucide-react"
import type { SiteStats } from "@/lib/types"

interface StatsSectionProps {
  stats: SiteStats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsItems = [
    {
      label: "ملف دراسي",
      value: stats.totalFiles,
      icon: FileText,
      color: "text-primary bg-primary/10",
    },
    {
      label: "طالب مسجل",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "عملية تحميل",
      value: stats.totalDownloads,
      icon: Download,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "جامعة",
      value: stats.totalUniversities,
      icon: Building2,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsItems.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="border-none shadow-sm bg-card/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(item.value)}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
