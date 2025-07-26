"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, X, Plus, Globe, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  status: "private" | "shared" | "public"
  createdAt: string
  updatedAt: string
  authorId: string
  authorName: string
  sharedWith?: string[]
  publicToken?: string
}

interface ShareDialogProps {
  note: Note
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function ShareDialog({ note, open, onOpenChange, onUpdate }: ShareDialogProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [publicUrl, setPublicUrl] = useState("")

  useEffect(() => {
    if (note.status === "public" && note.publicToken) {
      setPublicUrl(`${window.location.origin}/public/${note.publicToken}`)
    }
  }, [note])

  const handleShareWithUser = async () => {
    if (!email.trim()) return

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${note.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Note partagée",
          description: `La note a été partagée avec ${email}`,
        })
        setEmail("")
        onUpdate()
      } else {
        setError(data.message || "Erreur lors du partage")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleMakePublic = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${note.id}/public`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Note rendue publique",
          description: "Un lien public a été généré",
        })
        onUpdate()
      } else {
        setError(data.message || "Erreur lors de la publication")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePublic = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${note.id}/public`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Note rendue privée",
          description: "Le lien public a été supprimé",
        })
        onUpdate()
      } else {
        setError("Erreur lors de la suppression du lien public")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSharedUser = async (userEmail: string) => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${note.id}/share`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      })

      if (response.ok) {
        toast({
          title: "Partage supprimé",
          description: `Le partage avec ${userEmail} a été supprimé`,
        })
        onUpdate()
      } else {
        setError("Erreur lors de la suppression du partage")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: "Le lien a été copié dans le presse-papiers",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager la note</DialogTitle>
          <DialogDescription>Gérez les permissions de partage pour "{note.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Partage avec des utilisateurs spécifiques */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Partager avec des utilisateurs
            </Label>

            <div className="flex gap-2">
              <Input
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleShareWithUser()}
              />
              <Button onClick={handleShareWithUser} disabled={loading || !email.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {note.sharedWith && note.sharedWith.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Partagé avec :</p>
                <div className="flex flex-wrap gap-2">
                  {note.sharedWith.map((userEmail, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {userEmail}
                      <button
                        onClick={() => handleRemoveSharedUser(userEmail)}
                        className="hover:text-red-500"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lien public */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Lien public
            </Label>

            {note.status === "public" && publicUrl ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input value={publicUrl} readOnly />
                  <Button variant="outline" onClick={() => copyToClipboard(publicUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={handleRemovePublic} disabled={loading}>
                  Supprimer le lien public
                </Button>
              </div>
            ) : (
              <Button onClick={handleMakePublic} disabled={loading} className="w-full">
                Générer un lien public
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
