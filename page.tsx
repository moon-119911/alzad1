import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { UploadForm } from "./upload-form"
import type { Subject, ContentType, AcademicYear, Level } from "@/lib/types"

export default async function UploadPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!user.is_profile_complete) {
    redirect("/complete-profile")
  }

  const supabase = await createClient()

  // جلب البيانات اللازمة
  const [contentTypes, academicYears, levels] = await Promise.all([
    supabase.from("content_types").select("*").order("name"),
    supabase.from("academic_years").select("*").order("name", { ascending: false }),
    supabase.from("levels").select("*").order("order_num"),
  ])

  // جلب المواد المتاحة للمستخدم (في تخصصه ومستواه أو أقل)
  let subjects: Subject[] = []
  if (user.major_id && user.level_id) {
    // جلب مستوى المستخدم
    const { data: userLevel } = await supabase
      .from("levels")
      .select("order_num")
      .eq("id", user.level_id)
      .single()

    if (userLevel) {
      // جلب المستويات الأقل أو المساوية لمستوى المستخدم
      const { data: availableLevels } = await supabase
        .from("levels")
        .select("id")
        .lte("order_num", userLevel.order_num)

      if (availableLevels) {
        const levelIds = availableLevels.map(l => l.id)

        const { data: subjectsData } = await supabase
          .from("subjects")
          .select("*, level:levels(*)")
          .eq("major_id", user.major_id)
          .in("level_id", levelIds)
          .order("name")

        subjects = (subjectsData || []) as Subject[]
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">رفع ملف جديد</h1>
            <p className="text-muted-foreground mt-2">
              شارك ملفاتك الدراسية مع زملائك في التخصص
            </p>
          </div>

          <UploadForm
            subjects={subjects}
            contentTypes={(contentTypes.data || []) as ContentType[]}
            academicYears={(academicYears.data || []) as AcademicYear[]}
            levels={(levels.data || []) as Level[]}
            userLevelId={user.level_id || ""}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
