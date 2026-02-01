# HoyMismo Paquetería - Plataforma Integral

Plataforma tecnológica de última generación para HoyMismo Paquetería. Sistema completo que incluye:
- Frontend público
- Portal de clientes
- Dashboard administrativo
- Asistente de IA integrado

## Características

### Frontend Público
- Hero section con animaciones y partículas flotantes
- Sistema de cotización online
- Rastreo de paquetes en tiempo real
- Secciones informativas sobre servicios
- Formulario de contacto
- Diseño responsive y moderno

### Portal de Clientes
- Sistema de autenticación seguro
- Dashboard personalizado
- Rastreo de envíos en tiempo real
- Historial completo de envíos
- Gestión de facturas y documentos
- Descarga de comprobantes

### Dashboard Principal (Admin)
- Gestión completa de envíos
- Administración de clientes
- Facturación y reportes
- Analytics y métricas
- Asistente de IA integrado (DeepSeek/Mistral)
- Acciones rápidas y búsqueda avanzada

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form
- **Iconos**: Lucide React
- **IA**: DeepSeek API, Mistral AI
- **Deployment**: Vercel / Firebase

## 🔥 Sistema CRM Integrado

El dashboard incluye un **sistema CRM completo** con Firebase Firestore:

### Características del CRM
- ✅ **Gestión de Clientes**: Individual y empresas con direcciones completas
- ✅ **Gestión de Envíos**: Tracking en tiempo real, historial de eventos
- ✅ **Facturación**: Sistema completo de facturas y pagos
- ✅ **Actividades CRM**: Llamadas, emails, reuniones, notas y seguimientos
- ✅ **Estadísticas**: Dashboard con métricas en tiempo real
- ✅ **IDs Personalizados**: CLT-XXXXXX, HM-YYYY-XXXXX, INV-YYYY-XXXXX

### 🚀 Quick Start - CRM

```bash
# 1. Configurar Firebase (ya está configurado con tus credenciales)
npm run dev

# 2. Ir a la página de setup
http://localhost:3000/admin/setup

# 3. Ejecutar test de conexión y seed de datos
# (Usa los botones en la página de setup)
```

### 📚 Documentación del CRM

- **[CRM_QUICKSTART.md](CRM_QUICKSTART.md)** - ⚡ Guía rápida (5 minutos)
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - 🔧 Configuración detallada
- **[CRM_IMPLEMENTATION.md](CRM_IMPLEMENTATION.md)** - 📖 Documentación técnica
- **[DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md)** - 🚀 Despliegue
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - ✅ Estado de la configuración

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd HoyMismoDashboard
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Editar `.env.local` con tus credenciales de API.

4. Ejecutar en desarrollo:
```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
HoyMismoDashboard/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Homepage pública
│   ├── portal/              # Portal de clientes
│   │   ├── page.tsx         # Login
│   │   └── dashboard/       # Dashboard de cliente
│   └── dashboard/           # Dashboard administrativo
├── components/
│   ├── Navigation.tsx       # Barra de navegación
│   ├── Footer.tsx           # Footer
│   ├── sections/            # Secciones de la página
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── TrackingSection.tsx
│   │   ├── QuoteSection.tsx
│   │   └── CTASection.tsx
│   └── ui/                  # Componentes UI reutilizables
├── public/                  # Assets estáticos
├── lib/                     # Utilidades y helpers
└── types/                   # Definiciones TypeScript
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm start` - Servidor de producción
- `npm run lint` - Linter

## Deployment

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Firebase

1. Configurar Firebase Hosting:
```bash
firebase init hosting
```

2. Build y deploy:
```bash
npm run build
firebase deploy
```

## Configuración de APIs

### DeepSeek API
- Clave API: Configurar en `.env.local`
- Documentación: [DeepSeek Docs](https://deepseek.com)

### Mistral AI
- Clave API: Configurar en `.env.local`
- Documentación: [Mistral Docs](https://mistral.ai)

## Características Destacadas

### Animaciones
- Partículas flotantes en background
- Transiciones suaves con Framer Motion
- Efectos parallax
- CountUp para números

### Responsive Design
- Mobile-first approach
- Breakpoints optimizados
- Menú hamburguesa en móvil
- Tablas responsivas

### SEO Optimizado
- Meta tags completos
- Open Graph
- Twitter Cards
- Sitemap automático

## Información de Contacto

**HoyMismo Paquetería**
- Teléfono: +1 346-580-1238
- Email: ventas@hoymismopaqueteria.com
- Web: hoymismopaqueteria.com

## Licencia

© 2024 HoyMismo Paquetería. Todos los derechos reservados.

---

Desarrollado con Next.js, TypeScript y Tailwind CSS
