import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { CompanySettings, SystemSettings } from '@/types/crm'

const COMPANY_SETTINGS_DOC = 'company_settings'
const SYSTEM_SETTINGS_DOC = 'system_settings'
const SETTINGS_COLLECTION = 'settings'

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

// ============================================
// CONFIGURACIÓN DE LA EMPRESA
// ============================================

// Obtener configuración de la empresa
export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, COMPANY_SETTINGS_DOC)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as CompanySettings
    }

    return null
  } catch (error) {
    console.error('Error getting company settings:', error)
    throw error
  }
}

// Crear o actualizar configuración de la empresa
export async function saveCompanySettings(
  settings: Omit<CompanySettings, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CompanySettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, COMPANY_SETTINGS_DOC)
    const existing = await getDoc(docRef)
    const now = Timestamp.now()

    const data: Omit<CompanySettings, 'id'> = {
      ...settings,
      createdAt: existing.exists() ? existing.data().createdAt : now,
      updatedAt: now,
    }

    const cleanedData = removeUndefined(data)
    await setDoc(docRef, cleanedData)

    return {
      id: COMPANY_SETTINGS_DOC,
      ...data,
    }
  } catch (error) {
    console.error('Error saving company settings:', error)
    throw error
  }
}

// Actualizar configuración de la empresa parcialmente
export async function updateCompanySettings(
  updates: Partial<Omit<CompanySettings, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, COMPANY_SETTINGS_DOC)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    const cleanedData = removeUndefined(updateData)
    await updateDoc(docRef, cleanedData)
  } catch (error) {
    console.error('Error updating company settings:', error)
    throw error
  }
}

// ============================================
// CONFIGURACIÓN DEL SISTEMA
// ============================================

// Obtener configuración del sistema
export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SYSTEM_SETTINGS_DOC)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as SystemSettings
    }

    return null
  } catch (error) {
    console.error('Error getting system settings:', error)
    throw error
  }
}

// Crear o actualizar configuración del sistema
export async function saveSystemSettings(
  settings: Omit<SystemSettings, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SystemSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SYSTEM_SETTINGS_DOC)
    const existing = await getDoc(docRef)
    const now = Timestamp.now()

    const data: Omit<SystemSettings, 'id'> = {
      ...settings,
      createdAt: existing.exists() ? existing.data().createdAt : now,
      updatedAt: now,
    }

    const cleanedData = removeUndefined(data)
    await setDoc(docRef, cleanedData)

    return {
      id: SYSTEM_SETTINGS_DOC,
      ...data,
    }
  } catch (error) {
    console.error('Error saving system settings:', error)
    throw error
  }
}

// Actualizar configuración del sistema parcialmente
export async function updateSystemSettings(
  updates: Partial<Omit<SystemSettings, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SYSTEM_SETTINGS_DOC)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    const cleanedData = removeUndefined(updateData)
    await updateDoc(docRef, cleanedData)
  } catch (error) {
    console.error('Error updating system settings:', error)
    throw error
  }
}

// Inicializar configuración por defecto
export async function initializeDefaultSettings(): Promise<void> {
  try {
    const companySettings = await getCompanySettings()
    const systemSettings = await getSystemSettings()

    if (!companySettings) {
      await saveCompanySettings({
        companyName: 'HoyMismo Paquetería',
        legalName: 'HoyMismo Paquetería S.A. de C.V.',
        phone: '+1 (346) 555-0000',
        email: 'info@hoymismo.com',
        taxRate: 16, // IVA México
        currency: 'MXN',
        timezone: 'America/Mexico_City',
        language: 'es',
      })
      console.log('✓ Configuración de empresa inicializada')
    }

    if (!systemSettings) {
      await saveSystemSettings({
        emailNotifications: true,
        smsNotifications: false,
        autoInvoicing: false,
        invoicePrefix: 'INV',
        shipmentPrefix: 'HM',
        clientPrefix: 'CLT',
        lowStockAlert: false,
        maintenanceMode: false,
      })
      console.log('✓ Configuración del sistema inicializada')
    }
  } catch (error) {
    console.error('Error initializing default settings:', error)
    throw error
  }
}

// Obtener todas las configuraciones
export async function getAllSettings(): Promise<{
  company: CompanySettings | null
  system: SystemSettings | null
}> {
  try {
    const [company, system] = await Promise.all([
      getCompanySettings(),
      getSystemSettings(),
    ])

    return { company, system }
  } catch (error) {
    console.error('Error getting all settings:', error)
    throw error
  }
}
