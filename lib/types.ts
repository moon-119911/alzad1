// أنواع البيانات الأساسية لمنصة الزاد

export interface University {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  created_at: string
}

export interface Major {
  id: string
  name: string
  university_id: string
  created_at: string
  university?: University
}

export interface Level {
  id: string
  name: string
  order_num: number
  created_at: string
}

export interface AcademicYear {
  id: string
  name: string
  is_current: boolean
  created_at: string
}

export interface Subject {
  id: string
  name: string
  code: string | null
  major_id: string
  level_id: string
  created_at: string
  major?: Major
  level?: Level
}

export interface ContentType {
  id: string
  name: string
  icon: string | null
  description: string | null
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  university_id: string | null
  major_id: string | null
  level_id: string | null
  is_admin: boolean
  is_profile_complete: boolean
  created_at: string
  updated_at: string
  university?: University
  major?: Major
  level?: Level
}

export interface StudyFile {
  id: string
  title: string
  description: string | null
  file_url: string
  file_pathname: string
  file_size: number
  file_type: string
  content_type_id: string
  subject_id: string
  academic_year_id: string
  uploader_id: string
  views_count: number
  downloads_count: number
  is_approved: boolean
  created_at: string
  updated_at: string
  content_type?: ContentType
  subject?: Subject
  academic_year?: AcademicYear
  uploader?: UserProfile
  average_rating?: number
  ratings_count?: number
}

export interface SavedFile {
  id: string
  user_id: string
  file_id: string
  created_at: string
  file?: StudyFile
}

export interface FileRating {
  id: string
  user_id: string
  file_id: string
  rating: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  user_id: string
  file_id: string
  content: string
  created_at: string
  updated_at: string
  user?: UserProfile
}

export interface FileReport {
  id: string
  reporter_id: string
  file_id: string
  reason: string
  details: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  reporter?: UserProfile
  file?: StudyFile
}

// أنواع الاستجابات
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// أنواع الفلاتر
export interface FileFilters {
  search?: string
  contentTypeId?: string
  levelId?: string
  academicYearId?: string
  subjectId?: string
  sortBy?: 'newest' | 'most_downloaded' | 'most_viewed' | 'highest_rated'
}

// أنواع الإحصائيات
export interface SiteStats {
  totalFiles: number
  totalUsers: number
  totalDownloads: number
  totalUniversities: number
}

export interface UserStats {
  uploadedFiles: number
  totalDownloads: number
  totalViews: number
  averageRating: number
}

// أنواع النماذج
export interface CompleteProfileForm {
  universityId: string
  majorId: string
  levelId: string
  fullName: string
}

export interface UploadFileForm {
  title: string
  description: string
  subjectId: string
  contentTypeId: string
  academicYearId: string
  file: File
}

export interface ReportFileForm {
  reason: string
  details?: string
}

// ثوابت
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'صورة JPEG',
  'image/png': 'صورة PNG',
  'image/gif': 'صورة GIF',
  'image/webp': 'صورة WebP',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
}

export const REPORT_REASONS = [
  { value: 'inappropriate', label: 'محتوى غير لائق' },
  { value: 'copyright', label: 'انتهاك حقوق النشر' },
  { value: 'wrong_content', label: 'محتوى خاطئ أو مضلل' },
  { value: 'spam', label: 'محتوى مكرر أو سبام' },
  { value: 'other', label: 'سبب آخر' },
]
