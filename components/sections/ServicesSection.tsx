'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Package,
  Scale,
  Globe,
  Shield,
  Clock,
  MapPin,
  Boxes,
  Headphones,
} from 'lucide-react'

export default function ServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const problems = [
    {
      title: 'Límites de Peso Estrictos',
      description: 'Te obligan a dividir envíos o a pagar costos excesivos.',
    },
    {
      title: 'Procesos Confusos',
      description: 'Documentación que genera dudas y temor a errores.',
    },
    {
      title: 'Entregas Inciertas',
      description: 'Falta de visibilidad y fechas de llegada poco fiables.',
    },
    {
      title: 'Rastreo Poco Claro',
      description: 'No saber dónde está tu paquete en cada momento.',
    },
  ]

  const features = [
    {
      icon: Scale,
      title: 'Sin Límite de Peso',
      description:
        'Envía todo lo que necesites en una sola caja. Olvídate de las restricciones.',
    },
    {
      icon: Boxes,
      title: 'Flexibilidad de Empaque',
      description:
        'Diversas opciones de tamaño de caja para que tu envío se adapte perfectamente.',
    },
    {
      icon: Shield,
      title: 'Envío Eficiente y Responsable',
      description:
        'Cada paquete es manejado con la máxima prioridad y cuidado.',
    },
    {
      icon: MapPin,
      title: 'Rastreo en Tiempo Real',
      description:
        'Visibilidad completa de tu paquete en cada etapa del viaje.',
    },
    {
      icon: Globe,
      title: 'Cobertura Amplia',
      description: 'Conectamos EE.UU., México y toda Centroamérica.',
    },
    {
      icon: Clock,
      title: 'Entrega Rápida',
      description:
        'Optimizamos cada ruta para entregas rápidas y confiables.',
    },
    {
      icon: Headphones,
      title: 'Soporte Dedicado',
      description: 'Nuestro equipo está listo para ayudarte en cada paso.',
    },
    {
      icon: Package,
      title: 'Proceso Simplificado',
      description: 'De principio a fin, hacer un envío nunca fue tan fácil.',
    },
  ]

  return (
    <section id="servicios" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-primary-950/10 to-slate-950" />

      <div className="container-custom relative z-10">
        {/* Problem Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 bg-accent-orange/20 border border-accent-orange/30 rounded-full text-accent-orange text-sm font-semibold inline-block mb-6">
            El Problema
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            ¿Enviar un paquete se siente como{' '}
            <span className="gradient-text">una carrera de obstáculos?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="card-gradient p-6 border-l-4 border-red-500/50"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-slate-400">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold inline-block mb-6">
            La Solución
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Diseñado para tu{' '}
            <span className="gradient-text">libertad y confianza</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Una experiencia de paquetería donde la simplicidad, la velocidad y
            tu tranquilidad son el centro de todo lo que hacemos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="card-gradient p-6 hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <feature.icon className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team & Operations Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-16 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/imagen-3-4hGnHIM9rv6xvgmp.png"
              alt="Equipo HoyMismo"
              width={600}
              height={400}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Compromiso con la excelencia</h3>
            <p className="text-lg text-slate-300 mb-6">
              Nuestro equipo trabaja incansablemente para asegurar que cada envío llegue a tiempo y en perfectas condiciones.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-gradient p-4">
                <p className="text-3xl font-bold gradient-text mb-1">24/7</p>
                <p className="text-sm text-slate-400">Atención continua</p>
              </div>
              <div className="card-gradient p-4">
                <p className="text-3xl font-bold gradient-text mb-1">100%</p>
                <p className="text-sm text-slate-400">Satisfacción garantizada</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-block card-gradient p-8">
            <p className="text-5xl font-bold gradient-text mb-2">1500+</p>
            <p className="text-slate-300 font-semibold mb-1">
              CLIENTES SATISFECHOS
            </p>
            <p className="text-sm text-slate-400">
              "Nuestra confianza es el reflejo de la tranquilidad de nuestros
              clientes."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
