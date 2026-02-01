import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'

export async function POST() {
  try {
    console.log('🔧 Configurando API Keys del Asistente de IA...')

    const DEEPSEEK_API_KEY = 'sk-181034ba355c4292ad7f149d569ce4e7'
    const MISTRAL_API_KEY = 'cqrcNINDiUWdfsRkUk9BBCq52XzphD1V'

    // Referencia al documento de system settings
    const settingsRef = doc(db, 'system_settings', 'main')

    // Verificar si el documento existe
    const settingsSnap = await getDoc(settingsRef)

    if (!settingsSnap.exists()) {
      // Crear el documento de configuración del sistema
      await setDoc(settingsRef, {
        emailNotifications: true,
        smsNotifications: false,
        autoInvoicing: false,
        invoicePrefix: 'INV',
        shipmentPrefix: 'HM',
        clientPrefix: 'CLT',
        lowStockAlert: false,
        maintenanceMode: false,
        apiKeys: {
          mistral: MISTRAL_API_KEY,
          deepseek: DEEPSEEK_API_KEY,
          twillio: '',
          sendgrid: ''
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    } else {
      // Actualizar solo las API keys
      await setDoc(settingsRef, {
        ...settingsSnap.data(),
        apiKeys: {
          ...settingsSnap.data().apiKeys,
          mistral: MISTRAL_API_KEY,
          deepseek: DEEPSEEK_API_KEY
        },
        updatedAt: Timestamp.now()
      }, { merge: true })
    }

    console.log('✅ API Keys configuradas exitosamente!')

    return NextResponse.json({
      success: true,
      message: '🤖 API Keys configuradas exitosamente! El Asistente de IA está listo.',
      keys: {
        mistral: '****' + MISTRAL_API_KEY.slice(-8),
        deepseek: '****' + DEEPSEEK_API_KEY.slice(-8)
      }
    })

  } catch (error: any) {
    console.error('❌ Error al configurar las API keys:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
