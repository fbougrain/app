import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

declare global {
  var notes: any[]
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Générer un token public et mettre à jour la note
    const publicToken = uuidv4()
    const updatedNote = {
      ...note,
      status: "public",
      publicToken,
      updatedAt: new Date().toISOString(),
    }

    global.notes[noteIndex] = updatedNote

    return NextResponse.json({
      message: "Note rendue publique avec succès",
      note: updatedNote,
      publicUrl: `/public/${publicToken}`,
    })
  } catch (error) {
    console.error("Erreur lors de la publication de la note:", error)
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

    // Supprimer le token public et rendre la note privée
    const updatedNote = {
      ...note,
      status: note.sharedWith && note.sharedWith.length > 0 ? "shared" : "private",
      publicToken: null,
      updatedAt: new Date().toISOString(),
    }

    global.notes[noteIndex] = updatedNote

    return NextResponse.json({
      message: "Lien public supprimé avec succès",
      note: updatedNote,
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du lien public:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
