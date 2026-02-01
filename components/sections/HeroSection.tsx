'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Package, Shield, Truck, Globe } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export default function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    { value: 1500, suffix: '+', label: 'Clientes Satisfechos', icon: Package },
    { value: 100, suffix: '%', label: 'Entregas Exitosas', icon: Shield },
    { value: 24, suffix: '/7', label: 'Servicio Continuo', icon: Truck },
    { value: 3, suffix: '+', label: 'Países Conectados', icon: Globe },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-orange/20" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold">
                Conectando Fronteras
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
              <span className="gradient-text">¡Donde envías hoy...</span>
              <br />
              <span className="text-white">Y recibes hoy!</span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Tus envíos a México y Centroamérica,{' '}
              <span className="text-primary-400 font-semibold">
                sin complicaciones
              </span>
              . Rastreo en tiempo real, sin límite de peso, entregas rápidas y
              seguras.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cotizar" className="btn-primary group">
                <span>Cotizar Envío</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#rastreo" className="btn-secondary">Rastrear Paquete</a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-400">Envíos Seguros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-400">Sin Límite de Peso</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <Image
              src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/hoymismo-imagen-social-pNqRHyFDWzMYgEAS.png"
              alt="HoyMismo Paquetería Internacional"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-500/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-primary-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
