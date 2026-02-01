# Guía de Inicio Rápido - HoyMismo Paquetería

Esta guía te ayudará a poner en marcha el proyecto en minutos.

## Inicio Rápido (5 minutos)

### 1. Clonar e Instalar
```bash
# Si aún no has clonado el proyecto
git clone <repository-url>
cd HoyMismoDashboard

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus credenciales
# Las API keys ya están incluidas para pruebas
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Estructura de URLs

### Frontend Público
- **Homepage**: `http://localhost:3000`
  - Hero con estadísticas animadas
  - Sección de servicios
  - Rastreo de paquetes
  - Sistema de cotización
  - Formulario de contacto

### Portal de Clientes
- **Login**: `http://localhost:3000/portal`
- **Dashboard**: `http://localhost:3000/portal/dashboard`
  - Mis envíos
  - Facturas
  - Historial
  - Configuración

### Dashboard Principal (Admin)
- **Dashboard**: `http://localhost:3000/dashboard`
  - Vista general y estadísticas
  - Gestión de envíos
  - Gestión de clientes
  - Facturación
  - Reportes
  - Asistente de IA

---

## Características Principales

### 🎨 Diseño Moderno
- Animaciones con Framer Motion
- Partículas flotantes en background
- Gradientes dinámicos
- Responsive en todos los dispositivos
- Dark theme profesional

### 📦 Sistema de Rastreo
- Búsqueda por número de tracking
- Timeline visual del envío
- Mapa de ruta origen-destino
- Estados en tiempo real
- Notificaciones de cambios

### 💰 Cotizador Online
- Formulario intuitivo
- Cálculo instantáneo de precio
- Múltiples opciones de país
- Información de contacto integrada
- Proceso simple de 3 pasos

### 👥 Portal de Clientes
- Login seguro
- Dashboard personalizado
- Historial de envíos
- Gestión de facturas
- Descarga de documentos
- Soporte integrado

### 🎯 Dashboard Administrativo
- Gestión completa de operaciones
- Administración de clientes
- Control de envíos
- Generación de reportes
- Analytics y métricas
- Asistente de IA integrado

### 🤖 Asistente de IA
- Powered by DeepSeek & Mistral
- Respuestas en tiempo real
- Contexto específico de HoyMismo
- Disponible 24/7
- Soporte multilingüe

---

## Navegación Rápida

### Desde el Homepage:
1. **Cotizar Envío** → Scroll a sección de cotización
2. **Rastrear Paquete** → Scroll a sección de rastreo
3. **Portal Clientes** → Click en navbar
4. **Dashboard Admin** → Click en navbar

### Desde el Portal:
- Ver envíos activos
- Descargar facturas
- Actualizar perfil
- Contactar soporte

### Desde el Dashboard:
- Crear nuevo envío
- Registrar cliente
- Generar factura
- Ver reportes
- Chatear con IA

---

## Datos de Prueba

### Credenciales de Login (Portal)
```
Email: demo@hoymismo.com
Password: demo123
```

### Números de Rastreo de Ejemplo
```
HM-2024-10001 - En Tránsito
HM-2024-09998 - Entregado
HM-2024-09995 - Pendiente
```

---

## Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint
```

---

## Personalización Rápida

### Cambiar Colores
Editar `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },  // Color principal
  accent: { ... },   // Colores de acento
}
```

### Cambiar Logo
Reemplazar en `/public`:
- `HoyMismo Logo.png`
- `HoyMismo Favicon.png`
- `HoyMismo Imagen Social.png`

### Cambiar Información de Contacto
Editar `components/Footer.tsx` y `components/sections/CTASection.tsx`

---

## Tips de Desarrollo

### Hot Reload
El servidor detecta cambios automáticamente y recarga el navegador.

### TypeScript
El proyecto usa TypeScript para type safety. Los errores aparecerán en la terminal.

### Estilos
Usa Tailwind CSS para estilos. Clases personalizadas en `globals.css`.

### Componentes
Crea componentes reutilizables en `components/ui/`

### API Routes
Para crear endpoints: `app/api/[nombre]/route.ts`

---

## Próximos Pasos

1. ✅ Ejecutar el proyecto localmente
2. ⬜ Personalizar branding y contenido
3. ⬜ Configurar base de datos (Firebase/Supabase)
4. ⬜ Integrar pasarela de pagos
5. ⬜ Configurar autenticación real
6. ⬜ Conectar con API de tracking real
7. ⬜ Desplegar a producción

---

## Soporte

¿Necesitas ayuda?
- 📧 Email: ventas@hoymismopaqueteria.com
- 📱 Teléfono: +1 346-580-1238

---

## Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)

---

**¡Listo para comenzar! 🚀**
