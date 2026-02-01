'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { Package, MapPin, Weight, DollarSign, Send } from 'lucide-react'
import { useState } from 'react'

type QuoteFormData = {
  fromCountry: string
  toCountry: string
  weight: number
  packageType: string
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

  const weight = watch('weight')
  const toCountry = watch('toCountry')

  const onSubmit = (data: QuoteFormData) => {
    const baseRate = 10
    const weightRate = data.weight * 2.5
    const countryMultiplier =
      data.toCountry === 'mexico' ? 1 : data.toCountry === 'guatemala' ? 1.2 : 1.3

    const estimate = (baseRate + weightRate) * countryMultiplier
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
            Cotización Instantánea
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Obtén tu <span className="gradient-text">cotización</span> al
            instante
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Proceso simple y transparente. Sin sorpresas, sin costos ocultos.
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
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  País de Origen
                </label>
                <select
                  {...register('fromCountry', {
                    required: 'Selecciona el país de origen',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona un país</option>
                  <option value="usa">Estados Unidos</option>
                  <option value="canada">Canadá</option>
                </select>
                {errors.fromCountry && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.fromCountry.message}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  País de Destino
                </label>
                <select
                  {...register('toCountry', {
                    required: 'Selecciona el país de destino',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona un país</option>
                  <option value="mexico">México</option>
                  <option value="guatemala">Guatemala</option>
                  <option value="elsalvador">El Salvador</option>
                  <option value="honduras">Honduras</option>
                  <option value="nicaragua">Nicaragua</option>
                  <option value="costarica">Costa Rica</option>
                </select>
                {errors.toCountry && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.toCountry.message}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Weight className="w-4 h-4 inline mr-2" />
                  Peso Aproximado (lbs)
                </label>
                <input
                  type="number"
                  {...register('weight', {
                    required: 'Ingresa el peso',
                    min: { value: 1, message: 'El peso mínimo es 1 lb' },
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Ej: 25"
                />
                {errors.weight && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              {/* Package Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Tipo de Paquete
                </label>
                <select
                  {...register('packageType', {
                    required: 'Selecciona el tipo de paquete',
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="documents">Documentos</option>
                  <option value="personal">Efectos Personales</option>
                  <option value="commercial">Mercancía Comercial</option>
                  <option value="electronics">Electrónicos</option>
                </select>
                {errors.packageType && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.packageType.message}
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
                Obtener Cotización
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
                <p className="text-slate-400 mb-2">Precio Estimado</p>
                <p className="text-5xl font-bold gradient-text">
                  ${estimatedPrice.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400 mt-4">
                  *Precio aproximado sujeto a confirmación
                </p>
              </motion.div>
            )}

            {/* Process Steps */}
            <div className="card-gradient p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Proceso Simple
              </h3>
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Habla con Nosotros',
                    desc: 'Contáctanos para cotizar tu envío y resolver todas tus dudas.',
                  },
                  {
                    step: '2',
                    title: 'Prepara tu Envío',
                    desc: 'Te guiamos en cómo empacar tus artículos.',
                  },
                  {
                    step: '3',
                    title: 'Rastrea con Tranquilidad',
                    desc: 'Sigue tu paquete en tiempo real hasta que llegue.',
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
                ¿Prefieres hablar con un experto?
              </h3>
              <p className="text-slate-300 mb-6">
                Nuestro equipo está listo para ayudarte con una cotización
                personalizada.
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
