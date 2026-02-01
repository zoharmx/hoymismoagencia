'use client'

import { useMemo } from 'react'
import { BarChart3, TrendingUp, DollarSign, Package, Users, FileText, Calendar } from 'lucide-react'
import type { Client, Shipment, Invoice } from '@/types/crm'

interface ReportsSectionProps {
  clients: Client[]
  shipments: Shipment[]
  invoices: Invoice[]
}

export default function ReportsSection({ clients, shipments, invoices }: ReportsSectionProps) {
  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalRevenue = invoices
      .filter(inv => inv.status === 'pagada')
      .reduce((sum, inv) => sum + inv.total, 0)

    const pendingRevenue = invoices
      .filter(inv => inv.status === 'pendiente')
      .reduce((sum, inv) => sum + inv.total, 0)

    const avgShipmentValue = shipments.length > 0
      ? shipments.reduce((sum, ship) => sum + ship.totalCost, 0) / shipments.length
      : 0

    const activeClients = clients.filter(c => c.isActive).length

    // Estadísticas por estatus de envío
    const shipmentsByStatus = shipments.reduce((acc, ship) => {
      acc[ship.status] = (acc[ship.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Ingresos por mes
    const revenueByMonth = invoices
      .filter(inv => inv.status === 'pagada' && inv.paidDate)
      .reduce((acc, inv) => {
        const month = inv.paidDate!.toDate().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
        acc[month] = (acc[month] || 0) + inv.total
        return acc
      }, {} as Record<string, number>)

    // Top 5 clientes por gastos
    const clientSpending = clients
      .map(client => ({
        name: client.name,
        totalSpent: client.totalSpent || 0,
        totalShipments: client.totalShipments || 0
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    return {
      totalRevenue,
      pendingRevenue,
      avgShipmentValue,
      activeClients,
      shipmentsByStatus,
      revenueByMonth,
      clientSpending
    }
  }, [clients, shipments, invoices])

  const statusLabels: Record<string, string> = {
    'pendiente': 'Pendiente',
    'en-transito': 'En Tránsito',
    'en-aduana': 'En Aduana',
    'en-distribucion': 'En Distribución',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado',
    'devuelto': 'Devuelto'
  }

  const statusColors: Record<string, string> = {
    'pendiente': 'bg-yellow-500',
    'en-transito': 'bg-blue-500',
    'en-aduana': 'bg-orange-500',
    'en-distribucion': 'bg-purple-500',
    'entregado': 'bg-green-500',
    'cancelado': 'bg-red-500',
    'devuelto': 'bg-slate-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reportes y Análisis</h2>
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Reportes
        </button>
      </div>

      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-gradient p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Ingresos Totales</p>
          <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Facturas pagadas</p>
        </div>

        <div className="card-gradient p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Ingresos Pendientes</p>
          <p className="text-2xl font-bold text-white">${stats.pendingRevenue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Por cobrar</p>
        </div>

        <div className="card-gradient p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Valor Promedio Envío</p>
          <p className="text-2xl font-bold text-white">${stats.avgShipmentValue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">{shipments.length} envíos totales</p>
        </div>

        <div className="card-gradient p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Clientes Activos</p>
          <p className="text-2xl font-bold text-white">{stats.activeClients}</p>
          <p className="text-xs text-slate-500 mt-2">De {clients.length} totales</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Envíos por Estado */}
        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Envíos por Estado
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.shipmentsByStatus).map(([status, count]) => {
              const percentage = shipments.length > 0 ? (count / shipments.length) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">{statusLabels[status] || status}</span>
                    <span className="text-sm font-semibold text-white">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColors[status] || 'bg-slate-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 5 Clientes */}
        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Top 5 Clientes
          </h3>
          <div className="space-y-4">
            {stats.clientSpending.map((client, index) => {
              const maxSpending = stats.clientSpending[0]?.totalSpent || 1
              const percentage = (client.totalSpent / maxSpending) * 100
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-300 truncate max-w-[200px]">{client.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${client.totalSpent.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{client.totalShipments} envíos</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {stats.clientSpending.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No hay datos de clientes disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingresos por Mes */}
      {Object.keys(stats.revenueByMonth).length > 0 && (
        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Ingresos por Mes
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.revenueByMonth)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([month, revenue]) => {
                const maxRevenue = Math.max(...Object.values(stats.revenueByMonth))
                const percentage = (revenue / maxRevenue) * 100
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 capitalize">{month}</span>
                      <span className="text-sm font-semibold text-white">${revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

function Download({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}
