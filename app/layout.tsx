import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const ibmPlexArabic = IBM_Plex_Sans_Arabic({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: {
    default: 'الزاد - زاد العلم والتراث',
    template: '%s | الزاد'
  },
  description: 'منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين. شارك ملخصاتك وملازمك ونماذج اختباراتك مع زملائك.',
  keywords: ['الزاد', 'ملفات دراسية', 'جامعات يمنية', 'ملخصات', 'نماذج اختبارات', 'طلاب'],
  authors: [{ name: 'الزاد' }],
  creator: 'الزاد',
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    siteName: 'الزاد',
    title: 'الزاد - زاد العلم والتراث',
    description: 'منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الزاد - زاد العلم والتراث',
    description: 'منصة تعليمية متخصصة لمشاركة الملفات الدراسية بين الطلاب اليمنيين',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5a7a5a' },
    { media: '(prefers-color-scheme: dark)', color: '#2a4a2a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlexArabic.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
