import { useState, useEffect } from 'react'
import {
  getClients,
  getShipments,
  getInvoices,
  getRecentActivities,
  getDashboardStats,
  getUsers,
  getCompanySettings,
  getSystemSettings,
} from '@/lib/firestore'
import type { Client, Shipment, Invoice, CRMActivity, DashboardStats, User, CompanySettings, SystemSettings } from '@/types/crm'

// Hook para obtener clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await getClients({ isActive: true })
        setClients(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener envíos
export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true)
        const data = await getShipments({})
        setShipments(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching shipments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  return { shipments, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener facturas
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const data = await getInvoices({})
        setInvoices(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching invoices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return { invoices, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener actividades del CRM
export function useCRMActivities(limit: number = 20) {
  const [activities, setActivities] = useState<CRMActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await getRecentActivities(limit)
        setActivities(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching activities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  return { activities, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener estadísticas del dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener usuarios
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers({}, 100)
        setUsers(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener configuración de la empresa
export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const data = await getCompanySettings()
        setSettings(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching company settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener configuración del sistema
export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const data = await getSystemSettings()
        setSettings(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching system settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error, refetch: () => window.location.reload() }
}
