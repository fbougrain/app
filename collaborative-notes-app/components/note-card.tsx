"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Lock, Users, Globe, MoreVertical, Edit, Trash2, Share, Eye } from "lucide-react"

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
}

interface NoteCardProps {
  note: Note
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
  onView: () => void
}

export function NoteCard({ note, onEdit, onDelete, onShare, onView }: NoteCardProps) {
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

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2" onClick={onView}>
              {note.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(note.status)}>
                {getStatusIcon(note.status)}
                <span className="ml-1">{getStatusLabel(note.status)}</span>
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Partager
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-3 line-clamp-3" onClick={onView}>
          {truncateContent(note.content.replace(/[#*`]/g, ""))}
        </CardDescription>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleDateString("fr-FR")}
          {note.updatedAt !== note.createdAt && <span> • Modifié</span>}
        </div>
      </CardContent>
    </Card>
  )
}
