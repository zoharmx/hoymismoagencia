/**
 * Script para verificar la conexión a Firestore
 * Ejecuta esto para asegurarte de que Firebase está configurado correctamente
 */

import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export async function testFirestoreConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    console.log('🔍 Verificando conexión a Firestore...')

    // Test 1: Intentar leer una colección
    console.log('Test 1: Intentando leer colección...')
    const testCollection = collection(db, 'test_connection')
    const snapshot = await getDocs(testCollection)
    console.log(`✓ Colección leída. Documentos encontrados: ${snapshot.size}`)

    // Test 2: Intentar escribir un documento
    console.log('Test 2: Intentando escribir documento...')
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Test de conexión',
    })
    console.log(`✓ Documento creado con ID: ${testDoc.id}`)

    // Test 3: Intentar eliminar el documento
    console.log('Test 3: Intentando eliminar documento...')
    await deleteDoc(doc(db, 'test_connection', testDoc.id))
    console.log('✓ Documento eliminado')

    // Test 4: Verificar colecciones principales
    console.log('Test 4: Verificando colecciones del CRM...')
    const collections = ['clients', 'shipments', 'invoices', 'crm_activities']
    const collectionsStatus: any = {}

    for (const collectionName of collections) {
      try {
        const coll = collection(db, collectionName)
        const snap = await getDocs(coll)
        collectionsStatus[collectionName] = {
          exists: true,
          documentCount: snap.size,
        }
        console.log(`✓ ${collectionName}: ${snap.size} documentos`)
      } catch (error) {
        collectionsStatus[collectionName] = {
          exists: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }
        console.log(`⚠️ ${collectionName}: Error al leer`)
      }
    }

    return {
      success: true,
      message: '✅ Firestore está configurado correctamente',
      details: {
        collections: collectionsStatus,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('❌ Error en la conexión a Firestore:', error)

    return {
      success: false,
      message: '❌ Error al conectar con Firestore',
      details: {
        error: error instanceof Error ? error.message : 'Error desconocido',
        hint: 'Verifica que las variables de entorno estén configuradas correctamente en .env.local',
      },
    }
  }
}

// Función para verificar variables de entorno
export function checkEnvironmentVariables(): {
  configured: boolean
  missing: string[]
} {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ]

  const missing: string[] = []

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  })

  return {
    configured: missing.length === 0,
    missing,
  }
}
