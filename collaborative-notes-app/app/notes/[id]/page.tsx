"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, Share, Trash2, Lock, Users, Globe } from "lucide-react"
import { ShareDialog } from "@/components/share-dialog"

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

export default function NoteViewPage() {
  const router = useRouter()
  const params = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchNote(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (note) {
      // Simple markdown rendering
      let html = note.content
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/\n\n/gim, '</p><p class="mb-4">')
        .replace(/\n/gim, "<br>")

      html = '<p class="mb-4">' + html + "</p>"
      setRenderedContent(html)
    }
  }, [note])

  const fetchNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${noteId}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })

      if (response.ok) {
        const data = await response.json()
        setNote(data.note)
      } else {
        setError("Note non trouvée ou accès refusé")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!note || !confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError("Erreur lors de la suppression")
      }
    } catch (error) {
      setError("Erreur de connexion")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "private":
        return <Lock className="h-4 w-4" />
      case "shared":
        return <Users className="h-4 w-4" />
      case "public":
        return <Globe className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "private":
        return "bg-red-100 text-red-800"
      case "shared":
        return "bg-blue-100 text-blue-800"
      case "public":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "private":
        return "Privé"
      case "shared":
        return "Partagé"
      case "public":
        return "Public"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "Note non trouvée"}</AlertDescription>
            </Alert>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const isOwner = currentUser.id === note.authorId

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
                <p className="text-sm text-gray-600">
                  Par {note.authorName} • {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                  {note.updatedAt !== note.createdAt && (
                    <span> • Modifié le {new Date(note.updatedAt).toLocaleDateString("fr-FR")}</span>
                  )}
                </p>
              </div>
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => router.push(`/notes/${note.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(note.status)}>
                  {getStatusIcon(note.status)}
                  <span className="ml-1">{getStatusLabel(note.status)}</span>
                </Badge>
                {note.status === "public" && note.publicToken && (
                  <div className="text-sm text-gray-600">
                    Lien public : <code className="bg-gray-100 px-2 py-1 rounded">/public/{note.publicToken}</code>
                  </div>
                )}
              </div>
            </div>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          </CardContent>
        </Card>
      </main>

      {isOwner && (
        <ShareDialog
          note={note}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onUpdate={() => fetchNote(note.id)}
        />
      )}
    </div>
  )
}
