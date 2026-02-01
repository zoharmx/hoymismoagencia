'use client'

import { useState } from 'react'
import { useUsers } from '@/lib/hooks/useFirestore'
import { createUser, updateUser, deactivateUser } from '@/lib/firestore'
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  XCircle,
  Building,
} from 'lucide-react'
import type { User, UserRole } from '@/types/crm'
import { Timestamp } from 'firebase/firestore'

export default function UsersSection() {
  const { users, loading, refetch } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    role: 'viewer' as UserRole,
    department: '',
  })

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getRoleBadge = (role: UserRole) => {
    const badges: Record<UserRole, JSX.Element> = {
      admin: (
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Shield className="w-3 h-3" /> Admin
        </span>
      ),
      manager: (
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Shield className="w-3 h-3" /> Manager
        </span>
      ),
      operator: (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Shield className="w-3 h-3" /> Operador
        </span>
      ),
      viewer: (
        <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Shield className="w-3 h-3" /> Visualizador
        </span>
      ),
    }
    return badges[role]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          displayName: formData.displayName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
        })
      } else {
        await createUser({
          uid: 'temp-' + Date.now(), // En producción, esto vendría de Firebase Auth
          displayName: formData.displayName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
          isActive: true,
        })
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({
        displayName: '',
        email: '',
        phone: '',
        role: 'viewer',
        department: '',
      })
      refetch()
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error al guardar el usuario')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      displayName: user.displayName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department || '',
    })
    setShowForm(true)
  }

  const handleDeactivate = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
      try {
        await deactivateUser(userId)
        refetch()
      } catch (error) {
        console.error('Error deactivating user:', error)
        alert('Error al desactivar el usuario')
      }
    }
  }

  return (
    <div className="card-gradient p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="text-slate-400 text-sm mt-1">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setFormData({
                displayName: '',
                email: '',
                phone: '',
                role: 'viewer',
                department: '',
              })
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 btn-primary"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios todavía'}
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Crea tu primer usuario para comenzar'}
          </p>
          {!searchTerm && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-6 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {user.displayName}
                    </h3>
                    {getRoleBadge(user.role)}
                    {user.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle2 className="w-3 h-3" /> Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <XCircle className="w-3 h-3" /> Inactivo
                      </span>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center text-sm text-slate-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-slate-400">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.phone}
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center text-sm text-slate-400">
                        <Building className="w-4 h-4 mr-2" />
                        {user.department}
                      </div>
                    )}
                  </div>
                  {user.lastLogin && (
                    <div className="mt-2 text-xs text-slate-500">
                      Último acceso: {user.lastLogin.toDate().toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {user.isActive && (
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="+1 (346) 555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Rol *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="operator">Operador</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Operaciones"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
