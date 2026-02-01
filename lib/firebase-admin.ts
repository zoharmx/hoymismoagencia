import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let adminApp: App
let adminDb: Firestore

function initAdmin() {
  if (getApps().length === 0) {
    // Verificar si tenemos las credenciales de servicio
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (serviceAccount) {
      try {
        const parsedCredentials = JSON.parse(serviceAccount)
        adminApp = initializeApp({
          credential: cert(parsedCredentials),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
      } catch (error) {
        console.error('Error parsing Firebase service account:', error)
        // Fallback: inicializar sin credenciales (usará Application Default Credentials)
        adminApp = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
      }
    } else {
      // Sin credenciales de servicio, intentar con las credenciales por defecto
      // Esto funciona en Google Cloud pero no en Vercel
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found, using default credentials')
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    }
  } else {
    adminApp = getApps()[0]
  }

  adminDb = getFirestore(adminApp)
  return { adminApp, adminDb }
}

// Lazy initialization
export function getAdminDb(): Firestore {
  if (!adminDb) {
    initAdmin()
  }
  return adminDb
}

export { adminApp, adminDb }
