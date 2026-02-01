import { Metadata } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hoymismopaqueteria.com'),
  title: {
    default: 'HoyMismo Paquetería | Envíos a México y Centroamérica',
    template: '%s | HoyMismo Paquetería'
  },
  description: 'Tus envíos a México y Centroamérica, sin complicaciones. Rastreo en tiempo real, sin límite de peso, entregas rápidas y seguras. Más de 1500 clientes satisfechos.',
  keywords: ['paquetería', 'envíos a México', 'envíos internacionales', 'rastreo de paquetes', 'HoyMismo', 'paquetería USA México', 'envíos Centroamérica', 'courier internacional'],
  authors: [{ name: 'HoyMismo Paquetería' }],
  creator: 'HoyMismo',
  publisher: 'HoyMismo Paquetería',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://hoymismopaqueteria.com',
    title: 'HoyMismo Paquetería | Envíos a México y Centroamérica',
    description: '¡Donde envías hoy... Y recibes hoy! Sin límite de peso, rastreo en tiempo real, +1500 clientes satisfechos.',
    siteName: 'HoyMismo Paquetería',
    images: [
      {
        url: '/HoyMismo Imagen Social.png',
        width: 1200,
        height: 630,
        alt: 'HoyMismo Paquetería - Envíos Internacionales',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoyMismo Paquetería | Envíos a México y Centroamérica',
    description: '¡Donde envías hoy... Y recibes hoy! +1500 clientes satisfechos.',
    images: ['/HoyMismo Imagen Social.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/HoyMismo Favicon.png',
    apple: '/HoyMismo Favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/HoyMismo Favicon.png" />
        <link rel="apple-touch-icon" href="/HoyMismo Favicon.png" />
      </head>
      <body className="font-body antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
