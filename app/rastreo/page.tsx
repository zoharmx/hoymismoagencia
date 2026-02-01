'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Search, X as XIcon, Sparkles, FileText, Cog, SearchCheck, Flag, Truck, PackageCheck } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Shipment } from '@/types/crm'

const STATUS_CONFIG = {
  'pendiente': { icon: FileText, label: 'Revisión Documental', color: 'yellow' },
  'en-transito': { icon: Cog, label: 'En Tránsito', color: 'blue' },
  'en-aduana': { icon: SearchCheck, label: 'En Aduana', color: 'orange' },
  'en-distribucion': { icon: Flag, label: 'En Distribución', color: 'purple' },
  'entregado': { icon: PackageCheck, label: 'Entregado', color: 'green' },
  'cancelado': { icon: XIcon, label: 'Cancelado', color: 'red' },
  'devuelto': { icon: Truck, label: 'Devuelto', color: 'gray' },
} as const

const STATUS_ORDER = ['pendiente', 'en-transito', 'en-aduana', 'en-distribucion', 'entregado'] as const

export default function RastreoPage() {
  const searchParams = useSearchParams()
  const [trackingId, setTrackingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [generatingAI, setGeneratingAI] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setTrackingId(id)
      // Automatically search on mount
      const autoSearch = async () => {
        const idToSearch = id.trim().toUpperCase()
        setLoading(true)
        setError(null)

        try {
          const shipmentsRef = collection(db, 'shipments')
          const q = query(shipmentsRef, where('shipmentId', '==', idToSearch))
          const querySnapshot = await getDocs(q)

          if (querySnapshot.empty) {
            setError('No se encontró ningún envío con este número de guía.')
          } else {
            const shipments = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Shipment))
            const latestShipment = shipments.sort((a, b) => {
              const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
              const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
              return bTime - aTime
            })[0]
            setShipment(latestShipment)
          }
        } catch (err) {
          console.error('Error searching shipment:', err)
          setError('Ocurrió un error al buscar el envío.')
        } finally {
          setLoading(false)
        }
      }
      autoSearch()
    }
  }, [searchParams])

  const handleSearchWithId = async (id: string) => {
    if (!id.trim()) {
      setError('Por favor, ingrese un número de guía válido.')
      return
    }

    setLoading(true)
    setError(null)
    setShipment(null)

    try {
      // Search for shipment by shipmentId
      const shipmentsRef = collection(db, 'shipments')
      const q = query(shipmentsRef, where('shipmentId', '==', id.trim().toUpperCase()))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError('No se encontró ningún envío con este número de guía.')
      } else {
        // Get the most recent shipment
        const shipments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Shipment))

        // Sort by creation date and get the latest
        const latestShipment = shipments.sort((a, b) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
          return bTime - aTime
        })[0]

        setShipment(latestShipment)
      }
    } catch (err) {
      console.error('Error searching shipment:', err)
      setError('Ocurrió un error al buscar el envío. Por favor, intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    handleSearchWithId(trackingId)
  }

  const handleGenerateAISummary = async () => {
    if (!shipment) return

    setShowAIModal(true)
    setGeneratingAI(true)

    try {
      const GEMINI_API_KEY = 'AIzaSyDasPtcV4Gh4XBx1BKwxHNZPFig5wZ5I_0'
      const statusInfo = STATUS_CONFIG[shipment.status as keyof typeof STATUS_CONFIG]

      const systemPrompt = "Eres un asistente experto de una agencia de paquetería internacional. Tu tarea es generar un resumen ejecutivo claro, conciso y amigable para un cliente sobre el estado de su envío. Traduce la jerga técnica a un lenguaje fácil de entender. Sé profesional y tranquilizador. El resumen debe estar en español y formateado en un solo párrafo."

      const userQuery = `
        Genera un resumen ejecutivo para el cliente sobre su envío con ID ${shipment.shipmentId}.
        Detalles:
        - Destinatario: ${shipment.destination.city}, ${shipment.destination.country}
        - Estatus Actual: ${statusInfo?.label || shipment.status}
        - Peso: ${shipment.weight} kg
        - Tipo de paquete: ${shipment.packageType}
        - Descripción: ${shipment.description}

        Basado en el estatus, explica brevemente qué significa, qué se ha completado y cuáles son los siguientes pasos. Finaliza con un tono positivo.
      `

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      const result = await response.json()
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        throw new Error("Unexpected response structure from Gemini API.")
      }

      setAiSummary(text.replace(/\n/g, '<br>'))
    } catch (err) {
      console.error('Error generating AI summary:', err)
      setAiSummary("Lo sentimos, ha ocurrido un error al generar el resumen. Por favor, intente de nuevo más tarde.")
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleClear = () => {
    setTrackingId('')
    setShipment(null)
    setError(null)
  }

  const currentStatusIndex = shipment ? STATUS_ORDER.indexOf(shipment.status as any) : -1
  const progress = currentStatusIndex >= 0 ? (currentStatusIndex / (STATUS_ORDER.length - 1)) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoymismo-navy via-hoymismo-dark to-black text-slate-200">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-hoymismo-orange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-hoymismo-gold/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto max-w-7xl p-4 md:p-8 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="text-center my-8 md:my-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image
              src="/images/HoyMismo Logo.png"
              alt="HoyMismo Logo"
              width={80}
              height={80}
              className="animate-float"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Módulo de Seguimiento Inteligente
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Consulta el estado de tu envío en tiempo real y obtén resúmenes con IA.
          </p>
        </header>

        {/* Search Section */}
        <main className="flex-grow">
          <section className="glass-card p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3.5 text-lg text-white bg-slate-900/50 border-2 border-white/10 rounded-xl focus:ring-4 focus:ring-hoymismo-orange/30 focus:border-hoymismo-orange outline-none transition-all duration-300 placeholder:text-slate-500"
                  placeholder="Ingresa tu número de guía..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-hoymismo-orange hover:bg-hoymismo-orange/90 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-102 focus:ring-4 focus:ring-hoymismo-orange/50 disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  <span>{loading ? 'Buscando...' : 'Consultar Envío'}</span>
                </button>
                <button
                  onClick={handleClear}
                  className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <XIcon className="w-5 h-5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="mt-8 glass-card p-6 border-l-4 border-red-500 animate-fade-in">
              <div className="flex items-center gap-4">
                <XIcon className="w-8 h-8 text-red-400" />
                <span className="font-medium text-lg text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-8 space-y-8 animate-pulse">
              <div className="h-40 glass-card"></div>
              <div className="h-64 glass-card"></div>
            </div>
          )}

          {/* Results */}
          {shipment && !loading && (
            <div className="mt-8 space-y-8">
              {/* Overview Card */}
              <section className="glass-card p-6 md:p-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 bg-hoymismo-orange/20 rounded-2xl flex items-center justify-center ring-2 ring-hoymismo-orange/30 flex-shrink-0">
                    {STATUS_CONFIG[shipment.status as keyof typeof STATUS_CONFIG] &&
                      (() => {
                        const Icon = STATUS_CONFIG[shipment.status as keyof typeof STATUS_CONFIG].icon
                        return <Icon className="w-8 h-8 text-hoymismo-orange" />
                      })()
                    }
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-hoymismo-gold">Estatus Actual</p>
                    <h2 className="text-3xl font-bold text-white mt-1">
                      {STATUS_CONFIG[shipment.status as keyof typeof STATUS_CONFIG]?.label || shipment.status}
                    </h2>
                    <p className="text-slate-400 mt-1">ID de Envío: <span className="font-mono">{shipment.shipmentId}</span></p>
                  </div>
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={handleGenerateAISummary}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generar Resumen Ejecutivo
                    </button>
                  </div>
                </div>
              </section>

              {/* Timeline Card */}
              <section className="glass-card p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h3 className="text-xl font-bold text-white mb-8 text-center">Línea de Proceso</h3>
                <div className="relative">
                  <div className="timeline-track"></div>
                  <div className="timeline-progress" style={{width: `${progress}%`}}></div>
                  <div className="flex justify-between">
                    {STATUS_ORDER.map((statusKey, index) => {
                      const config = STATUS_CONFIG[statusKey]
                      let statusClass = ''
                      if (index < currentStatusIndex) statusClass = 'completed'
                      if (index === currentStatusIndex) statusClass = 'active'
                      const Icon = config.icon

                      return (
                        <div key={statusKey} className={`timeline-step relative flex flex-col items-center z-10 ${statusClass}`}>
                          <div className="step-circle w-10 h-10 bg-slate-700/50 border-2 border-slate-600 rounded-full flex items-center justify-center transition-all duration-300">
                            <Icon className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="mt-2 text-xs text-center text-slate-400 font-medium max-w-[80px]">{config.label}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* Details Card */}
              <section className="glass-card p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <h3 className="text-xl font-bold text-white mb-6">Detalles del Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-400 mb-2">Destino</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Ciudad:</span>
                        <span className="font-medium text-slate-200 text-right">{shipment.destination.city}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">País:</span>
                        <span className="font-medium text-slate-200 text-right">{shipment.destination.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-400 mb-2">Paquete</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Peso:</span>
                        <span className="font-medium text-slate-200 text-right">{shipment.weight} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tipo:</span>
                        <span className="font-medium text-slate-200 text-right">{shipment.packageType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-400 mb-2">Envío</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Costo:</span>
                        <span className="font-medium text-slate-200 text-right">${shipment.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tracking:</span>
                        <span className="font-medium text-slate-200 text-right font-mono">{shipment.trackingNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>

        <footer className="text-center text-slate-500 py-8">
          Potenciado por <a href="/" className="font-semibold text-slate-400 hover:text-white transition">HoyMismo Paquetería Internacional</a>
        </footer>
      </div>

      {/* AI Summary Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowAIModal(false)}>
          <div className="glass-card w-full max-w-2xl transform transition-all modal-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center ring-1 ring-indigo-400/30">
                    <Sparkles className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Resumen Ejecutivo por IA</h2>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="py-6 min-h-[150px] flex items-center justify-center">
                {generatingAI ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="gemini-spinner"></div>
                    <p className="mt-4 font-semibold text-slate-200">Analizando información...</p>
                    <p className="text-sm text-slate-400">Nuestra IA está generando un resumen claro y conciso.</p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-200" dangerouslySetInnerHTML={{ __html: aiSummary }}></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
        }
        .timeline-track::before {
          content: '';
          position: absolute;
          top: 1.25rem;
          left: 0;
          right: 0;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }
        .timeline-progress {
          position: absolute;
          top: 1.25rem;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #EA580C, #F59E0B);
          z-index: 1;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .timeline-step.completed .step-circle {
          background-color: #EA580C;
          border-color: #EA580C;
        }
        .timeline-step.completed .step-circle svg {
          color: #fff;
        }
        .timeline-step.active .step-circle {
          background-color: #F59E0B;
          border-color: #F59E0B;
          animation: pulse 2s infinite;
        }
        .timeline-step.active .step-circle svg {
          color: #fff;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
        }
        .gemini-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(167, 139, 250, 0.3);
          border-top-color: #a78bfa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .modal-fade-in {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
