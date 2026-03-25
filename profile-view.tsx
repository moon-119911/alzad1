"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building2, 
  GraduationCap, 
  Layers, 
  FileText, 
  Download, 
  Eye, 
  Star,
  Pencil,
  Check,
  X,
  Loader2
} from "lucide-react"
import type { UserProfile, UserStats } from "@/lib/types"

interface ProfileViewProps {
  user: UserProfile
  stats: UserStats
}

export function ProfileView({ user, stats }: ProfileViewProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || "")
  const [bio, setBio] = useState(user.bio || "")
  const [isSaving, setIsSaving] = useState(false)

  const getInitials = (name: string | null) => {
    if (!name) return "م"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFullName(user.full_name || "")
    setBio(user.bio || "")
    setIsEditing(false)
  }

  const statsItems = [
    { label: "ملف مرفوع", value: stats.uploadedFiles, icon: FileText },
    { label: "تحميل", value: stats.totalDownloads, icon: Download },
    { label: "مشاهدة", value: stats.totalViews, icon: Eye },
    { 
      label: "متوسط التقييم", 
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-", 
      icon: Star 
    },
  ]

  return (
    <div className="space-y-6">
      {/* البطاقة الرئيسية */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* الصورة والمعلومات الأساسية */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>

              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  تعديل الملف الشخصي
                </Button>
              )}
            </div>

            {/* المعلومات */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة عنك (اختياري)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="اكتب نبذة مختصرة عنك..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      حفظ
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      إلغاء
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold">{user.full_name || "مستخدم"}</h1>
                    <p className="text-muted-foreground" dir="ltr">{user.email}</p>
                  </div>

                  {user.bio && (
                    <p className="text-muted-foreground">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {user.university && (
                      <Badge variant="secondary" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {user.university.name}
                      </Badge>
                    )}
                    {user.major && (
                      <Badge variant="secondary" className="gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {user.major.name}
                      </Badge>
                    )}
                    {user.level && (
                      <Badge variant="secondary" className="gap-1">
                        <Layers className="h-3 w-3" />
                        {user.level.name}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إحصائياتي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsItems.map((item) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.label} 
                  className="text-center p-4 rounded-lg bg-muted/50"
                >
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
