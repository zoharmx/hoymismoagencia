'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react'
import { searchShipments } from '@/lib/firestore'
import type { Shipment } from '@/types/crm'

export default function TrackingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setTrackingData(null)

    try {
      // Buscar por tracking number o shipment ID
      const results = await searchShipments(trackingNumber)

      if (results.length === 0) {
        setError('No se encontró ningún envío con ese número de rastreo.')
      } else {
        setTrackingData(results[0])
      }
    } catch (err) {
      console.error('Error searching shipment:', err)
      setError('Error al buscar el envío. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="rastreo" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold inline-block mb-6">
            Rastreo en Tiempo Real
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Control total.</span> Visibilidad en
            tiempo real.
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Nuestro sistema de rastreo en línea te da la certeza de saber dónde
            está tu envío en cada etapa del viaje. Sin sorpresas, solo
            información clara y al momento.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Tracking Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <Image
              src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/imagen-4-tTu30dkARYJfQ7I1.png"
              alt="Rastreo en tiempo real HoyMismo"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </motion.div>

          <div className="order-1 lg:order-2">
            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="card-gradient p-8 mb-12"
            >
            <form onSubmit={handleTrack} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ingresa tu número de rastreo o ID de envío"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary disabled:opacity-50" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Rastrear
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </motion.div>

          {/* Tracking Results */}
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="card-gradient p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      ID de Envío
                    </p>
                    <p className="font-mono font-semibold text-white">
                      {trackingData.shipmentId}
                    </p>
                    {trackingData.trackingNumber && (
                      <p className="font-mono text-sm text-slate-400 mt-1">
                        Tracking: {trackingData.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Estado</p>
                    <div className="flex items-center space-x-2">
                      {trackingData.status === 'entregado' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <p className="font-semibold text-green-400 uppercase">
                            {trackingData.status.replace('-', ' ')}
                          </p>
                        </>
                      ) : trackingData.status === 'pendiente' ? (
                        <>
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <p className="font-semibold text-yellow-400 uppercase">
                            {trackingData.status}
                          </p>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-primary-500" />
                          <p className="font-semibold text-primary-400 uppercase">
                            {trackingData.status.replace('-', ' ')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      {trackingData.status === 'entregado' ? 'Entregado el' : 'Entrega Estimada'}
                    </p>
                    <p className="font-semibold text-white">
                      {trackingData.actualDelivery
                        ? trackingData.actualDelivery.toDate().toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : trackingData.estimatedDelivery
                          ? trackingData.estimatedDelivery.toDate().toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Por confirmar'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Route Map */}
              <div className="card-gradient p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <p className="font-semibold text-white text-sm">
                      {trackingData.origin.city}, {trackingData.origin.state}
                    </p>
                    <p className="text-xs text-slate-400">Origen</p>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="relative">
                      <div className={`h-1 rounded-full ${
                        trackingData.status === 'entregado'
                          ? 'bg-gradient-to-r from-primary-500 via-primary-400 to-green-500'
                          : 'bg-gradient-to-r from-primary-500 via-primary-400 to-slate-700'
                      }`} />
                      {trackingData.status !== 'entregado' && trackingData.status !== 'pendiente' && (
                        <Truck className="absolute top-1/2 left-3/4 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 text-primary-400" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <MapPin className={`w-8 h-8 mx-auto mb-2 ${
                      trackingData.status === 'entregado' ? 'text-green-500' : 'text-slate-500'
                    }`} />
                    <p className="font-semibold text-white text-sm">
                      {trackingData.destination.city}, {trackingData.destination.state}
                    </p>
                    <p className="text-xs text-slate-400">Destino</p>
                  </div>
                </div>

                {/* Timeline */}
                {trackingData.trackingHistory && trackingData.trackingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {trackingData.trackingHistory.map((event, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 border-2 border-primary-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-primary-500" />
                          </div>
                        </div>
                        <div className="flex-1 pb-8 border-l-2 border-slate-700 pl-6 ml-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-white">
                                {event.description}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {event.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-400">
                                {event.date.toDate().toLocaleDateString('es-MX')}
                              </p>
                              <p className="text-xs text-slate-500">
                                {event.date.toDate().toLocaleTimeString('es-MX', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      No hay historial de tracking disponible aún
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="card-gradient p-6 border-l-4 border-primary-500">
                <p className="text-slate-300 mb-4">
                  ¿Tienes preguntas sobre tu envío?
                </p>
                <button className="btn-secondary">
                  Contactar Soporte
                </button>
              </div>
            </motion.div>
          )}

            {/* Empty State */}
            {!trackingData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Ingresa tu número de rastreo para ver el estado de tu envío
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
