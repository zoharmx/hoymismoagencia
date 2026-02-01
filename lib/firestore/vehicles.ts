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
import { Vehicle, VehicleFilters } from '@/types/crm'

const COLLECTION_NAME = 'vehicles'

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

// Crear nuevo vehículo
export async function createVehicle(
  vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Vehicle> {
  try {
    const now = Timestamp.now()

    const newVehicle: Omit<Vehicle, 'id'> = {
      ...vehicleData,
      createdAt: now,
      updatedAt: now,
    }

    // Limpiar valores undefined antes de guardar en Firestore
    const cleanedVehicle = removeUndefined(newVehicle)

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedVehicle)

    return {
      id: docRef.id,
      ...newVehicle,
    }
  } catch (error) {
    console.error('Error creating vehicle:', error)
    throw error
  }
}

// Obtener vehículo por ID
export async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Vehicle
    }

    return null
  } catch (error) {
    console.error('Error getting vehicle:', error)
    throw error
  }
}

// Obtener vehículo por VIN
export async function getVehicleByVin(vin: string): Promise<Vehicle | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('vin', '==', vin.toUpperCase()),
      limit(1)
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as Vehicle
    }

    return null
  } catch (error) {
    console.error('Error getting vehicle by VIN:', error)
    throw error
  }
}

// Obtener vehículos con filtros
export async function getVehicles(
  filters?: VehicleFilters,
  limitCount: number = 50
): Promise<Vehicle[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.brand) {
      constraints.push(where('brand', '==', filters.brand))
    }

    if (filters?.model) {
      constraints.push(where('model', '==', filters.model))
    }

    if (filters?.year) {
      constraints.push(where('year', '==', filters.year))
    }

    if (filters?.clientId) {
      constraints.push(where('clientId', '==', filters.clientId))
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
        }) as Vehicle
    )
  } catch (error) {
    console.error('Error getting vehicles:', error)
    throw error
  }
}

// Obtener vehículos por cliente
export async function getClientVehicles(clientId: string): Promise<Vehicle[]> {
  try {
    return await getVehicles({ clientId }, 100)
  } catch (error) {
    console.error('Error getting client vehicles:', error)
    throw error
  }
}

// Actualizar vehículo
export async function updateVehicle(
  id: string,
  updates: Partial<Omit<Vehicle, 'id' | 'createdAt'>>
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
    console.error('Error updating vehicle:', error)
    throw error
  }
}

// Eliminar vehículo
export async function deleteVehicle(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw error
  }
}

// Buscar vehículos por VIN, marca o modelo
export async function searchVehicles(searchTerm: string): Promise<Vehicle[]> {
  try {
    const vehicles = await getVehicles({}, 100)

    const searchLower = searchTerm.toLowerCase()

    return vehicles.filter(
      (vehicle) =>
        vehicle.vin.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        (vehicle.color && vehicle.color.toLowerCase().includes(searchLower))
    )
  } catch (error) {
    console.error('Error searching vehicles:', error)
    throw error
  }
}

// Obtener estadísticas de vehículos
export async function getVehicleStats() {
  try {
    const allVehicles = await getVehicles({}, 1000)

    // Contar por marca
    const brandCounts: Record<string, number> = {}
    allVehicles.forEach((v) => {
      const brand = v.brand || 'Desconocido'
      brandCounts[brand] = (brandCounts[brand] || 0) + 1
    })

    // Top marcas
    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([brand, count]) => ({ brand, count }))

    const stats = {
      total: allVehicles.length,
      byBrand: brandCounts,
      topBrands,
    }

    return stats
  } catch (error) {
    console.error('Error getting vehicle stats:', error)
    throw error
  }
}

// Verificar si un VIN ya existe
export async function vinExists(vin: string): Promise<boolean> {
  const vehicle = await getVehicleByVin(vin)
  return vehicle !== null
}
