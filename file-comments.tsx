"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import type { Comment, UserProfile } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/date-utils"

interface FileCommentsProps {
  fileId: string
  comments: Comment[]
  user: UserProfile | null
}

export function FileComments({ fileId, comments, user }: FileCommentsProps) {
  const router = useRouter()
  const supabase = createClient()

  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)

    try {
      await supabase
        .from("comments")
        .insert({
          file_id: fileId,
          user_id: user.id,
          content: newComment.trim(),
        })

      setNewComment("")
      router.refresh()
    } catch (error) {
      console.error("Comment error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "م"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          التعليقات ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* نموذج التعليق */}
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="gap-2"
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    إرسال
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            سجل دخولك لإضافة تعليق
          </p>
        )}

        {/* قائمة التعليقات */}
        {comments.length > 0 ? (
          <div className="space-y-4 pt-4 border-t">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={comment.user?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(comment.user?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user?.full_name || "مستخدم"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
