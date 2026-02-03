'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Car,
  FileText,
  Globe,
  Shield,
  Clock,
  MapPin,
  ClipboardCheck,
  Headphones,
} from 'lucide-react'

export default function ServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const problems = [
    {
      title: 'Trámites Complicados',
      description: 'Documentación confusa y requisitos que cambian constantemente.',
    },
    {
      title: 'Riesgo de Fraude',
      description: 'Gestores informales que no garantizan un proceso legal.',
    },
    {
      title: 'Tiempos Indefinidos',
      description: 'Sin visibilidad del estado de tu trámite de importación.',
    },
    {
      title: 'Costos Ocultos',
      description: 'Sorpresas en impuestos, honorarios y gastos adicionales.',
    },
  ]

  const features = [
    {
      icon: Car,
      title: 'Importación de Vehículos',
      description:
        'Importamos tu vehículo de USA a México de forma legal y segura.',
    },
    {
      icon: FileText,
      title: 'Pedimentos de Importación',
      description:
        'Elaboración de pedimentos A1, A2, F4 y todos los tipos requeridos.',
    },
    {
      icon: Shield,
      title: 'Proceso 100% Legal',
      description:
        'Cumplimos con todas las normativas aduaneras y de SENASICA.',
    },
    {
      icon: MapPin,
      title: 'Seguimiento en Tiempo Real',
      description:
        'Visibilidad completa de tu trámite en cada etapa del proceso.',
    },
    {
      icon: Globe,
      title: 'Múltiples Aduanas',
      description: 'Operamos en Nuevo Laredo, Reynosa, Matamoros y más.',
    },
    {
      icon: Clock,
      title: 'Tiempos Optimizados',
      description:
        'Agilizamos tu trámite para que recibas tu vehículo lo antes posible.',
    },
    {
      icon: Headphones,
      title: 'Asesoría Personalizada',
      description: 'Te guiamos en cada paso del proceso de importación.',
    },
    {
      icon: ClipboardCheck,
      title: 'Gestión Documental',
      description: 'Nos encargamos de todos los documentos requeridos.',
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
            ¿Importar un vehículo se siente como{' '}
            <span className="gradient-text">un laberinto burocrático?</span>
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
            <span className="gradient-text">tranquilidad y confianza</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Una agencia aduanal donde la transparencia, la legalidad y
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
              src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/logo-legalizaciones-AR0M55ebNos5VLzR.png"
              alt="HoyMismo Agencia Aduanal"
              width={600}
              height={400}
              className="w-full h-auto bg-slate-800/50 p-8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Compromiso con la excelencia</h3>
            <p className="text-lg text-slate-300 mb-6">
              Nuestro equipo de agentes aduanales certificados trabaja para que tu importación sea un proceso transparente y exitoso.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-gradient p-4">
                <p className="text-3xl font-bold gradient-text mb-1">15+</p>
                <p className="text-sm text-slate-400">Años de experiencia</p>
              </div>
              <div className="card-gradient p-4">
                <p className="text-3xl font-bold gradient-text mb-1">100%</p>
                <p className="text-sm text-slate-400">Trámites exitosos</p>
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
            <p className="text-5xl font-bold gradient-text mb-2">500+</p>
            <p className="text-slate-300 font-semibold mb-1">
              VEHÍCULOS IMPORTADOS
            </p>
            <p className="text-sm text-slate-400">
              "Tu confianza es nuestra prioridad. Cada trámite es manejado con
              total profesionalismo."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
