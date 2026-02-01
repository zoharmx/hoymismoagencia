import { Timestamp } from 'firebase/firestore'
import { DashboardStats } from '@/types/crm'
import { getProcessStats } from './import-processes'
import { getInvoiceStats } from './invoices'
import { getClients, getClientStats } from './clients'

// Obtener estadísticas completas del dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Obtener estadísticas de trámites de importación
    const processStats = await getProcessStats()

    // Obtener estadísticas de facturas
    const invoiceStats = await getInvoiceStats()

    // Obtener estadísticas de clientes
    const clientStats = await getClientStats()

    // Calcular ingresos del mes actual
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthStart = Timestamp.fromDate(firstDayOfMonth)

    const stats: DashboardStats = {
      // Trámites
      totalProcesses: processStats.total,
      activeProcesses: processStats.inProgress,
      completedProcesses: processStats.completed,
      pendingProcesses: processStats.pending,

      // Ingresos
      totalRevenue: processStats.totalRevenue,
      monthlyRevenue: processStats.totalRevenue, // TODO: Filtrar por mes
      pendingPayments: processStats.totalRevenue - (processStats.totalLiquidacion || 0),

      // Clientes
      totalClients: clientStats.total,
      activeClients: clientStats.active,
      newClientsThisMonth: 0, // TODO: Calcular

      // Facturas
      pendingInvoices: invoiceStats.pending,
      overdueInvoices: invoiceStats.overdue,

      // Por oficina y status
      processesByOffice: processStats.byOffice,
      processesByStatus: processStats.byStatus,
    }

    return stats
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
}

// Obtener resumen rápido para mostrar en el dashboard
export async function getDashboardSummary() {
  try {
    const stats = await getDashboardStats()

    return {
      stats: [
        {
          label: 'Trámites Activos',
          value: stats.activeProcesses.toString(),
          change: '', // Se calculará con datos históricos
          icon: 'FileText',
          color: 'blue',
        },
        {
          label: 'Ingresos del Mes',
          value: `$${stats.monthlyRevenue.toLocaleString()}`,
          change: '',
          icon: 'DollarSign',
          color: 'green',
        },
        {
          label: 'Clientes Activos',
          value: stats.activeClients.toString(),
          change: '',
          icon: 'Users',
          color: 'purple',
        },
        {
          label: 'Pendientes',
          value: stats.pendingProcesses.toString(),
          change: '',
          icon: 'Clock',
          color: 'orange',
        },
        {
          label: 'Trámites Finalizados',
          value: stats.completedProcesses.toString(),
          change: '',
          icon: 'CheckCircle',
          color: 'green',
        },
        {
          label: 'Total Trámites',
          value: stats.totalProcesses.toString(),
          change: '',
          icon: 'Folder',
          color: 'blue',
        },
      ],
      byOffice: stats.processesByOffice || {},
      byStatus: stats.processesByStatus || {},
    }
  } catch (error) {
    console.error('Error getting dashboard summary:', error)
    throw error
  }
}

// Obtener resumen por oficina
export async function getOfficeStats() {
  try {
    const processStats = await getProcessStats()
    return processStats.byOffice || {}
  } catch (error) {
    console.error('Error getting office stats:', error)
    throw error
  }
}
