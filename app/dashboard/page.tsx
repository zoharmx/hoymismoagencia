'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Bot,
  Loader2,
  Calendar,
  CreditCard,
} from 'lucide-react'
import { useClients, useShipments, useInvoices, useDashboardStats } from '@/lib/hooks/useFirestore'
import ClientForm from '@/components/forms/ClientForm'
import ShipmentForm from '@/components/forms/ShipmentForm'
import InvoiceForm from '@/components/forms/InvoiceForm'
import UsersSection from '@/components/sections/UsersSection'
import SettingsSection from '@/components/sections/SettingsSection'
import ReportsSection from '@/components/sections/ReportsSection'
import EditClientModal from '@/components/modals/EditClientModal'
import ClientDetailsModal from '@/components/modals/ClientDetailsModal'
import ShipmentDetailsModal from '@/components/modals/ShipmentDetailsModal'
import InvoiceDetailsModal from '@/components/modals/InvoiceDetailsModal'
import AIAssistant from '@/components/AIAssistant'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import type { ShipmentStatus, InvoiceStatus, Client, Shipment, Invoice } from '@/types/crm'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showShipmentForm, setShowShipmentForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientTypeFilter, setClientTypeFilter] = useState<'all' | 'individual' | 'empresa'>('all')
  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [clientSortBy, setClientSortBy] = useState<'name' | 'date' | 'spending'>('name')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [viewingClient, setViewingClient] = useState<Client | null>(null)
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)

  // Cargar datos de Firestore
  const { clients, loading: loadingClients, refetch: refetchClients } = useClients()
  const { shipments, loading: loadingShipments, refetch: refetchShipments } = useShipments()
  const { invoices, loading: loadingInvoices, refetch: refetchInvoices } = useInvoices()
  const { stats: dashboardStats, loading: loadingStats } = useDashboardStats()

  // Filtrar menú según rol del usuario
  const allMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, requiredRole: null },
    { id: 'shipments', label: 'Envíos', icon: Package, requiredRole: null },
    { id: 'clients', label: 'Clientes', icon: Users, requiredRole: null },
    { id: 'invoices', label: 'Facturación', icon: FileText, requiredRole: 'operator' },
    { id: 'reports', label: 'Reportes', icon: TrendingUp, requiredRole: 'manager' },
    { id: 'settings', label: 'Configuración', icon: Settings, requiredRole: 'manager' },
    { id: 'users', label: 'Usuarios', icon: Users, requiredRole: 'admin' },
  ]

  const menuItems = allMenuItems.filter(item => {
    if (!item.requiredRole) return true

    const roleHierarchy = {
      viewer: 1,
      operator: 2,
      manager: 3,
      admin: 4
    }

    return (
      roleHierarchy[user?.role as keyof typeof roleHierarchy || 'viewer'] >=
      roleHierarchy[item.requiredRole as keyof typeof roleHierarchy]
    )
  })

  const getStatusBadge = (status: ShipmentStatus) => {
    const badges: Record<ShipmentStatus, JSX.Element> = {
      'en-transito': (
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" /> En Tránsito
        </span>
      ),
      entregado: (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> Entregado
        </span>
      ),
      pendiente: (
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <AlertCircle className="w-3 h-3" /> Pendiente
        </span>
      ),
      'en-aduana': (
        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <AlertCircle className="w-3 h-3" /> En Aduana
        </span>
      ),
      'en-distribucion': (
        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <Package className="w-3 h-3" /> En Distribución
        </span>
      ),
      cancelado: (
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <X className="w-3 h-3" /> Cancelado
        </span>
      ),
      devuelto: (
        <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <AlertCircle className="w-3 h-3" /> Devuelto
        </span>
      ),
    }
    return badges[status] || null
  }

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    const badges: Record<InvoiceStatus, JSX.Element> = {
      pagada: (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
          Pagada
        </span>
      ),
      pendiente: (
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
          Pendiente
        </span>
      ),
      vencida: (
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
          Vencida
        </span>
      ),
      cancelada: (
        <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-semibold">
          Cancelada
        </span>
      ),
    }
    return badges[status] || null
  }

  const stats = [
    {
      label: 'Envíos Activos',
      value: loadingStats ? '...' : dashboardStats?.activeShipments.toString() || '0',
      change: '+12%',
      icon: Package,
      color: 'blue',
    },
    {
      label: 'Ingresos del Mes',
      value: loadingStats ? '...' : `$${dashboardStats?.monthlyRevenue.toLocaleString() || '0'}`,
      change: '+18%',
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Clientes Activos',
      value: loadingStats ? '...' : dashboardStats?.activeClients.toString() || '0',
      change: '+8%',
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Pendientes',
      value: loadingStats ? '...' : dashboardStats?.pendingShipments.toString() || '0',
      change: '-3%',
      icon: AlertCircle,
      color: 'orange',
    },
  ]

  const filteredClients = clients
    .filter((client) => {
      // Filtro de búsqueda
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientId.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de tipo
      const matchesType =
        clientTypeFilter === 'all' || client.type === clientTypeFilter

      // Filtro de estado
      const matchesStatus =
        clientStatusFilter === 'all' ||
        (clientStatusFilter === 'active' && client.isActive) ||
        (clientStatusFilter === 'inactive' && !client.isActive)

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      switch (clientSortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return b.createdAt.toMillis() - a.createdAt.toMillis()
        case 'spending':
          return (b.totalSpent || 0) - (a.totalSpent || 0)
        default:
          return 0
      }
    })

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFormSuccess = () => {
    refetchClients()
    refetchShipments()
    refetchInvoices()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <nav className="bg-slate-900 border-b border-white/10 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/logo.png"
                  alt="HoyMismo"
                  width={40}
                  height={40}
                />
                <div className="hidden sm:block">
                  <span className="font-display font-bold text-lg gradient-text">
                    HoyMismo
                  </span>
                  <p className="text-xs text-slate-400">Dashboard CRM</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
              >
                <Bot className="w-5 h-5" />
                <span className="hidden md:inline">Asistente IA</span>
              </button>
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'viewer'}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-white/10 transition-transform duration-300 pt-16 lg:pt-0`}
        >
          <div className="p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                  setSearchTerm('')
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="card-gradient p-6">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon
                          className={`w-10 h-10 text-${stat.color}-500`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            stat.change.startsWith('+')
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Shipments */}
                  <div className="card-gradient p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">
                        Envíos Recientes
                      </h3>
                      <button
                        onClick={() => setActiveSection('shipments')}
                        className="text-primary-400 hover:text-primary-300 text-sm font-semibold"
                      >
                        Ver Todos
                      </button>
                    </div>
                    {loadingShipments ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                      </div>
                    ) : shipments.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 mb-4">No hay envíos todavía</p>
                        <button
                          onClick={() => setShowShipmentForm(true)}
                          className="btn-primary"
                        >
                          Crear Primer Envío
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {shipments.slice(0, 3).map((shipment) => (
                          <div
                            key={shipment.id}
                            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-mono text-sm text-primary-400">
                                  {shipment.shipmentId}
                                </p>
                                <p className="text-white font-semibold">
                                  {shipment.clientName}
                                </p>
                              </div>
                              <p className="font-semibold text-white">
                                ${shipment.totalCost.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-slate-400 mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {shipment.origin.city}, {shipment.origin.state} → {shipment.destination.city}, {shipment.destination.state}
                            </div>
                            <div className="flex items-center justify-between">
                              {getStatusBadge(shipment.status)}
                              <span className="text-xs text-slate-500">
                                {shipment.createdAt.toDate().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="card-gradient p-6">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Acciones Rápidas
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowShipmentForm(true)}
                        className="w-full flex items-center justify-between p-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5 text-primary-400" />
                          <span className="text-white font-semibold">
                            Nuevo Envío
                          </span>
                        </div>
                        <span className="text-primary-400">→</span>
                      </button>
                      <button
                        onClick={() => setShowClientForm(true)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-slate-400" />
                          <span className="text-white font-semibold">
                            Registrar Cliente
                          </span>
                        </div>
                        <span className="text-slate-400">→</span>
                      </button>
                      <button
                        onClick={() => setShowInvoiceForm(true)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <span className="text-white font-semibold">
                            Generar Factura
                          </span>
                        </div>
                        <span className="text-slate-400">→</span>
                      </button>
                      <button
                        onClick={() => setActiveSection('reports')}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-5 h-5 text-slate-400" />
                          <span className="text-white font-semibold">
                            Ver Reportes
                          </span>
                        </div>
                        <span className="text-slate-400">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Shipments Section */}
            {activeSection === 'shipments' && (
              <div className="card-gradient p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Gestión de Envíos
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar envío..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                      <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => setShowShipmentForm(true)}
                      className="flex items-center gap-2 px-4 py-2 btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo
                    </button>
                  </div>
                </div>

                {loadingShipments ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  </div>
                ) : filteredShipments.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {searchTerm ? 'No se encontraron envíos' : 'No hay envíos todavía'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {searchTerm
                        ? 'Intenta con otro término de búsqueda'
                        : 'Crea tu primer envío para comenzar'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowShipmentForm(true)}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Envío
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            ID
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Cliente
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Ruta
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Estado
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Valor
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShipments.map((shipment) => (
                          <tr
                            key={shipment.id}
                            className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <p className="font-mono text-sm text-white">
                                {shipment.shipmentId}
                              </p>
                              {shipment.trackingNumber && (
                                <p className="text-xs text-slate-500">
                                  {shipment.trackingNumber}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 text-sm text-white">
                              {shipment.clientName}
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-white">
                                {shipment.origin.city}, {shipment.origin.state}
                              </p>
                              <p className="text-xs text-slate-400">
                                → {shipment.destination.city}, {shipment.destination.state}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(shipment.status)}
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-white">
                              ${shipment.totalCost.toFixed(2)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setViewingShipment(shipment)}
                                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                  title="Ver detalles y cambiar estado"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Clients Section */}
            {activeSection === 'clients' && (
              <div className="card-gradient p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">
                      Gestión de Clientes
                    </h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          // Exportar clientes a CSV
                          const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Empresa', 'RFC', 'Dirección', 'Ciudad', 'Estado', 'CP', 'País', 'Total Envíos', 'Total Gastado', 'Estado', 'Etiquetas', 'Fecha Registro']
                          const rows = filteredClients.map(client => [
                            client.clientId,
                            client.name,
                            client.email,
                            client.phone,
                            client.type,
                            client.company || '',
                            client.rfc || '',
                            client.address.street,
                            client.address.city,
                            client.address.state,
                            client.address.zipCode,
                            client.address.country,
                            client.totalShipments || 0,
                            (client.totalSpent || 0).toFixed(2),
                            client.isActive ? 'Activo' : 'Inactivo',
                            client.tags?.join('; ') || '',
                            client.createdAt.toDate().toLocaleDateString()
                          ])

                          const csvContent = [
                            headers.join(','),
                            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                          ].join('\n')

                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                          const link = document.createElement('a')
                          link.href = URL.createObjectURL(blob)
                          link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`
                          link.click()
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                        title="Exportar clientes a CSV"
                      >
                        <Download className="w-4 h-4" />
                        Exportar
                      </button>
                      <button
                        onClick={() => setShowClientForm(true)}
                        disabled={user?.role === 'viewer'}
                        className="flex items-center gap-2 px-4 py-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        title={user?.role === 'viewer' ? 'No tienes permisos para crear clientes' : 'Nuevo cliente'}
                      >
                        <Plus className="w-4 h-4" />
                        Nuevo Cliente
                      </button>
                    </div>
                  </div>

                  {/* Filtros y búsqueda */}
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, email o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <select
                      value={clientTypeFilter}
                      onChange={(e) => setClientTypeFilter(e.target.value as 'all' | 'individual' | 'empresa')}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="individual">Individual</option>
                      <option value="empresa">Empresa</option>
                    </select>

                    <select
                      value={clientStatusFilter}
                      onChange={(e) => setClientStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="active">Activos</option>
                      <option value="inactive">Inactivos</option>
                    </select>

                    <select
                      value={clientSortBy}
                      onChange={(e) => setClientSortBy(e.target.value as 'name' | 'date' | 'spending')}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="name">Ordenar: Nombre</option>
                      <option value="date">Ordenar: Más reciente</option>
                      <option value="spending">Ordenar: Mayor gasto</option>
                    </select>
                  </div>

                  {/* Contador de resultados */}
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-400">
                      Mostrando {filteredClients.length} de {clients.length} clientes
                    </p>
                    {(clientTypeFilter !== 'all' || clientStatusFilter !== 'all' || searchTerm) && (
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setClientTypeFilter('all')
                          setClientStatusFilter('all')
                        }}
                        className="text-primary-400 hover:text-primary-300 text-sm"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>

                {loadingClients ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {searchTerm ? 'No se encontraron clientes' : 'No hay clientes todavía'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {searchTerm
                        ? 'Intenta con otro término de búsqueda'
                        : 'Registra tu primer cliente para comenzar'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowClientForm(true)}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Cliente
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-6 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {client.name}
                              </h3>
                              <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs font-mono">
                                {client.clientId}
                              </span>
                              {client.type === 'empresa' && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                  Empresa
                                </span>
                              )}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-center text-sm text-slate-400">
                                <Mail className="w-4 h-4 mr-2" />
                                {client.email}
                              </div>
                              <div className="flex items-center text-sm text-slate-400">
                                <Phone className="w-4 h-4 mr-2" />
                                {client.phone}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-3">
                              <div>
                                <p className="text-xs text-slate-500">
                                  Total Envíos
                                </p>
                                <p className="text-white font-semibold">
                                  {client.totalShipments}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">
                                  Total Gastado
                                </p>
                                <p className="text-white font-semibold">
                                  ${client.totalSpent.toFixed(2)}
                                </p>
                              </div>
                              {client.lastShipmentDate && (
                                <div>
                                  <p className="text-xs text-slate-500">
                                    Último Envío
                                  </p>
                                  <p className="text-white font-semibold">
                                    {client.lastShipmentDate.toDate().toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewingClient(client)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingClient(client)}
                              disabled={user?.role === 'viewer'}
                              className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={user?.role === 'viewer' ? 'No tienes permisos para editar' : 'Editar cliente'}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invoices Section - Continuará en el siguiente mensaje */}
            {activeSection === 'invoices' && (
              <div className="card-gradient p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Gestión de Facturación
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar factura..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowInvoiceForm(true)}
                      className="flex items-center gap-2 px-4 py-2 btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Factura
                    </button>
                  </div>
                </div>

                {loadingInvoices ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {searchTerm ? 'No se encontraron facturas' : 'No hay facturas todavía'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {searchTerm
                        ? 'Intenta con otro término de búsqueda'
                        : 'Crea tu primera factura para comenzar'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowInvoiceForm(true)}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Factura
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            ID Factura
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Cliente
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Total
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Estado
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Vencimiento
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice) => (
                          <tr
                            key={invoice.id}
                            className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <p className="font-mono text-sm text-white">
                                {invoice.invoiceId}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-sm text-white">
                              {invoice.clientName}
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm font-semibold text-white">
                                ${invoice.total.toFixed(2)} {invoice.currency}
                              </p>
                              <p className="text-xs text-slate-500">
                                {invoice.items.length} item(s)
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              {getInvoiceStatusBadge(invoice.status)}
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-white">
                                {invoice.dueDate.toDate().toLocaleDateString()}
                              </p>
                              {invoice.paidDate && (
                                <p className="text-xs text-green-400">
                                  Pagada: {invoice.paidDate.toDate().toLocaleDateString()}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setViewingInvoice(invoice)}
                                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <ReportsSection
                clients={clients}
                shipments={shipments}
                invoices={invoices}
              />
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && <SettingsSection />}

            {/* Users Section */}
            {activeSection === 'users' && <UsersSection />}
          </div>
        </main>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          onClose={() => setShowAIAssistant(false)}
          isModal={true}
        />
      )}

      {/* Forms Modals */}
      {showClientForm && (
        <ClientForm
          onClose={() => setShowClientForm(false)}
          onSuccess={() => {
            handleFormSuccess()
            setShowClientForm(false)
          }}
        />
      )}

      {showShipmentForm && (
        <ShipmentForm
          onClose={() => setShowShipmentForm(false)}
          onSuccess={() => {
            handleFormSuccess()
            setShowShipmentForm(false)
          }}
        />
      )}

      {showInvoiceForm && (
        <InvoiceForm
          onClose={() => setShowInvoiceForm(false)}
          onSuccess={() => {
            handleFormSuccess()
            setShowInvoiceForm(false)
          }}
        />
      )}

      {/* Modal para ver detalles del cliente */}
      {viewingClient && (
        <ClientDetailsModal
          client={viewingClient}
          onClose={() => setViewingClient(null)}
          onSuccess={() => {
            refetchClients()
            setViewingClient(null)
          }}
          onEdit={(client) => {
            setViewingClient(null)
            setEditingClient(client)
          }}
        />
      )}

      {/* Modal para editar cliente */}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSuccess={() => {
            refetchClients()
            setEditingClient(null)
          }}
        />
      )}

      {/* Modal para ver detalles de envío y cambiar estado */}
      {viewingShipment && (
        <ShipmentDetailsModal
          shipment={viewingShipment}
          onClose={() => setViewingShipment(null)}
          onSuccess={() => {
            refetchShipments()
            setViewingShipment(null)
          }}
        />
      )}

      {/* Modal para ver detalles de factura */}
      {viewingInvoice && (
        <InvoiceDetailsModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onSuccess={() => {
            refetchInvoices()
            setViewingInvoice(null)
          }}
        />
      )}
    </div>
  )
}

export default function MainDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
