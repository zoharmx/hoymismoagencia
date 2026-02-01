'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paises = [
    { nombre: "México", flag: "🇲🇽", codigo: "MX" },
    { nombre: "Guatemala", flag: "🇬🇹", codigo: "GT" },
    { nombre: "Honduras", flag: "🇭🇳", codigo: "HN" },
    { nombre: "El Salvador", flag: "🇸🇻", codigo: "SV" },
    { nombre: "Nicaragua", flag: "🇳🇮", codigo: "NI" },
    { nombre: "Venezuela", flag: "🇻🇪", codigo: "VE" },
  ];

  const servicios = [
    {
      titulo: "Envíos Aéreos Express",
      descripcion: "Llegada garantizada en 3-5 días hábiles a cualquier destino en Latinoamérica",
      icono: "✈️"
    },
    {
      titulo: "Seguimiento en Tiempo Real",
      descripcion: "Monitorea tu paquete 24/7 desde que sale de USA hasta tu puerta",
      icono: "📍"
    },
    {
      titulo: "Seguro de Mercancía",
      descripcion: "Protección completa del valor declarado de tu envío",
      icono: "🛡️"
    },
    {
      titulo: "Asistencia Aduanal",
      descripcion: "Gestión profesional de todos los trámites de importación",
      icono: "📋"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-hoymismo-navy/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Image 
                src="/images/HoyMismo_Favicon.png" 
                alt="HoyMismo Logo" 
                width={60} 
                height={60}
                className="animate-float"
              />
              <div>
                <h1 className="text-2xl font-display text-white tracking-wider">HoyMismo</h1>
                <p className="text-xs text-hoymismo-gold uppercase tracking-widest">Envíos Internacionales</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#servicios" className="text-white hover:text-hoymismo-gold transition-colors font-medium">Servicios</a>
              <a href="#paises" className="text-white hover:text-hoymismo-gold transition-colors font-medium">Cobertura</a>
              <a href="#contacto" className="text-white hover:text-hoymismo-gold transition-colors font-medium">Contacto</a>
            </div>
            <button className="btn-hoymismo hidden md:block">
              Cotizar Envío
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-hoymismo-navy via-hoymismo-dark to-black opacity-40 z-10"></div>
          <Image 
            src="/images/HoyMismo_Imagen_Social.png"
            alt="HoyMismo Team"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-hoymismo-orange/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-hoymismo-gold/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-display gradient-text mb-6 leading-none">
              PAQUETERÍA
            </h2>
            <h3 className="text-6xl md:text-7xl lg:text-8xl font-display text-white mb-8 leading-none">
              INTERNACIONAL
            </h3>
            <p className="text-2xl md:text-3xl text-white font-bold mb-4 bg-hoymismo-orange px-8 py-3 inline-block rounded-full">
              DESDE U.S.A. A MÉXICO Y TODA LATINOAMÉRICA
            </p>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Envíos rápidos, seguros y confiables para tu negocio y familia
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="btn-hoymismo text-lg px-10 py-4">
                📦 Enviar Ahora
              </button>
              <button className="text-white border-2 border-white hover:bg-white hover:text-hoymismo-navy transition-all px-10 py-4 rounded-full font-bold text-lg">
                📞 Hablar con un Asesor
              </button>
            </div>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-5xl font-display gradient-text">7+</p>
              <p className="text-gray-300 mt-2">Años de Experiencia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-5xl font-display gradient-text">6</p>
              <p className="text-gray-300 mt-2">Países Atendidos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-5xl font-display gradient-text">24/7</p>
              <p className="text-gray-300 mt-2">Seguimiento</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-5xl font-display gradient-text">100%</p>
              <p className="text-gray-300 mt-2">Confiable</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicios" className="py-24 bg-gradient-to-b from-hoymismo-dark to-hoymismo-navy relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-display gradient-text mb-6">
              NUESTROS SERVICIOS
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Soluciones completas de paquetería internacional diseñadas para tu tranquilidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicios.map((servicio, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-hoymismo-orange transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-hoymismo-orange/20"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {servicio.icono}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {servicio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES SECTION */}
      <section id="paises" className="py-24 bg-hoymismo-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hoymismo-orange to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-display gradient-text mb-6">
              COBERTURA REGIONAL
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Presencia en los principales países de Centroamérica y Latinoamérica
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paises.map((pais, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-hoymismo-gold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-hoymismo-gold/30 cursor-pointer text-center"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                  {pais.flag}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {pais.nombre}
                </h3>
                <p className="text-sm text-hoymismo-gold font-mono">
                  {pais.codigo}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-2xl text-white font-bold mb-6">
              ¿Tu país no está en la lista?
            </p>
            <button className="btn-hoymismo">
              Consultar Disponibilidad
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hoymismo-gold to-transparent"></div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacto" className="py-24 bg-gradient-to-b from-hoymismo-dark to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl md:text-7xl font-display gradient-text mb-6">
                CONTÁCTANOS
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Estamos listos para atender tus envíos internacionales. Nuestro equipo de expertos te brindará una cotización personalizada en minutos.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-14 h-14 bg-hoymismo-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">WhatsApp / Teléfono</p>
                    <p className="text-xl font-bold text-white">+52 (81) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-14 h-14 bg-hoymismo-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-xl font-bold text-white">contacto@hoymismo.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-14 h-14 bg-hoymismo-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Ubicación</p>
                    <p className="text-xl font-bold text-white">Apodaca, Nuevo León, México</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">Solicitar Cotización</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-hoymismo-orange transition-colors"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-hoymismo-orange transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-hoymismo-orange transition-colors"
                    placeholder="+52 811234567"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">País Destino</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-hoymismo-orange transition-colors">
                    <option value="">Seleccionar país</option>
                    {paises.map((pais) => (
                      <option key={pais.codigo} value={pais.codigo} className="bg-hoymismo-navy">
                        {pais.flag} {pais.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Detalles del Envío</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-hoymismo-orange transition-colors resize-none"
                    placeholder="Descripción del paquete, peso aproximado, dimensiones..."
                  ></textarea>
                </div>
                <button type="submit" className="btn-hoymismo w-full">
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Image 
                src="/images/HoyMismo_Favicon.png" 
                alt="HoyMismo Logo" 
                width={50} 
                height={50}
              />
              <div>
                <h4 className="text-xl font-display text-white">HoyMismo</h4>
                <p className="text-xs text-gray-400">Envíos Internacionales</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © 2025 HoyMismo. Todos los derechos reservados.
              </p>
              <p className="text-sm text-gray-500">
                Paquetería y Agencia Internacional
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
