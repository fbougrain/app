import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

// Simulation d'une base de données en mémoire
declare global {
  var notes: any[]
  var users: any[]
}

if (!global.notes) {
  global.notes = []
}

if (!global.users) {
  global.users = []
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

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    // Récupérer les notes de l'utilisateur et celles partagées avec lui
    let userNotes = global.notes.filter(
      (note) => note.authorId === decoded.userId || (note.sharedWith && note.sharedWith.includes(decoded.email)),
    )

    // Filtrer par recherche
    if (search) {
      userNotes = userNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Filtrer par statut
    if (status && status !== "all") {
      userNotes = userNotes.filter((note) => note.status === status)
    }

    // Trier par date de modification décroissante
    userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({ notes: userNotes })
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token invalide" }, { status: 401 })
    }

    const { title, content, tags, status } = await request.json()

    // Validation des données
    if (!title || !content) {
      return NextResponse.json({ message: "Titre et contenu requis" }, { status: 400 })
    }

    // Trouver l'utilisateur
    const user = global.users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Créer la note
    const note = {
      id: uuidv4(),
      title,
      content,
      tags: tags || [],
      status: status || "private",
      authorId: decoded.userId,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sharedWith: [],
      publicToken: null,
    }

    // Générer un token public si la note est publique
    if (note.status === "public") {
      note.publicToken = uuidv4()
    }

    global.notes.push(note)

    return NextResponse.json({
      message: "Note créée avec succès",
      note,
    })
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
