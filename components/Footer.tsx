import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="HoyMismo Logo"
                width={50}
                height={50}
              />
              <div>
                <span className="font-display font-bold text-xl gradient-text">
                  HoyMismo
                </span>
                <p className="text-xs text-slate-400">Paquetería</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Tu puente directo entre EE. UU., México y Centroamérica. Envíos
              eficientes y responsables.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#servicios"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/#rastreo"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Rastrear Paquete
                </Link>
              </li>
              <li>
                <Link
                  href="/#cotizar"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Cotizar Envío
                </Link>
              </li>
              <li>
                <Link
                  href="/portal"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Portal Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+1 346-580-1238</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>ventas@hoymismopaqueteria.com</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                <span>Houston, TX - Monterrey, México</span>
              </li>
            </ul>
          </div>

          {/* Social & Stats */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">
              Síguenos
            </h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <div className="card-gradient p-4">
              <p className="text-3xl font-bold gradient-text">1500+</p>
              <p className="text-xs text-slate-400">Clientes Satisfechos</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-sm">
            © {currentYear} HoyMismo Paquetería. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
