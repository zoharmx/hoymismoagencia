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
import { CRMActivity, ActivityType, NotePriority } from '@/types/crm'

const COLLECTION_NAME = 'crm_activities'

// Crear nueva actividad
export async function createActivity(
  activityData: Omit<CRMActivity, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CRMActivity> {
  try {
    const now = Timestamp.now()

    const newActivity: Omit<CRMActivity, 'id'> = {
      ...activityData,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newActivity)

    return {
      id: docRef.id,
      ...newActivity,
    }
  } catch (error) {
    console.error('Error creating activity:', error)
    throw error
  }
}

// Obtener actividad por ID
export async function getActivity(id: string): Promise<CRMActivity | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as CRMActivity
    }

    return null
  } catch (error) {
    console.error('Error getting activity:', error)
    throw error
  }
}

// Obtener actividades de un cliente
export async function getClientActivities(
  clientId: string,
  limitCount: number = 50
): Promise<CRMActivity[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting client activities:', error)
    throw error
  }
}

// Obtener actividades pendientes
export async function getPendingActivities(
  assignedTo?: string,
  limitCount: number = 50
): Promise<CRMActivity[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('completedAt', '==', null),
      orderBy('dueDate', 'asc'),
      limit(limitCount),
    ]

    if (assignedTo) {
      constraints.unshift(where('assignedTo', '==', assignedTo))
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting pending activities:', error)
    throw error
  }
}

// Obtener actividades por tipo
export async function getActivitiesByType(
  type: ActivityType,
  limitCount: number = 50
): Promise<CRMActivity[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting activities by type:', error)
    throw error
  }
}

// Obtener actividades recientes
export async function getRecentActivities(
  limitCount: number = 20
): Promise<CRMActivity[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting recent activities:', error)
    throw error
  }
}

// Actualizar actividad
export async function updateActivity(
  id: string,
  updates: Partial<Omit<CRMActivity, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating activity:', error)
    throw error
  }
}

// Marcar actividad como completada
export async function completeActivity(id: string): Promise<void> {
  try {
    await updateActivity(id, {
      completedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error completing activity:', error)
    throw error
  }
}

// Eliminar actividad
export async function deleteActivity(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting activity:', error)
    throw error
  }
}

// Obtener actividades vencidas
export async function getOverdueActivities(
  assignedTo?: string
): Promise<CRMActivity[]> {
  try {
    const now = Timestamp.now()
    const constraints: QueryConstraint[] = [
      where('completedAt', '==', null),
      where('dueDate', '<', now),
      orderBy('dueDate', 'asc'),
    ]

    if (assignedTo) {
      constraints.unshift(where('assignedTo', '==', assignedTo))
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting overdue activities:', error)
    throw error
  }
}

// Obtener actividades de alta prioridad
export async function getHighPriorityActivities(
  limitCount: number = 20
): Promise<CRMActivity[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('priority', '==', 'alta'),
      where('completedAt', '==', null),
      orderBy('dueDate', 'asc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CRMActivity
    )
  } catch (error) {
    console.error('Error getting high priority activities:', error)
    throw error
  }
}

// Obtener estadísticas de actividades
export async function getActivityStats() {
  try {
    const allActivities = await getRecentActivities(1000)

    const stats = {
      total: allActivities.length,
      pending: allActivities.filter((a) => !a.completedAt).length,
      completed: allActivities.filter((a) => a.completedAt).length,
      highPriority: allActivities.filter(
        (a) => a.priority === 'alta' && !a.completedAt
      ).length,
      overdue: allActivities.filter(
        (a) =>
          !a.completedAt &&
          a.dueDate &&
          a.dueDate.toDate() < new Date()
      ).length,
    }

    return stats
  } catch (error) {
    console.error('Error getting activity stats:', error)
    throw error
  }
}
