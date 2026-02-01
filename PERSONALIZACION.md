# Guía de Personalización - HoyMismo Paquetería

Esta guía te ayudará a personalizar la plataforma según tus necesidades específicas.

---

## 1. Branding y Colores

### Cambiar Logo

Reemplaza los archivos en `/public`:

```bash
/public/HoyMismo Logo.png          # Logo principal (150x150px recomendado)
/public/HoyMismo Favicon.png       # Favicon (192x192px o 512x512px)
/public/HoyMismo Imagen Social.png # OG Image (1200x630px)
```

### Cambiar Paleta de Colores

Edita `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    // ... más tonos
    900: '#002766',
  },
  accent: {
    orange: '#ff6b35',  // Cambia estos valores
    green: '#10b981',
    purple: '#a855f7',
  },
}
```

### Cambiar Tipografía

Edita `app/layout.tsx`:

```typescript
import { TuFont1, TuFont2 } from 'next/font/google'

const font1 = TuFont1({
  subsets: ['latin'],
  variable: '--font-display',
})

const font2 = TuFont2({
  subsets: ['latin'],
  variable: '--font-body',
})
```

---

## 2. Contenido y Textos

### Homepage

#### Hero Section
Archivo: `components/sections/HeroSection.tsx`

```typescript
// Cambiar título
<h1>
  <span className="gradient-text">Tu título aquí</span>
  <br />
  <span className="text-white">Subtítulo aquí</span>
</h1>

// Cambiar descripción
<p className="text-xl text-slate-300">
  Tu descripción personalizada...
</p>

// Cambiar estadísticas
const stats = [
  { value: 1500, suffix: '+', label: 'Tu métrica', icon: Package },
  // Agrega más...
]
```

#### Servicios
Archivo: `components/sections/ServicesSection.tsx`

```typescript
const features = [
  {
    icon: TuIcono,
    title: 'Tu Feature',
    description: 'Tu descripción',
  },
  // Agrega más...
]
```

### Footer

Archivo: `components/Footer.tsx`

```typescript
// Cambiar información de contacto
<Phone className="w-4 h-4" />
<span>+1 TU-TELEFONO</span>

<Mail className="w-4 h-4" />
<span>tu@email.com</span>
```

---

## 3. SEO y Meta Tags

### Configuración Global

Archivo: `app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Tu Título SEO',
    template: '%s | Tu Marca'
  },
  description: 'Tu descripción para motores de búsqueda',
  keywords: ['keyword1', 'keyword2', ...],
  openGraph: {
    title: 'Título para redes sociales',
    description: 'Descripción para redes sociales',
    images: ['/tu-imagen-social.png'],
  },
}
```

### Por Página

Crea `metadata` en cada página:

```typescript
export const metadata: Metadata = {
  title: 'Título de la Página',
  description: 'Descripción específica',
}
```

---

## 4. Formularios y Validación

### Cotizador

Archivo: `components/sections/QuoteSection.tsx`

#### Agregar Campos
```typescript
<div>
  <label>Tu Nuevo Campo</label>
  <input
    {...register('nuevocampo', {
      required: 'Este campo es requerido',
    })}
  />
</div>
```

#### Modificar Cálculo de Precio
```typescript
const onSubmit = (data: QuoteFormData) => {
  const baseRate = 10  // Tu tarifa base
  const weightRate = data.weight * 2.5  // Tu tarifa por peso

  // Tu lógica personalizada
  const estimate = (baseRate + weightRate) * tuMultiplicador
  setEstimatedPrice(estimate)
}
```

---

## 5. Dashboard Administrativo

### Agregar Nueva Sección

1. **Agregar al menú**

Archivo: `app/dashboard/page.tsx`

```typescript
const menuItems = [
  // ... items existentes
  { id: 'nuevaseccion', label: 'Nueva Sección', icon: TuIcono },
]
```

2. **Crear contenido**

```typescript
{activeSection === 'nuevaseccion' && (
  <div className="card-gradient p-6">
    <h2>Tu Nueva Sección</h2>
    {/* Tu contenido aquí */}
  </div>
)}
```

### Modificar Estadísticas

```typescript
const stats = [
  {
    label: 'Tu Métrica',
    value: '999',
    change: '+XX%',
    icon: TuIcono,
    color: 'blue',
  },
  // Agrega más...
]
```

---

## 6. Portal de Clientes

### Agregar Nueva Pestaña

Archivo: `app/portal/dashboard/page.tsx`

```typescript
const menuItems = [
  // ... items existentes
  { id: 'nuevatab', label: 'Nueva Tab', icon: TuIcono },
]

// Agregar contenido
{activeTab === 'nuevatab' && (
  <div>
    <h2>Contenido de Nueva Tab</h2>
  </div>
)}
```

---

## 7. Asistente de IA

### Personalizar Contexto

Archivo: `lib/ai-helpers.ts`

```typescript
export const TU_AI_CONTEXT = `
Eres un asistente de [TU EMPRESA].

Información clave:
- [PUNTO 1]
- [PUNTO 2]
- [PUNTO 3]

Debes ayudar con:
- [SERVICIO 1]
- [SERVICIO 2]
`
```

### Cambiar Provider

```typescript
// En tu componente
callAIAssistant(
  userMessage,
  TU_AI_CONTEXT,
  'mistral'  // o 'deepseek'
)
```

---

## 8. Animaciones

### Modificar Velocidad

Archivo: `tailwind.config.js`

```javascript
animation: {
  'float': 'float 6s ease-in-out infinite',  // Cambia 6s
  'glow': 'glow 2s ease-in-out infinite',    // Cambia 2s
}
```

### Desactivar Animaciones

Comenta o elimina:

```typescript
// <motion.div> → <div>
<div>
  {/* contenido sin animación */}
</div>
```

---

## 9. Responsive Breakpoints

### Configurar Breakpoints Personalizados

`tailwind.config.js`:

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
  'tu-breakpoint': '900px',  // Personalizado
}
```

### Uso en Componentes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 tu-breakpoint:grid-cols-4">
```

---

## 10. Integraciones

### Agregar Google Analytics

1. Instalar dependencia:
```bash
npm install @next/third-parties
```

2. Agregar en `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-TU-ID" />
      </body>
    </html>
  )
}
```

### Agregar Crisp Chat

En `app/layout.tsx`:

```typescript
<Script id="crisp-chat">
  {`
    window.$crisp=[];
    window.CRISP_WEBSITE_ID="tu-id-crisp";
  `}
</Script>
<Script src="https://client.crisp.chat/l.js" />
```

---

## 11. Base de Datos

### Conectar Firebase

1. Instalar:
```bash
npm install firebase
```

2. Configurar `lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ... resto de config
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

3. Usar en componentes:
```typescript
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const querySnapshot = await getDocs(collection(db, "envios"))
```

### Conectar Supabase

1. Instalar:
```bash
npm install @supabase/supabase-js
```

2. Configurar `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## 12. Autenticación

### Implementar NextAuth.js

1. Instalar:
```bash
npm install next-auth
```

2. Crear `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

## 13. Pagos

### Integrar Stripe

1. Instalar:
```bash
npm install @stripe/stripe-js stripe
```

2. Crear botón de pago:
```typescript
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

const handlePayment = async () => {
  const stripe = await stripePromise
  // Tu lógica de pago
}
```

---

## 14. Emails

### Configurar Resend

1. Instalar:
```bash
npm install resend
```

2. Crear API route `app/api/send-email/route.ts`:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  await resend.emails.send({
    from: 'onboarding@tudominio.com',
    to: 'cliente@ejemplo.com',
    subject: 'Confirmación de Envío',
    html: '<p>Tu contenido aquí</p>',
  })
}
```

---

## Tips Finales

### 1. Testing Local
Siempre prueba cambios con:
```bash
npm run dev
```

### 2. Build Antes de Deploy
```bash
npm run build
```

### 3. Versionado
Usa Git para rastrear cambios:
```bash
git add .
git commit -m "Descripción del cambio"
```

### 4. Backups
Haz copias de seguridad antes de cambios grandes.

### 5. Documentación
Documenta tus personalizaciones para el futuro.

---

## Soporte

¿Necesitas ayuda con personalizaciones?
- 📧 Email: ventas@hoymismopaqueteria.com
- 📱 Tel: +1 346-580-1238

---

**¡Personaliza con confianza! 🎨**
