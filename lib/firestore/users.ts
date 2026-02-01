import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc, // <--- CAMBIO IMPORTANTE: Usamos setDoc en lugar de addDoc
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
import { User, UserRole } from '@/types/crm'

const COLLECTION_NAME = 'users'

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

// Crear nuevo usuario (CORREGIDO)
export async function createUser(
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> {
  try {
    const now = Timestamp.now()
    
    // Usamos el UID de Auth como ID del documento
    const userId = userData.uid; 

    const newUser: Omit<User, 'id'> = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    const cleanedUser = removeUndefined(newUser)
    
    // CORRECCIÓN: Usamos setDoc para forzar el ID correcto
    const docRef = doc(db, COLLECTION_NAME, userId);
    await setDoc(docRef, cleanedUser)

    return {
      id: userId,
      ...newUser,
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Obtener usuario por ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as User
    }

    return null
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

// Obtener usuario por UID (OPTIMIZADO)
export async function getUserByUid(uid: string): Promise<User | null> {
  try {
    // Ahora hacemos lectura directa por ID
    return await getUser(uid);
  } catch (error) {
    console.error('Error getting user by UID:', error)
    throw error
  }
}

// --- Resto de funciones igual que antes (getUsers, updateUser, etc.) ---
// Puedes mantener el resto del archivo original a partir de aquí
export async function getUsers(
  filters?: {
    role?: UserRole
    isActive?: boolean
    department?: string
  },
  limitCount: number = 50
): Promise<User[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.role) {
      constraints.push(where('role', '==', filters.role))
    }

    if (filters?.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive))
    }

    if (filters?.department) {
      constraints.push(where('department', '==', filters.department))
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
        }) as User
    )
  } catch (error) {
    console.error('Error getting users:', error)
    throw error
  }
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'uid' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    const cleanedData = removeUndefined(updateData)
    await updateDoc(docRef, cleanedData)
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deactivateUser(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error deactivating user:', error)
    throw error
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export async function updateLastLogin(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      lastLogin: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating last login:', error)
    throw error
  }
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
  try {
    const users = await getUsers({}, 100)
    const searchLower = searchTerm.toLowerCase()

    return users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.department && user.department.toLowerCase().includes(searchLower))
    )
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

export async function getUserStats() {
  try {
    const allUsers = await getUsers({}, 1000)

    const stats = {
      total: allUsers.length,
      active: allUsers.filter((u) => u.isActive).length,
      inactive: allUsers.filter((u) => !u.isActive).length,
      byRole: {
        admin: allUsers.filter((u) => u.role === 'admin').length,
        manager: allUsers.filter((u) => u.role === 'manager').length,
        operator: allUsers.filter((u) => u.role === 'operator').length,
        viewer: allUsers.filter((u) => u.role === 'viewer').length,
      },
    }

    return stats
  } catch (error) {
    console.error('Error getting user stats:', error)
    throw error
  }
}