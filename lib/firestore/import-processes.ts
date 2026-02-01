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
import {
  ImportProcess,
  ImportProcessFilters,
  ImportProcessStatus,
  ProcessEvent,
} from '@/types/crm'
import { incrementClientProcesses } from './clients'

const COLLECTION_NAME = 'import_processes'

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

// Generar folio de trámite (USHO-XXXX)
export function generateProcessFolio(): string {
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `USHO-${random}`
}

// Crear nuevo trámite de importación
export async function createImportProcess(
  processData: Omit<
    ImportProcess,
    'id' | 'folio' | 'createdAt' | 'updatedAt' | 'processHistory'
  >
): Promise<ImportProcess> {
  try {
    const now = Timestamp.now()
    const folio = processData.folio || generateProcessFolio()

    // Crear evento inicial del trámite
    const initialEvent: ProcessEvent = {
      date: now,
      status: processData.status,
      location: processData.oficina,
      description: 'Trámite registrado en el sistema',
    }

    const newProcess: Omit<ImportProcess, 'id'> = {
      ...processData,
      folio,
      createdAt: now,
      updatedAt: now,
      processHistory: [initialEvent],
    }

    // Limpiar valores undefined antes de guardar en Firestore
    const cleanedProcess = removeUndefined(newProcess)

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedProcess)

    // Actualizar contador del cliente
    await incrementClientProcesses(processData.clientId, processData.totalCost)

    return {
      id: docRef.id,
      ...newProcess,
    }
  } catch (error) {
    console.error('Error creating import process:', error)
    throw error
  }
}

// Obtener trámite por ID
export async function getImportProcess(id: string): Promise<ImportProcess | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ImportProcess
    }

    return null
  } catch (error) {
    console.error('Error getting import process:', error)
    throw error
  }
}

// Obtener trámite por folio
export async function getProcessByFolio(folio: string): Promise<ImportProcess | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('folio', '==', folio.toUpperCase()),
      limit(1)
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as ImportProcess
    }

    return null
  } catch (error) {
    console.error('Error getting process by folio:', error)
    throw error
  }
}

// Obtener trámite por VIN del vehículo
export async function getProcessByVin(vin: string): Promise<ImportProcess | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('vehicleVin', '==', vin.toUpperCase()),
      limit(1)
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as ImportProcess
    }

    return null
  } catch (error) {
    console.error('Error getting process by VIN:', error)
    throw error
  }
}

// Obtener trámites con filtros
export async function getImportProcesses(
  filters?: ImportProcessFilters,
  limitCount: number = 50
): Promise<ImportProcess[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }

    if (filters?.clientId) {
      constraints.push(where('clientId', '==', filters.clientId))
    }

    if (filters?.gestorId) {
      constraints.push(where('gestorId', '==', filters.gestorId))
    }

    if (filters?.oficina) {
      constraints.push(where('oficina', '==', filters.oficina))
    }

    if (filters?.tipoPedimento) {
      constraints.push(where('tipoPedimento', '==', filters.tipoPedimento))
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

    if (filters?.minValue) {
      constraints.push(where('totalCost', '>=', filters.minValue))
    }

    if (filters?.maxValue) {
      constraints.push(where('totalCost', '<=', filters.maxValue))
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
        }) as ImportProcess
    )
  } catch (error) {
    console.error('Error getting import processes:', error)
    throw error
  }
}

// Actualizar trámite
export async function updateImportProcess(
  id: string,
  updates: Partial<Omit<ImportProcess, 'id' | 'folio' | 'createdAt'>>
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
    console.error('Error updating import process:', error)
    throw error
  }
}

// Actualizar estado del trámite y agregar evento al historial
export async function updateProcessStatus(
  id: string,
  status: ImportProcessStatus,
  location: string,
  description: string,
  updatedBy?: string
): Promise<void> {
  try {
    const process = await getImportProcess(id)
    if (!process) {
      throw new Error('Import process not found')
    }

    const newEvent: ProcessEvent = {
      date: Timestamp.now(),
      status,
      location,
      description,
      updatedBy,
    }

    const updatedHistory = [...(process.processHistory || []), newEvent]

    const updates: Partial<ImportProcess> = {
      status,
      processHistory: updatedHistory,
      updatedAt: Timestamp.now(),
    }

    // Si se finalizó el trámite, guardar fecha de finalización
    if (status === 'tramite-finalizado') {
      updates.fechaFinalizacion = Timestamp.now()
    }

    await updateImportProcess(id, updates)
  } catch (error) {
    console.error('Error updating process status:', error)
    throw error
  }
}

// Eliminar trámite
export async function deleteImportProcess(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting import process:', error)
    throw error
  }
}

// Buscar trámites por folio, VIN o nombre del cliente
export async function searchImportProcesses(searchTerm: string): Promise<ImportProcess[]> {
  try {
    const processes = await getImportProcesses({}, 100)

    const searchLower = searchTerm.toLowerCase()

    return processes.filter(
      (process) =>
        process.folio.toLowerCase().includes(searchLower) ||
        process.vehicleVin?.toLowerCase().includes(searchLower) ||
        process.clientName.toLowerCase().includes(searchLower) ||
        process.vehicleBrand?.toLowerCase().includes(searchLower) ||
        process.vehicleModel?.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    console.error('Error searching import processes:', error)
    throw error
  }
}

// Obtener trámites recientes
export async function getRecentProcesses(count: number = 10): Promise<ImportProcess[]> {
  try {
    return await getImportProcesses({}, count)
  } catch (error) {
    console.error('Error getting recent processes:', error)
    throw error
  }
}

// Obtener trámites por cliente
export async function getClientProcesses(clientId: string): Promise<ImportProcess[]> {
  try {
    return await getImportProcesses({ clientId }, 100)
  } catch (error) {
    console.error('Error getting client processes:', error)
    throw error
  }
}

// Obtener trámites por gestor
export async function getGestorProcesses(gestorId: string): Promise<ImportProcess[]> {
  try {
    return await getImportProcesses({ gestorId }, 100)
  } catch (error) {
    console.error('Error getting gestor processes:', error)
    throw error
  }
}

// Obtener trámites por oficina
export async function getProcessesByOffice(oficina: string): Promise<ImportProcess[]> {
  try {
    return await getImportProcesses({ oficina }, 100)
  } catch (error) {
    console.error('Error getting processes by office:', error)
    throw error
  }
}

// Obtener estadísticas de trámites
export async function getProcessStats() {
  try {
    const allProcesses = await getImportProcesses({}, 1000)

    // Contar por status
    const statusCounts: Record<string, number> = {}
    allProcesses.forEach((p) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
    })

    // Contar por oficina
    const officeCounts: Record<string, number> = {}
    allProcesses.forEach((p) => {
      const office = p.oficina || 'Sin asignar'
      officeCounts[office] = (officeCounts[office] || 0) + 1
    })

    // Calcular ingresos
    const totalAnticipo = allProcesses.reduce((sum, p) => sum + (p.anticipo || 0), 0)
    const totalLiquidacion = allProcesses.reduce((sum, p) => sum + (p.liquidacion || 0), 0)
    const totalRevenue = totalAnticipo + totalLiquidacion

    const stats = {
      total: allProcesses.length,
      pending: allProcesses.filter(
        (p) =>
          p.status === 'contacto-creado' ||
          p.status === 'documentacion-inicial' ||
          p.status === 'vehiculo-validado'
      ).length,
      inProgress: allProcesses.filter(
        (p) =>
          p.status === 'anticipo-recibido' ||
          p.status === 'tramite-en-proceso' ||
          p.status === 'pedimento-generado'
      ).length,
      completed: allProcesses.filter((p) => p.status === 'tramite-finalizado').length,
      cancelled: allProcesses.filter((p) => p.status === 'cancelado').length,
      byStatus: statusCounts,
      byOffice: officeCounts,
      totalAnticipo,
      totalLiquidacion,
      totalRevenue,
    }

    return stats
  } catch (error) {
    console.error('Error getting process stats:', error)
    throw error
  }
}

// Alias para compatibilidad con código legacy
export const getShipments = getImportProcesses
export const getShipment = getImportProcess
export const createShipment = createImportProcess
export const updateShipment = updateImportProcess
export const deleteShipment = deleteImportProcess
export const searchShipments = searchImportProcesses
export const getRecentShipments = getRecentProcesses
export const getClientShipments = getClientProcesses
export const updateShipmentStatus = updateProcessStatus
export const getShipmentStats = getProcessStats
