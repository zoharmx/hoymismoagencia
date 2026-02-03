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
  metadataBase: new URL('https://hoymismoagencia.com'),
  title: {
    default: 'HoyMismo Agencia Aduanal | Importación de Vehículos USA-México',
    template: '%s | HoyMismo Agencia Aduanal'
  },
  description: 'Agencia aduanal especializada en importación de vehículos de USA a México. Trámites de legalización, pedimentos, gestión documental y seguimiento en tiempo real. Servicio profesional y confiable.',
  keywords: ['agencia aduanal', 'importación de vehículos', 'legalización de autos', 'pedimento de importación', 'importar carro USA México', 'agente aduanal', 'trámites aduaneros', 'legalizar vehículo americano', 'HoyMismo'],
  authors: [{ name: 'HoyMismo Agencia Aduanal' }],
  creator: 'HoyMismo',
  publisher: 'HoyMismo Agencia Aduanal',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://hoymismoagencia.com',
    title: 'HoyMismo Agencia Aduanal | Importación de Vehículos',
    description: 'Importa tu vehículo de USA a México de forma legal y segura. Expertos en trámites aduaneros, pedimentos y legalización de vehículos americanos.',
    siteName: 'HoyMismo Agencia Aduanal',
    images: [
      {
        url: '/images/HoyMismo Imagen Social.png',
        width: 1200,
        height: 630,
        alt: 'HoyMismo Agencia Aduanal - Importación de Vehículos',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoyMismo Agencia Aduanal | Importación de Vehículos',
    description: 'Importa tu vehículo de USA a México de forma legal y segura. Expertos en trámites aduaneros.',
    images: ['/images/HoyMismo Imagen Social.png'],
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
    icon: '/images/logo.png',
    apple: '/images/logo.png',
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
        <link rel="icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className="font-body antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
