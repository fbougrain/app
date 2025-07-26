import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Simulation d'une base de données en mémoire (partagée avec register)
declare global {
  var users: any[]
}

if (!global.users) {
  global.users = []
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation des données
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Trouver l'utilisateur
    const user = global.users.find((user) => user.email === email)
    if (!user) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    // Retourner la réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Connexion réussie",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
