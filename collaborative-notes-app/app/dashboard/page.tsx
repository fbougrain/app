"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlusCircle, Search, LogOut, Lock, Users, Globe } from "lucide-react"
import { NoteCard } from "@/components/note-card"
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

interface User {
  id: string
  name: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchNotes()
  }, [router])

  useEffect(() => {
    filterNotes()
  }, [notes, searchTerm, activeTab])

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes)
      } else {
        setError("Erreur lors du chargement des notes")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = notes

    // Filtrer par statut
    if (activeTab !== "all") {
      filtered = filtered.filter((note) => note.status === activeTab)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredNotes(filtered)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId))
      } else {
        setError("Erreur lors de la suppression")
      }
    } catch (error) {
      setError("Erreur de connexion")
    }
  }

  const handleShareNote = (note: Note) => {
    setSelectedNote(note)
    setShareDialogOpen(true)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Notes</h1>
              <p className="text-gray-600">Bienvenue, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => router.push("/notes/new")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle note
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par titre, contenu ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({notes.length})</TabsTrigger>
            <TabsTrigger value="private">
              <Lock className="h-4 w-4 mr-2" />
              Privées ({notes.filter((n) => n.status === "private").length})
            </TabsTrigger>
            <TabsTrigger value="shared">
              <Users className="h-4 w-4 mr-2" />
              Partagées ({notes.filter((n) => n.status === "shared").length})
            </TabsTrigger>
            <TabsTrigger value="public">
              <Globe className="h-4 w-4 mr-2" />
              Publiques ({notes.filter((n) => n.status === "public").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    {searchTerm ? "Aucune note trouvée pour cette recherche" : "Aucune note dans cette catégorie"}
                  </div>
                  <Button onClick={() => router.push("/notes/new")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Créer votre première note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => router.push(`/notes/${note.id}/edit`)}
                    onDelete={() => handleDeleteNote(note.id)}
                    onShare={() => handleShareNote(note)}
                    onView={() => router.push(`/notes/${note.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {selectedNote && (
        <ShareDialog
          note={selectedNote}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onUpdate={fetchNotes}
        />
      )}
    </div>
  )
}
