'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Package,
  FileText,
  History,
  Settings,
  LogOut,
  Search,
  Download,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getClientByEmail, getClientShipments, getClientInvoices } from '@/lib/firestore'
import type { Client, Shipment, Invoice } from '@/types/crm'

export default function PortalDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('shipments')
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<Client | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/portal')
      return
    }
    loadClientData()
  }, [user, router])

  const loadClientData = async () => {
    if (!user?.email) return

    try {
      setLoading(true)
      const clientData = await getClientByEmail(user.email)

      if (!clientData) {
        alert('No se encontró información del cliente para este usuario')
        router.push('/portal')
        return
      }

      setClient(clientData)

      const [clientShipments, clientInvoices] = await Promise.all([
        getClientShipments(clientData.id),
        getClientInvoices(clientData.id)
      ])

      setShipments(clientShipments)
      setInvoices(clientInvoices)
    } catch (error) {
      console.error('Error loading client data:', error)
      alert('Error al cargar los datos del cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/portal')
  }

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    )
  }

  const activeShipments = shipments.filter(s => s.status !== 'entregado' && s.status !== 'cancelado')
  const pendingInvoices = invoices.filter(i => i.status === 'pendiente')
  const totalPaid = invoices.filter(i => i.status === 'pagada').reduce((sum, inv) => sum + inv.total, 0)
  const deliveryRate = shipments.length > 0
    ? Math.round((shipments.filter(s => s.status === 'entregado').length / shipments.length) * 100)
    : 0

  const stats = [
    { label: 'Envíos Activos', value: activeShipments.length.toString(), icon: Package, color: 'primary' },
    { label: 'Total Enviado', value: shipments.length.toString(), icon: TrendingUp, color: 'green' },
    { label: 'Facturas Pendientes', value: pendingInvoices.length.toString(), icon: FileText, color: 'orange' },
    { label: 'Tasa de Éxito', value: `${deliveryRate}%`, icon: CheckCircle2, color: 'green' },
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      'en-transito': (
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> En Tránsito
        </span>
      ),
      entregado: (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Entregado
        </span>
      ),
      pendiente: (
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Pendiente
        </span>
      ),
      pagada: (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
          Pagada
        </span>
      ),
    }
    return badges[status as keyof typeof badges]
  }

  const menuItems = [
    { id: 'shipments', label: 'Mis Envíos', icon: Package },
    { id: 'invoices', label: 'Facturas', icon: FileText },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

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
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                  <p className="text-xs text-slate-400">Portal Clientes</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white">{client.name}</p>
                <p className="text-xs text-slate-400">{client.clientId}</p>
              </div>
              <button
                onClick={handleLogout}
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
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
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
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="card-gradient p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-10 h-10 text-${stat.color}-500`} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="card-gradient p-6">
              {/* Shipments Tab */}
              {activeTab === 'shipments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Mis Envíos
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar envío..."
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {shipments.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        No hay envíos todavía
                      </h3>
                      <p className="text-slate-400">
                        Tus envíos aparecerán aquí una vez que estén registrados
                      </p>
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
                              Ruta
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Estado
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Peso
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Entrega Est.
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.map((shipment) => (
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
                              <td className="py-4 px-4 text-sm text-slate-300">
                                {shipment.weight} kg
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-300">
                                {shipment.estimatedDelivery
                                  ? shipment.estimatedDelivery.toDate().toLocaleDateString()
                                  : 'Por confirmar'}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Invoices Tab */}
              {activeTab === 'invoices' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Facturas
                  </h2>
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        No hay facturas todavía
                      </h3>
                      <p className="text-slate-400">
                        Tus facturas aparecerán aquí una vez que estén generadas
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Factura
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Fecha
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                              Monto
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
                          {invoices.map((invoice) => (
                            <tr
                              key={invoice.id}
                              className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="py-4 px-4 font-mono text-sm text-white">
                                {invoice.invoiceId}
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-300">
                                {invoice.createdAt.toDate().toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-sm font-semibold text-white">
                                ${invoice.total.toFixed(2)} {invoice.currency}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(invoice.status)}
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-300">
                                {invoice.dueDate.toDate().toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
                                  title="Descargar factura"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Historial Completo
                  </h2>
                  <p className="text-slate-400">
                    Aquí aparecerá el historial completo de todas tus
                    transacciones y envíos.
                  </p>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Configuración de Cuenta
                  </h2>
                  <div className="space-y-6">
                    <div className="card-gradient p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Información Personal
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={client.name}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">
                            Correo
                          </label>
                          <input
                            type="email"
                            value={client.email}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            value={client.phone}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">
                            Dirección
                          </label>
                          <textarea
                            value={`${client.address.street}\n${client.address.city}, ${client.address.state} ${client.address.zipCode}\n${client.address.country}`}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            rows={4}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
