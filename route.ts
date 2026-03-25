import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // التحقق من اكتمال الملف الشخصي
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_profile_complete")
          .eq("id", user.id)
          .single()

        if (!profile?.is_profile_complete) {
          return NextResponse.redirect(`${origin}/complete-profile`)
        }
      }

      return NextResponse.redirect(`${origin}/`)
    }
  }

  // في حالة حدوث خطأ، إعادة التوجيه إلى صفحة الخطأ
  return NextResponse.redirect(`${origin}/auth/error`)
}
