import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function configureAIKeys() {
  console.log('🔧 Configurando API Keys del Asistente de IA...')

  const DEEPSEEK_API_KEY = 'sk-181034ba355c4292ad7f149d569ce4e7'
  const MISTRAL_API_KEY = 'cqrcNINDiUWdfsRkUk9BBCq52XzphD1V'

  try {
    // Referencia al documento de system settings
    const settingsRef = doc(db, 'system_settings', 'main')

    // Verificar si existe
    const settingsSnap = await getDoc(settingsRef)

    if (!settingsSnap.exists()) {
      console.error('❌ No se encontró el documento de configuración del sistema')
      console.log('Por favor ejecuta primero: npm run dev y visita /api/seed')
      process.exit(1)
    }

    // Actualizar las API keys
    await updateDoc(settingsRef, {
      'apiKeys.mistral': MISTRAL_API_KEY,
      'apiKeys.deepseek': DEEPSEEK_API_KEY,
      updatedAt: new Date()
    })

    console.log('✅ API Keys configuradas exitosamente!')
    console.log('')
    console.log('Configuración aplicada:')
    console.log('  - Mistral AI: ****' + MISTRAL_API_KEY.slice(-8))
    console.log('  - DeepSeek:   ****' + DEEPSEEK_API_KEY.slice(-8))
    console.log('')
    console.log('🤖 El Asistente de IA está listo para usar!')
    console.log('📍 Abre el dashboard y haz clic en "Asistente IA" en la barra superior')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error al configurar las API keys:', error)
    process.exit(1)
  }
}

configureAIKeys()
