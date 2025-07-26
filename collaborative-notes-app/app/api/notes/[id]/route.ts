import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

declare global {
  var notes: any[]
  var users: any[]
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)

    const note = global.notes.find((n) => n.id === params.id)
    if (!note) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    // Vérifier les permissions
    if (note.status === "private" && (!decoded || note.authorId !== decoded.userId)) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    if (
      note.status === "shared" &&
      (!decoded || (note.authorId !== decoded.userId && !note.sharedWith.includes(decoded.email)))
    ) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Erreur lors de la récupération de la note:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const { title, content, tags, status } = await request.json()

    const noteIndex = global.notes.findIndex((n) => n.id === params.id)
    if (noteIndex === -1) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    const note = global.notes[noteIndex]

    // Vérifier que l'utilisateur est le propriétaire
    if (note.authorId !== decoded.userId) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    // Mettre à jour la note
    const updatedNote = {
      ...note,
      title: title || note.title,
      content: content || note.content,
      tags: tags || note.tags,
      status: status || note.status,
      updatedAt: new Date().toISOString(),
    }

    // Gérer le token public
    if (updatedNote.status === "public" && !updatedNote.publicToken) {
      updatedNote.publicToken = require("uuid").v4()
    } else if (updatedNote.status !== "public") {
      updatedNote.publicToken = null
    }

    global.notes[noteIndex] = updatedNote

    return NextResponse.json({
      message: "Note mise à jour avec succès",
      note: updatedNote,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const noteIndex = global.notes.findIndex((n) => n.id === params.id)
    if (noteIndex === -1) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    const note = global.notes[noteIndex]

    // Vérifier que l'utilisateur est le propriétaire
    if (note.authorId !== decoded.userId) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    // Supprimer la note
    global.notes.splice(noteIndex, 1)

    return NextResponse.json({
      message: "Note supprimée avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
