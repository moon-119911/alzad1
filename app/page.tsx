import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { FilesSection } from "@/components/home/files-section"
import type { SiteStats, StudyFile } from "@/lib/types"

async function getStats(): Promise<SiteStats> {
  const supabase = await createClient()

  const [filesCount, usersCount, universitiesCount] = await Promise.all([
    supabase.from("study_files").select("*", { count: "exact", head: true }).eq("is_approved", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_profile_complete", true),
    supabase.from("universities").select("*", { count: "exact", head: true }),
  ])

  // حساب إجمالي التحميلات
  const { data: downloads } = await supabase
    .from("study_files")
    .select("downloads_count")
    .eq("is_approved", true)

  const totalDownloads = downloads?.reduce((sum, file) => sum + (file.downloads_count || 0), 0) || 0

  return {
    totalFiles: filesCount.count || 0,
    totalUsers: usersCount.count || 0,
    totalDownloads,
    totalUniversities: universitiesCount.count || 0,
  }
}

async function getRecentFiles(userId?: string): Promise<StudyFile[]> {
  const supabase = await createClient()

  let query = supabase
    .from("study_files")
    .select(`
      *,
      content_type:content_types(*),
      subject:subjects(*),
      academic_year:academic_years(*),
      uploader:profiles(id, full_name, avatar_url)
    `)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // إذا كان المستخدم مسجل، نعرض ملفات تخصصه فقط
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("major_id")
      .eq("id", userId)
      .single()

    if (profile?.major_id) {
      // جلب المواد في نفس التخصص
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id")
        .eq("major_id", profile.major_id)

      if (subjects && subjects.length > 0) {
        const subjectIds = subjects.map(s => s.id)
        query = query.in("subject_id", subjectIds)
      }
    }
  }

  const { data } = await query

  return (data as StudyFile[]) || []
}

async function getMostDownloadedFiles(userId?: string): Promise<StudyFile[]> {
  const supabase = await createClient()

  let query = supabase
    .from("study_files")
    .select(`
      *,
      content_type:content_types(*),
      subject:subjects(*),
      academic_year:academic_years(*),
      uploader:profiles(id, full_name, avatar_url)
    `)
    .eq("is_approved", true)
    .order("downloads_count", { ascending: false })
    .limit(4)

  // إذا كان المستخدم مسجل، نعرض ملفات تخصصه فقط
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("major_id")
      .eq("id", userId)
      .single()

    if (profile?.major_id) {
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id")
        .eq("major_id", profile.major_id)

      if (subjects && subjects.length > 0) {
        const subjectIds = subjects.map(s => s.id)
        query = query.in("subject_id", subjectIds)
      }
    }
  }

  const { data } = await query

  return (data as StudyFile[]) || []
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const stats = await getStats()
  const recentFiles = await getRecentFiles(user?.id)
  const popularFiles = await getMostDownloadedFiles(user?.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1">
        <div className="container">
          <HeroSection isLoggedIn={!!user} />
          <StatsSection stats={stats} />
          
          <FilesSection
            title="أحدث الملفات"
            description={user ? "أحدث الملفات في تخصصك" : "أحدث الملفات المرفوعة"}
            files={recentFiles}
            viewAllHref="/search?sort=newest"
            emptyMessage="لا توجد ملفات حتى الآن. كن أول من يرفع ملفاً!"
          />

          <FilesSection
            title="الأكثر تحميلاً"
            description="الملفات الأكثر شعبية بين الطلاب"
            files={popularFiles}
            viewAllHref="/search?sort=most_downloaded"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
