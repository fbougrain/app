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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 })
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

    // Vérifier que l'utilisateur à partager existe
    const targetUser = global.users.find((u) => u.email === email)
    if (!targetUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier que la note n'est pas déjà partagée avec cet utilisateur
    if (note.sharedWith && note.sharedWith.includes(email)) {
      return NextResponse.json({ message: "Note déjà partagée avec cet utilisateur" }, { status: 400 })
    }

    // Ajouter l'utilisateur à la liste de partage
    const updatedNote = {
      ...note,
      status: "shared",
      sharedWith: [...(note.sharedWith || []), email],
      updatedAt: new Date().toISOString(),
    }

    global.notes[noteIndex] = updatedNote

    return NextResponse.json({
      message: "Note partagée avec succès",
      note: updatedNote,
    })
  } catch (error) {
    console.error("Erreur lors du partage de la note:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 })
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

    // Retirer l'utilisateur de la liste de partage
    const updatedSharedWith = (note.sharedWith || []).filter((userEmail: string) => userEmail !== email)

    const updatedNote = {
      ...note,
      sharedWith: updatedSharedWith,
      status: updatedSharedWith.length > 0 ? "shared" : "private",
      updatedAt: new Date().toISOString(),
    }

    global.notes[noteIndex] = updatedNote

    return NextResponse.json({
      message: "Partage supprimé avec succès",
      note: updatedNote,
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du partage:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
