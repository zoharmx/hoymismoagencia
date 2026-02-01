'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Package, User } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Rastreo', href: '#rastreo' },
    { name: 'Cotizar', href: '#cotizar' },
    { name: 'Contacto', href: '#contacto' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/images/logo.png"
              alt="HoyMismo Logo"
              width={50}
              height={50}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden md:block">
              <span className="font-display font-bold text-xl gradient-text">
                HoyMismo
              </span>
              <p className="text-xs text-slate-400">Paquetería</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/portal"
              className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Portal</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 btn-primary"
            >
              <Package className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 btn-secondary w-full justify-center"
                >
                  <User className="w-4 h-4" />
                  <span>Portal Clientes</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 btn-primary w-full justify-center"
                >
                  <Package className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
