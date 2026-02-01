'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  })
  const [firestoreTest, setFirestoreTest] = useState<string>('Probando...')

  useEffect(() => {
    // Verificar variables de entorno
    setEnvVars({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NO CONFIGURADA',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NO CONFIGURADA',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NO CONFIGURADA',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'NO CONFIGURADA',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'NO CONFIGURADA',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'NO CONFIGURADA',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'NO CONFIGURADA',
    })

    // Probar conexión a Firestore
    const testFirestore = async () => {
      try {
        const testCollection = collection(db, 'test')
        await getDocs(testCollection)
        setFirestoreTest('✅ Conexión exitosa')
      } catch (error: any) {
        setFirestoreTest(`❌ Error: ${error.message}`)
      }
    }

    testFirestore()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Página de Diagnóstico</h1>

        {/* Test de Firestore */}
        <div className="card-gradient p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Conexión a Firestore</h2>
          <p className="text-lg text-white font-mono">{firestoreTest}</p>
        </div>

        {/* Variables de Entorno */}
        <div className="card-gradient p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Variables de Entorno</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">API Key:</span>
                <p className={`font-mono ${envVars.apiKey === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.apiKey === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ Configurada'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Auth Domain:</span>
                <p className={`font-mono ${envVars.authDomain === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.authDomain === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ Configurada'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Project ID:</span>
                <p className={`font-mono ${envVars.projectId === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.projectId === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ ' + envVars.projectId}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Storage Bucket:</span>
                <p className={`font-mono ${envVars.storageBucket === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.storageBucket === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ Configurada'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Messaging Sender ID:</span>
                <p className={`font-mono ${envVars.messagingSenderId === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.messagingSenderId === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ Configurada'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">App ID:</span>
                <p className={`font-mono ${envVars.appId === 'NO CONFIGURADA' ? 'text-red-400' : 'text-green-400'}`}>
                  {envVars.appId === 'NO CONFIGURADA' ? '❌ NO CONFIGURADA' : '✅ Configurada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="card-gradient p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 Instrucciones</h2>
          <div className="space-y-4 text-slate-300">
            <p>Si ves variables marcadas como ❌ NO CONFIGURADA:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Ve a tu proyecto en Vercel</li>
              <li>Settings → Environment Variables</li>
              <li>Agrega las 8 variables de Firebase</li>
              <li>Selecciona: Production, Preview, Development</li>
              <li>Redeploy el proyecto desde Deployments</li>
              <li>Espera 2-3 minutos</li>
              <li>Recarga esta página</li>
            </ol>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 space-y-3">
          <a
            href="/dashboard"
            className="block w-full text-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Ir al Dashboard
          </a>
          <a
            href="/admin/setup"
            className="block w-full text-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Ir a Setup
          </a>
          <button
            onClick={() => window.location.reload()}
            className="block w-full text-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    </div>
  )
}
