"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  status: "private" | "shared" | "public"
  createdAt: string
  updatedAt: string
  authorName: string
}

export default function PublicNotePage() {
  const params = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    if (params.token) {
      fetchPublicNote(params.token as string)
    }
  }, [params.token])

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

  const fetchPublicNote = async (token: string) => {
    try {
      const response = await fetch(`/api/public/${token}`)

      if (response.ok) {
        const data = await response.json()
        setNote(data.note)
      } else {
        setError("Note publique non trouvée ou expirée")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Globe className="h-6 w-6 text-green-600" />
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <Globe className="h-4 w-4 mr-1" />
                Note publique
              </Badge>
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Cette note a été partagée publiquement via Notes Collaboratives</p>
        </div>
      </main>
    </div>
  )
}
