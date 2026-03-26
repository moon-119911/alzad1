"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Upload, BookOpen, GraduationCap } from "lucide-react"

interface HeroSectionProps {
  isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col items-center text-center gap-6">
        {/* شعار مميز */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          <span className="text-primary">الزاد</span>
          <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">
            زاد العلم والتراث
          </span>
        </h1>

        {/* الوصف */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين. 
          شارك ملخصاتك وملازمك ونماذج اختباراتك مع زملائك، وساهم في إثراء محتوى تخصصك.
        </p>

        {/* أزرار العمل */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link href="/search">
            <Button size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              ابحث عن ملفات
            </Button>
          </Link>
          {isLoggedIn ? (
            <Link href="/upload">
              <Button size="lg" variant="outline" className="gap-2">
                <Upload className="h-5 w-5" />
                رفع ملف جديد
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="gap-2">
                <GraduationCap className="h-5 w-5" />
                انضم الآن
              </Button>
            </Link>
          )}
        </div>

        {/* ميزات سريعة */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            مجاني بالكامل
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            للجامعات اليمنية
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            محتوى موثوق
          </div>
        </div>
      </div>
    </section>
  )
}
