import { type NextRequest, NextResponse } from "next/server"

declare global {
  var notes: any[]
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const note = global.notes?.find((n) => n.publicToken === params.token && n.status === "public")

    if (!note) {
      return NextResponse.json({ message: "Note publique non trouvée ou expirée" }, { status: 404 })
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Erreur lors de la récupération de la note publique:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}
