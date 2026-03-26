import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* معلومات الموقع */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-primary">الزاد</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين. 
              ساهم في إثراء محتوى تخصصك وجامعتك ليكون زاداً لمن يأتي بعدك.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h3 className="font-semibold">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                البحث عن ملفات
              </Link>
              <Link href="/upload" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                رفع ملف جديد
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                عن المنصة
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                تواصل معنا
              </Link>
            </nav>
          </div>

          {/* التواصل */}
          <div className="space-y-4">
            <h3 className="font-semibold">تواصل معنا</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>للاستفسارات والدعم:</p>
              <p className="font-medium text-foreground" dir="ltr">info@alzad.edu</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>الزاد - زاد العلم والتراث &copy; {currentYear}</p>
        </div>
      </div>
    </footer>
  )
}
