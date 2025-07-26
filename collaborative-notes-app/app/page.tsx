"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Search, Users, Lock, Globe } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Notes Collaboratives</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Créez, organisez et partagez vos notes en toute simplicité. Collaborez avec votre équipe et gardez vos idées
            organisées.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth/login")} className="bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/auth/register")}>
              S'inscrire
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <PlusCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Créer facilement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Créez des notes avec support Markdown, tags et organisation par statut</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Recherche avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Trouvez rapidement vos notes par titre, contenu ou tags</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Partage collaboratif</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Partagez vos notes avec votre équipe ou rendez-les publiques</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trois niveaux de visibilité</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Lock className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="font-semibold">Privé</h3>
              <p className="text-sm text-gray-600">Visible par vous uniquement</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">Partagé</h3>
              <p className="text-sm text-gray-600">Partagé avec des utilisateurs spécifiques</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold">Public</h3>
              <p className="text-sm text-gray-600">Accessible via lien public</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
