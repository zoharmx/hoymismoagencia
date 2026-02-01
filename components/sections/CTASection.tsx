'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react'

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="contacto" className="section-padding relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-slate-950 to-accent-orange/20" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
            Empecemos a construir{' '}
            <span className="gradient-text">tu puente</span>
          </h2>
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
            ¿Listo para conectar tu mundo?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Call to Sales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="card-gradient p-8 hover:scale-105 transition-transform duration-300 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Hablar con Ventas
            </h3>
            <p className="text-slate-400 mb-6">
              Nuestro equipo de expertos está listo para ayudarte
            </p>
            <a
              href="tel:+13465801238"
              className="btn-primary w-full group inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              +1 346-580-1238
            </a>
          </motion.div>

          {/* Track Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="card-gradient p-8 hover:scale-105 transition-transform duration-300 text-center border-2 border-primary-500/50"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Rastrear Paquete
            </h3>
            <p className="text-slate-400 mb-6">
              Consulta el estado de tu envío en tiempo real
            </p>
            <a
              href="#rastreo"
              className="btn-primary w-full group inline-flex items-center justify-center"
            >
              Rastrear Ahora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Email Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="card-gradient p-8 hover:scale-105 transition-transform duration-300 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Correo Electrónico
            </h3>
            <p className="text-slate-400 mb-6">
              Envíanos un mensaje y te responderemos pronto
            </p>
            <a
              href="mailto:ventas@hoymismopaqueteria.com"
              className="btn-secondary w-full inline-block"
            >
              ventas@hoymismopaqueteria.com
            </a>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="card-gradient p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Tienes una pregunta?
            </h3>
            <p className="text-slate-300 mb-6">
              Nuestro equipo de servicio al cliente está disponible para
              ayudarte con cualquier consulta sobre envíos, rastreo, o
              cotizaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#cotizar" className="btn-primary">
                Obtener Cotización
              </a>
              <a href="/portal" className="btn-secondary">
                Acceder al Portal
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
