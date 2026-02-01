import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Invoice, InvoiceFilters, InvoiceStatus } from '@/types/crm'

const COLLECTION_NAME = 'invoices'

// Helper: Eliminar valores undefined de un objeto
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key]
    }
  }
  return cleaned
}

// Generar ID personalizado para factura
export function generateInvoiceId(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-5)
  return `INV-${year}-${timestamp}`
}

// Crear nueva factura
export async function createInvoice(
  invoiceData: Omit<Invoice, 'id' | 'invoiceId' | 'createdAt' | 'updatedAt'>
): Promise<Invoice> {
  try {
    const now = Timestamp.now()
    const invoiceId = generateInvoiceId()

    const newInvoice: Omit<Invoice, 'id'> = {
      ...invoiceData,
      invoiceId,
      createdAt: now,
      updatedAt: now,
    }

    // Limpiar valores undefined antes de guardar en Firestore
    const cleanedInvoice = removeUndefined(newInvoice)

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedInvoice)

    return {
      id: docRef.id,
      ...newInvoice,
    }
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

// Obtener factura por ID
export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Invoice
    }

    return null
  } catch (error) {
    console.error('Error getting invoice:', error)
    throw error
  }
}

// Obtener facturas con filtros
export async function getInvoices(
  filters?: InvoiceFilters,
  limitCount: number = 50
): Promise<Invoice[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }

    if (filters?.clientId) {
      constraints.push(where('clientId', '==', filters.clientId))
    }

    if (filters?.startDate) {
      constraints.push(
        where('createdAt', '>=', Timestamp.fromDate(filters.startDate))
      )
    }

    if (filters?.endDate) {
      constraints.push(
        where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
      )
    }

    if (filters?.minAmount) {
      constraints.push(where('total', '>=', filters.minAmount))
    }

    if (filters?.maxAmount) {
      constraints.push(where('total', '<=', filters.maxAmount))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(limitCount))

    const q = query(collection(db, COLLECTION_NAME), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Invoice
    )
  } catch (error) {
    console.error('Error getting invoices:', error)
    throw error
  }
}

// Actualizar factura
export async function updateInvoice(
  id: string,
  updates: Partial<Omit<Invoice, 'id' | 'invoiceId' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    // Limpiar valores undefined antes de actualizar
    const cleanedData = removeUndefined(updateData)
    await updateDoc(docRef, cleanedData)
  } catch (error) {
    console.error('Error updating invoice:', error)
    throw error
  }
}

// Marcar factura como pagada
export async function markInvoiceAsPaid(
  id: string,
  paymentMethod?: string,
  paymentReference?: string
): Promise<void> {
  try {
    await updateInvoice(id, {
      status: 'pagada',
      paidDate: Timestamp.now(),
      paymentMethod,
      paymentReference,
    })
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    throw error
  }
}

// Eliminar factura
export async function deleteInvoice(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting invoice:', error)
    throw error
  }
}

// Buscar facturas
export async function searchInvoices(searchTerm: string): Promise<Invoice[]> {
  try {
    const invoices = await getInvoices({}, 100)

    const searchLower = searchTerm.toLowerCase()

    return invoices.filter(
      (invoice) =>
        invoice.invoiceId.toLowerCase().includes(searchLower) ||
        invoice.clientName.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    console.error('Error searching invoices:', error)
    throw error
  }
}

// Obtener facturas vencidas
export async function getOverdueInvoices(): Promise<Invoice[]> {
  try {
    const now = Timestamp.now()
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pendiente'),
      where('dueDate', '<', now),
      orderBy('dueDate', 'asc')
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Invoice
    )
  } catch (error) {
    console.error('Error getting overdue invoices:', error)
    throw error
  }
}

// Obtener estadísticas de facturas
export async function getInvoiceStats() {
  try {
    const allInvoices = await getInvoices({}, 1000)

    const stats = {
      total: allInvoices.length,
      pending: allInvoices.filter((i) => i.status === 'pendiente').length,
      paid: allInvoices.filter((i) => i.status === 'pagada').length,
      overdue: allInvoices.filter((i) => i.status === 'vencida').length,
      totalAmount: allInvoices.reduce((sum, i) => sum + i.total, 0),
      pendingAmount: allInvoices
        .filter((i) => i.status === 'pendiente')
        .reduce((sum, i) => sum + i.total, 0),
    }

    return stats
  } catch (error) {
    console.error('Error getting invoice stats:', error)
    throw error
  }
}

// Obtener facturas de un cliente
export async function getClientInvoices(clientId: string): Promise<Invoice[]> {
  try {
    return await getInvoices({ clientId }, 100)
  } catch (error) {
    console.error('Error getting client invoices:', error)
    throw error
  }
}
