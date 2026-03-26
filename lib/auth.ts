import { createClient } from "@/lib/supabase/server"
import type { UserProfile } from "@/lib/types"

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      university:universities(*),
      major:majors(*),
      level:levels(*)
    `)
    .eq("id", user.id)
    .single()

  return profile as UserProfile | null
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("UNAUTHORIZED")
  }

  return user
}

export async function requireCompleteProfile(): Promise<UserProfile> {
  const user = await requireAuth()
  
  if (!user.is_profile_complete) {
    throw new Error("PROFILE_INCOMPLETE")
  }

  return user
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await requireCompleteProfile()
  
  if (!user.is_admin) {
    throw new Error("FORBIDDEN")
  }

  return user
}
