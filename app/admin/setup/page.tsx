'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Database, TestTube, Sparkles } from 'lucide-react'

interface TestResult {
  success: boolean
  message: string
  details?: any
}

export default function SetupPage() {
  const [testing, setTesting] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [seedResult, setSeedResult] = useState<TestResult | null>(null)

  const runTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/test-firebase')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al ejecutar test',
        details: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setTesting(false)
    }
  }

  const runSeed = async () => {
    setSeeding(true)
    setSeedResult(null)

    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      setSeedResult(data)
    } catch (error) {
      setSeedResult({
        success: false,
        message: 'Error al ejecutar seed',
        details: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Configuración de Firebase
          </h1>
          <p className="text-slate-400">
            Panel de administración para verificar y configurar Firebase/Firestore
          </p>
        </div>

        <div className="space-y-6">
          {/* Test de Conexión */}
          <div className="card-gradient p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <TestTube className="w-6 h-6 text-blue-500" />
                  Test de Conexión
                </h2>
                <p className="text-sm text-slate-400">
                  Verifica que Firebase esté configurado correctamente
                </p>
              </div>
              <button
                onClick={runTest}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 btn-primary disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Probando...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    Ejecutar Test
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg border ${
                  testResult.success
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        testResult.success ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {testResult.message}
                    </p>
                    {testResult.details && (
                      <div className="mt-2 text-xs">
                        {testResult.details.collections && (
                          <div className="space-y-1">
                            <p className="text-slate-400 font-semibold">
                              Colecciones:
                            </p>
                            {Object.entries(testResult.details.collections).map(
                              ([name, info]: [string, any]) => (
                                <div key={name} className="flex items-center gap-2">
                                  {info.exists ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  )}
                                  <span className="text-slate-300">
                                    {name}: {info.exists ? `${info.documentCount} docs` : 'No existe'}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {testResult.details.error && (
                          <div className="mt-2">
                            <p className="text-red-400">Error:</p>
                            <pre className="text-xs text-slate-400 mt-1 p-2 bg-slate-900 rounded overflow-x-auto">
                              {testResult.details.error}
                            </pre>
                          </div>
                        )}
                        {testResult.details.hint && (
                          <p className="text-yellow-400 mt-2">
                            💡 {testResult.details.hint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seed de Datos */}
          <div className="card-gradient p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Database className="w-6 h-6 text-purple-500" />
                  Poblar Base de Datos
                </h2>
                <p className="text-sm text-slate-400">
                  Crea datos de ejemplo para probar el sistema
                </p>
              </div>
              <button
                onClick={runSeed}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Ejecutar Seed
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
              <p className="text-yellow-400 text-sm">
                ⚠️ Esto creará datos de ejemplo en tu base de datos. Solo ejecuta
                esto en desarrollo.
              </p>
            </div>

            {seedResult && (
              <div
                className={`p-4 rounded-lg border ${
                  seedResult.success
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {seedResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        seedResult.success ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {seedResult.message}
                    </p>
                    {seedResult.details && (
                      <pre className="text-xs text-slate-400 mt-2 p-2 bg-slate-900 rounded overflow-x-auto">
                        {JSON.stringify(seedResult.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="card-gradient p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Configuración Actual
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Project ID:</span>
                <span className="text-white font-mono">
                  {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No configurado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auth Domain:</span>
                <span className="text-white font-mono text-xs">
                  {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'No configurado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Storage Bucket:</span>
                <span className="text-white font-mono text-xs">
                  {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
                    'No configurado'}
                </span>
              </div>
            </div>
          </div>

          {/* Próximos Pasos */}
          <div className="card-gradient p-6">
            <h2 className="text-xl font-bold text-white mb-4">Próximos Pasos</h2>
            <ol className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold">1.</span>
                <span>
                  Ejecuta el <strong>Test de Conexión</strong> para verificar que
                  Firebase esté configurado
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold">2.</span>
                <span>
                  Ejecuta el <strong>Seed</strong> para crear datos de ejemplo
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold">3.</span>
                <span>
                  Ve al <a href="/dashboard" className="text-primary-400 hover:underline">Dashboard</a> para ver los datos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold">4.</span>
                <span>
                  Configura las{' '}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline"
                  >
                    reglas de seguridad
                  </a>{' '}
                  en Firebase Console
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
