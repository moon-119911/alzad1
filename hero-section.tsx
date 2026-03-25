import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Upload, BookOpen, Users, GraduationCap } from "lucide-react"

interface HeroSectionProps {
  isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zad-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* الشعار الكبير */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <BookOpen className="h-9 w-9" />
            </div>
          </div>

          {/* العنوان */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
            <span className="text-primary">الزاد</span>
            <span className="text-muted-foreground text-2xl md:text-3xl block mt-2">
              زاد العلم والتراث
            </span>
          </h1>

          {/* الوصف */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين.
            ساهم في إثراء محتوى تخصصك وجامعتك ليكون زاداً لمن يأتي بعدك.
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/search">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                <Search className="h-5 w-5" />
                ابحث عن ملفات
              </Button>
            </Link>
            {isLoggedIn ? (
              <Link href="/upload">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                  <Upload className="h-5 w-5" />
                  ارفع ملفاً
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                  <Users className="h-5 w-5" />
                  انضم إلينا
                </Button>
              </Link>
            )}
          </div>

          {/* ميزات سريعة */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>ملفات حسب تخصصك</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>ملخصات ونماذج اختبارات</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>مجتمع طلابي متعاون</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
