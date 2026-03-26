import { FileText, Users, Download, Building } from "lucide-react"
import type { SiteStats } from "@/lib/types"

interface StatsSectionProps {
  stats: SiteStats
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "م"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "ك"
  }
  return num.toString()
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      icon: FileText,
      value: stats.totalFiles,
      label: "ملف دراسي",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Users,
      value: stats.totalUsers,
      label: "مستخدم مسجل",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Download,
      value: stats.totalDownloads,
      label: "عملية تحميل",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: Building,
      value: stats.totalUniversities,
      label: "جامعة يمنية",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border"
            >
              <div className={`p-3 rounded-full ${item.bgColor} mb-4`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="text-2xl md:text-3xl font-bold">
                {formatNumber(item.value)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
