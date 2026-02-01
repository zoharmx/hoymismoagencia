'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import type { UserRole } from '@/types/crm'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Si no hay usuario, redirigir al login
      if (!user) {
        router.push('/login')
        return
      }

      // Si hay un rol requerido y el usuario no tiene permisos
      if (requiredRole && !hasPermission(requiredRole)) {
        alert('No tienes permisos para acceder a esta sección')
        router.push('/dashboard')
      }
    }
  }, [user, loading, requiredRole, router, hasPermission])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar nada (se redirigirá al login)
  if (!user) {
    return null
  }

  // Si hay rol requerido y no tiene permisos, no mostrar nada
  if (requiredRole && !hasPermission(requiredRole)) {
    return null
  }

  // Todo bien, mostrar el contenido
  return <>{children}</>
}
