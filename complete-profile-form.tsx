"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Loader2, GraduationCap, Building2, Layers, User } from "lucide-react"
import type { University, Level, Major } from "@/lib/types"

interface CompleteProfileFormProps {
  userId: string
  userEmail: string
  userName: string
  userAvatar: string
  universities: University[]
  levels: Level[]
}

export function CompleteProfileForm({
  userId,
  userEmail,
  userName,
  userAvatar,
  universities,
  levels,
}: CompleteProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState(userName)
  const [universityId, setUniversityId] = useState("")
  const [majorId, setMajorId] = useState("")
  const [levelId, setLevelId] = useState("")
  const [majors, setMajors] = useState<Major[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMajors, setIsLoadingMajors] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // جلب التخصصات عند اختيار الجامعة
  useEffect(() => {
    if (!universityId) {
      setMajors([])
      setMajorId("")
      return
    }

    const fetchMajors = async () => {
      setIsLoadingMajors(true)
      const { data, error } = await supabase
        .from("majors")
        .select("*")
        .eq("university_id", universityId)
        .order("name")

      if (!error && data) {
        setMajors(data)
      }
      setIsLoadingMajors(false)
    }

    fetchMajors()
  }, [universityId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError("يرجى إدخال الاسم الكامل")
      return
    }

    if (!universityId || !majorId || !levelId) {
      setError("يرجى اختيار الجامعة والتخصص والمستوى")
      return
    }

    setIsLoading(true)

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: userAvatar,
        university_id: universityId,
        major_id: majorId,
        level_id: levelId,
        is_profile_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      setError("حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.")
      setIsLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  const getInitials = (name: string) => {
    if (!name) return "م"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-primary">الزاد</span>
        </div>
        <div>
          <CardTitle className="text-xl">أكمل ملفك الشخصي</CardTitle>
          <CardDescription className="mt-2">
            لنتمكن من عرض الملفات المناسبة لتخصصك ومستواك
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات المستخدم */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <Avatar className="h-14 w-14">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userName || "مستخدم جديد"}</p>
              <p className="text-sm text-muted-foreground" dir="ltr">{userEmail}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* الاسم الكامل */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              الاسم الكامل
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="h-11"
            />
          </div>

          {/* الجامعة */}
          <div className="space-y-2">
            <Label htmlFor="university" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              الجامعة
            </Label>
            <Select value={universityId} onValueChange={setUniversityId}>
              <SelectTrigger id="university" className="h-11">
                <SelectValue placeholder="اختر جامعتك" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* التخصص */}
          <div className="space-y-2">
            <Label htmlFor="major" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              التخصص
            </Label>
            <Select 
              value={majorId} 
              onValueChange={setMajorId}
              disabled={!universityId || isLoadingMajors}
            >
              <SelectTrigger id="major" className="h-11">
                <SelectValue placeholder={
                  !universityId 
                    ? "اختر الجامعة أولاً" 
                    : isLoadingMajors 
                      ? "جارٍ التحميل..."
                      : "اختر تخصصك"
                } />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المستوى */}
          <div className="space-y-2">
            <Label htmlFor="level" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              المستوى الدراسي
            </Label>
            <Select value={levelId} onValueChange={setLevelId}>
              <SelectTrigger id="level" className="h-11">
                <SelectValue placeholder="اختر مستواك الدراسي" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-sm">
            <strong>تنبيه:</strong> لا يمكن تغيير الجامعة والتخصص بعد التسجيل.
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : (
              "إكمال التسجيل"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
