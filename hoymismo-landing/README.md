# 🚀 HoyMismo - Landing Page Profesional

## Descripción

Landing page moderna y profesional desarrollada con **Next.js 14**, **TypeScript** y **Tailwind CSS** para HoyMismo - Paquetería y Agencia Internacional.

### ✨ Características Principales

- **Next.js 14** con App Router
- **TypeScript** para desarrollo type-safe
- **Tailwind CSS** para estilos modernos
- **Diseño Responsivo** - Perfecto en mobile, tablet y desktop
- **Animaciones Fluidas** - Experiencia de usuario premium
- **SEO Optimizado** - Meta tags y Open Graph configurados
- **Imágenes Optimizadas** - Next.js Image component
- **Rendimiento Excepcional** - Lazy loading y optimizaciones

### 🎨 Secciones Incluidas

1. **Navegación Fija** con efecto de scroll
2. **Hero Section** impactante con imagen principal
3. **Estadísticas** en tiempo real
4. **Servicios** (4 servicios destacados)
5. **Cobertura de Países** (6 países latinoamericanos)
6. **Formulario de Contacto** funcional
7. **Footer** profesional

## 📦 Instalación

### Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn

### Pasos de Instalación

1. **Navegar al directorio del proyecto:**
```bash
cd hoymismo-landing
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar código
npm run lint
```

## 🎨 Paleta de Colores Corporativos

```css
--hoymismo-orange: #EA580C (Naranja principal)
--hoymismo-gold: #F59E0B (Dorado/Amarillo)
--hoymismo-navy: #0F172A (Azul marino oscuro)
--hoymismo-dark: #1E293B (Azul oscuro secundario)
```

## 📁 Estructura del Proyecto

```
hoymismo-landing/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── public/
│   └── images/
│       ├── HoyMismo_Favicon.png
│       └── HoyMismo_Imagen_Social.png
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎯 Personalización

### Modificar Colores

Edita `tailwind.config.ts`:

```typescript
colors: {
  'hoymismo-orange': '#TU_COLOR',
  'hoymismo-gold': '#TU_COLOR',
  // ...
}
```

### Agregar Países

Edita el array `paises` en `app/page.tsx`:

```typescript
const paises = [
  { nombre: "Nuevo País", flag: "🇽🇽", codigo: "XX" },
  // ...
];
```

### Modificar Servicios

Edita el array `servicios` en `app/page.tsx`:

```typescript
const servicios = [
  {
    titulo: "Tu Servicio",
    descripcion: "Descripción detallada",
    icono: "🎯"
  },
  // ...
];
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Otras Plataformas

El proyecto es compatible con:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps

## 📱 Características Responsive

- **Mobile First:** Diseñado primero para dispositivos móviles
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## ⚡ Optimizaciones de Rendimiento

- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automático con Next.js
- **CSS Optimization:** Tailwind CSS purging
- **Lazy Loading:** Componentes y imágenes
- **Font Optimization:** Google Fonts optimizados

## 🎭 Animaciones

Animaciones CSS personalizadas incluidas:

- `float` - Flotación suave
- `pulse-glow` - Pulsación con brillo
- `slide-in-left` - Entrada desde izquierda
- `slide-in-right` - Entrada desde derecha
- `fade-in-up` - Aparición con elevación

## 📝 Tipografías

- **Display:** Bebas Neue (Títulos grandes)
- **Body:** Outfit (Texto general)

Ambas cargadas desde Google Fonts con optimización automática.

## 🌐 Navegación

El sitio incluye navegación smooth scroll a:
- `#servicios` - Sección de servicios
- `#paises` - Sección de cobertura
- `#contacto` - Formulario de contacto

## 🔧 Configuración Avanzada

### Variables de Entorno (Opcional)

Crea `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.hoymismo.com
NEXT_PUBLIC_CONTACT_EMAIL=contacto@hoymismo.com
```

### Integración con Backend

El formulario de contacto está listo para conectarse a un API:

```typescript
// En app/page.tsx, dentro del form onSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  // Manejar respuesta
};
```

## 📞 Soporte

Para preguntas o soporte:
- Email: contacto@hoymismo.com
- WhatsApp: +52 (81) 1234-5678

## 📄 Licencia

© 2025 HoyMismo. Todos los derechos reservados.

---

**Desarrollado con ❤️ para HoyMismo - Paquetería Internacional**
