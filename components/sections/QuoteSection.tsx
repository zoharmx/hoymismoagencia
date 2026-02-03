'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { Car, MapPin, Calendar, DollarSign, Send } from 'lucide-react'
import { useState } from 'react'

type QuoteFormData = {
  vehicleType: string
  vehicleYear: number
  vehicleBrand: string
  importType: string
  name: string
  email: string
  phone: string
}

export default function QuoteSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<QuoteFormData>()

  const vehicleYear = watch('vehicleYear')
  const importType = watch('importType')

  const onSubmit = (data: QuoteFormData) => {
    // Estimación básica para importación de vehículos
    const baseRate = 500 // Honorarios base
    const yearMultiplier = data.vehicleYear >= 2020 ? 1.2 : data.vehicleYear >= 2015 ? 1.0 : 0.8
    const typeMultiplier = data.importType === 'definitiva' ? 1.0 : data.importType === 'temporal' ? 0.7 : 0.5

    const estimate = baseRate * yearMultiplier * typeMultiplier
    setEstimatedPrice(estimate)

    console.log('Quote request:', data)
  }

  return (
    <section id="cotizar" className="section-padding relative overflow-hidden bg-slate-900/50">
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold inline-block mb-6">
            Cotización de Importación
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Obtén tu <span className="gradient-text">cotización</span> de importación
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Proceso transparente. Te decimos exactamente cuánto costará importar tu vehículo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="card-gradient p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Tipo de Vehículo
                </label>
                <select
                  {...register('vehicleType', {
                    required: 'Selecciona el tipo de vehículo',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="sedan">Sedán / Compacto</option>
                  <option value="suv">SUV / Camioneta</option>
                  <option value="pickup">Pickup / Truck</option>
                  <option value="motorcycle">Motocicleta</option>
                  <option value="other">Otro</option>
                </select>
                {errors.vehicleType && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.vehicleType.message}
                  </p>
                )}
              </div>

              {/* Vehicle Year */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Año del Vehículo
                </label>
                <input
                  type="number"
                  {...register('vehicleYear', {
                    required: 'Ingresa el año del vehículo',
                    min: { value: 1990, message: 'Año mínimo: 1990' },
                    max: { value: 2026, message: 'Año máximo: 2026' },
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Ej: 2020"
                />
                {errors.vehicleYear && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.vehicleYear.message}
                  </p>
                )}
              </div>

              {/* Vehicle Brand */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Marca del Vehículo
                </label>
                <input
                  type="text"
                  {...register('vehicleBrand', {
                    required: 'Ingresa la marca del vehículo',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Ej: Toyota, Ford, Chevrolet"
                />
                {errors.vehicleBrand && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.vehicleBrand.message}
                  </p>
                )}
              </div>

              {/* Import Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Tipo de Pedimento
                </label>
                <select
                  {...register('importType', {
                    required: 'Selecciona el tipo de importación',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="definitiva">A1 - Importación Definitiva</option>
                  <option value="temporal">A2 - Importación Temporal</option>
                  <option value="retorno">F4 - Retorno de Vehículo</option>
                </select>
                {errors.importType && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.importType.message}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Información de Contacto
                </h3>

                {/* Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    {...register('name', { required: 'Ingresa tu nombre' })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Nombre Completo"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Ingresa tu correo',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo inválido',
                      },
                    })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Ingresa tu teléfono' })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="+1 (123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full group">
                <Send className="w-5 h-5 mr-2" />
                Cotizar Importación
              </button>
            </form>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Estimated Price */}
            {estimatedPrice !== null && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-gradient p-8 text-center"
              >
                <DollarSign className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Honorarios Estimados</p>
                <p className="text-5xl font-bold gradient-text">
                  ${estimatedPrice.toFixed(2)} USD
                </p>
                <p className="text-sm text-slate-400 mt-4">
                  *No incluye impuestos de importación. Cotización sujeta a validación.
                </p>
              </motion.div>
            )}

            {/* Process Steps */}
            <div className="card-gradient p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Proceso de Importación
              </h3>
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Contacto y Cotización',
                    desc: 'Evaluamos tu vehículo y te damos una cotización detallada.',
                  },
                  {
                    step: '2',
                    title: 'Documentación',
                    desc: 'Recopilamos y validamos todos los documentos necesarios.',
                  },
                  {
                    step: '3',
                    title: 'Trámite Aduanal',
                    desc: 'Procesamos el pedimento y liberamos tu vehículo en aduana.',
                  },
                  {
                    step: '4',
                    title: 'Entrega',
                    desc: 'Recibes tu vehículo nacionalizado y listo para circular.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-400 font-bold">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="card-gradient p-8 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-white mb-4">
                ¿Prefieres hablar con un agente aduanal?
              </h3>
              <p className="text-slate-300 mb-6">
                Nuestro equipo de expertos está listo para asesorarte en tu
                proceso de importación.
              </p>
              <a
                href="tel:+13465801238"
                className="btn-primary w-full block text-center"
              >
                Llamar Ahora: +1 346-580-1238
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
