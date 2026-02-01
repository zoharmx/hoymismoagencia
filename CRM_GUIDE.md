# Guía Completa del CRM HoyMismo Dashboard

## Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Secciones del Dashboard](#secciones-del-dashboard)
3. [Gestión de Usuarios](#gestión-de-usuarios)
4. [Configuración del Sistema](#configuración-del-sistema)
5. [API y Funciones Disponibles](#api-y-funciones-disponibles)

---

## Configuración Inicial

### 1. Variables de Entorno

Asegúrate de que tu archivo `.env.local` contenga las credenciales de Firebase:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 2. Poblar Datos de Prueba

Para poblar la base de datos con datos de ejemplo, ejecuta:

```bash
# Opción 1: Desde la terminal
curl -X POST http://localhost:3000/api/seed

# Opción 2: Desde el navegador
# Navega a http://localhost:3000/api/seed y haz una petición POST
```

Esto creará:
- **Configuraciones del sistema** (empresa y sistema)
- **3 usuarios de ejemplo** (admin, manager, operator)
- **3 clientes de ejemplo**
- **4 envíos de ejemplo**
- **3 facturas de ejemplo**
- **4 actividades CRM de ejemplo**

---

## Secciones del Dashboard

### 📊 Dashboard (Overview)
**Ruta:** `/dashboard`

**Funcionalidades:**
- Vista general con estadísticas en tiempo real
- Tarjetas de métricas clave:
  - Envíos Activos
  - Ingresos del Mes
  - Clientes Activos
  - Pendientes
- Lista de envíos recientes
- Acciones rápidas para crear clientes, envíos y facturas

---

### 📦 Envíos
**Acceso:** Menú lateral > Envíos

**Funcionalidades:**
- ✅ Ver todos los envíos con filtros
- ✅ Buscar por ID, tracking number o cliente
- ✅ Crear nuevos envíos
- ✅ Ver detalles completos incluyendo:
  - Origen y destino
  - Estado actual (pendiente, en-tránsito, en-aduana, etc.)
  - Costos y tracking
  - Historial de eventos
- ✅ Editar y eliminar envíos
- ✅ Estados disponibles:
  - `pendiente`
  - `en-transito`
  - `en-aduana`
  - `en-distribucion`
  - `entregado`
  - `cancelado`
  - `devuelto`

**Crear un Envío:**
1. Click en "Nuevo" o "Nuevo Envío"
2. Seleccionar cliente
3. Ingresar direcciones de origen y destino
4. Especificar detalles del paquete (peso, tipo, descripción)
5. Ingresar costos (envío, seguro, adicionales)
6. Guardar

---

### 👥 Clientes
**Acceso:** Menú lateral > Clientes

**Funcionalidades:**
- ✅ Ver todos los clientes activos
- ✅ Buscar por nombre, email o ID
- ✅ Crear nuevos clientes (individuales o empresas)
- ✅ Ver historial de envíos y gastos totales
- ✅ Información completa:
  - Datos de contacto
  - Dirección
  - RFC (para empresas)
  - Etiquetas personalizadas
  - Total de envíos y gastos

**Tipos de Cliente:**
- **Individual:** Personas físicas
- **Empresa:** Personas morales con RFC

---

### 💰 Facturación
**Acceso:** Menú lateral > Facturación

**Funcionalidades:**
- ✅ Ver todas las facturas
- ✅ Filtrar por estado (pendiente, pagada, vencida, cancelada)
- ✅ Crear nuevas facturas
- ✅ Vincular facturas a envíos
- ✅ Marcar como pagada
- ✅ Ver fechas de vencimiento y pago
- ✅ Descargar facturas (próximamente)

**Estados de Factura:**
- `pendiente`: Factura creada, pago pendiente
- `pagada`: Pago recibido
- `vencida`: Fecha de vencimiento pasada sin pago
- `cancelada`: Factura anulada

---

### 👤 Usuarios
**Acceso:** Menú lateral > Usuarios

**Funcionalidades:**
- ✅ Ver todos los usuarios del sistema
- ✅ Crear nuevos usuarios
- ✅ Editar información de usuarios
- ✅ Desactivar usuarios
- ✅ Asignar roles y permisos

**Roles Disponibles:**

1. **Visualizador (`viewer`)**
   - Solo puede ver datos
   - No puede editar ni crear

2. **Operador (`operator`)**
   - Puede crear y editar envíos
   - Puede gestionar clientes
   - No puede acceder a configuración

3. **Manager (`manager`)**
   - Acceso completo a clientes, envíos y facturas
   - Puede ver reportes
   - No puede gestionar usuarios ni configuración

4. **Administrador (`admin`)**
   - Acceso completo a todo el sistema
   - Puede gestionar usuarios
   - Puede modificar configuración

**Crear un Usuario:**
1. Click en "Nuevo Usuario"
2. Ingresar datos básicos (nombre, email, teléfono)
3. Seleccionar rol
4. Asignar departamento (opcional)
5. Guardar

---

### ⚙️ Configuración
**Acceso:** Menú lateral > Configuración

Esta sección tiene dos pestañas principales:

#### 🏢 Configuración de Empresa

**Campos configurables:**
- Nombre de la empresa
- Razón social
- RFC
- Teléfono y email de contacto
- Sitio web
- **Tasa de impuesto** (IVA por defecto)
- **Moneda** (MXN, USD, EUR)
- **Zona horaria**
- **Idioma** (Español, English)

**Guardar cambios:**
Haz clic en "Guardar Cambios" al finalizar.

#### 🔧 Configuración del Sistema

**Secciones:**

1. **Notificaciones**
   - Email: Activar/desactivar notificaciones por correo
   - SMS: Activar/desactivar alertas por mensaje de texto

2. **Automatización**
   - Facturación automática al completar envíos
   - Alertas de stock bajo

3. **Prefijos de Identificadores**
   - **Facturas:** `INV` → Genera IDs como `INV-2024-00123`
   - **Envíos:** `HM` → Genera IDs como `HM-2024-10045`
   - **Clientes:** `CLT` → Genera IDs como `CLT-001234`

4. **Zona de Peligro**
   - **Modo Mantenimiento:** Desactiva el sistema temporalmente

---

## Gestión de Usuarios

### Crear un Nuevo Usuario

```typescript
import { createUser } from '@/lib/firestore'

await createUser({
  uid: 'firebase-auth-uid', // Del sistema de autenticación
  email: 'usuario@ejemplo.com',
  displayName: 'Juan Pérez',
  role: 'operator', // admin | manager | operator | viewer
  phone: '+1 (346) 555-0123',
  department: 'Logística',
  isActive: true,
})
```

### Actualizar un Usuario

```typescript
import { updateUser } from '@/lib/firestore'

await updateUser('user-id', {
  displayName: 'Nuevo Nombre',
  role: 'manager',
  department: 'Operaciones',
})
```

### Desactivar un Usuario

```typescript
import { deactivateUser } from '@/lib/firestore'

await deactivateUser('user-id')
```

---

## Configuración del Sistema

### Obtener Configuración Actual

```typescript
import { getCompanySettings, getSystemSettings } from '@/lib/firestore'

// Configuración de empresa
const companySettings = await getCompanySettings()

// Configuración del sistema
const systemSettings = await getSystemSettings()
```

### Actualizar Configuración de Empresa

```typescript
import { saveCompanySettings } from '@/lib/firestore'

await saveCompanySettings({
  companyName: 'Mi Empresa',
  phone: '+1 234 567 8900',
  email: 'info@miempresa.com',
  taxRate: 16,
  currency: 'MXN',
  timezone: 'America/Mexico_City',
  language: 'es',
})
```

### Actualizar Configuración del Sistema

```typescript
import { saveSystemSettings } from '@/lib/firestore'

await saveSystemSettings({
  emailNotifications: true,
  smsNotifications: false,
  autoInvoicing: true,
  invoicePrefix: 'INV',
  shipmentPrefix: 'HM',
  clientPrefix: 'CLT',
  lowStockAlert: false,
  maintenanceMode: false,
})
```

---

## API y Funciones Disponibles

### Usuarios

```typescript
import {
  createUser,
  getUser,
  getUserByUid,
  getUsers,
  updateUser,
  deactivateUser,
  deleteUser,
  updateLastLogin,
  searchUsers,
  getUserStats,
} from '@/lib/firestore/users'
```

### Configuración

```typescript
import {
  getCompanySettings,
  saveCompanySettings,
  updateCompanySettings,
  getSystemSettings,
  saveSystemSettings,
  updateSystemSettings,
  initializeDefaultSettings,
  getAllSettings,
} from '@/lib/firestore/settings'
```

### Hooks de React

```typescript
import {
  useUsers,
  useCompanySettings,
  useSystemSettings,
} from '@/lib/hooks/useFirestore'

// En tu componente
const { users, loading, error, refetch } = useUsers()
const { settings: companySettings, loading, refetch } = useCompanySettings()
const { settings: systemSettings, loading, refetch } = useSystemSettings()
```

---

## Estructura de Datos

### Usuario

```typescript
interface User {
  id: string
  uid: string // Firebase Auth UID
  email: string
  displayName: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  phone?: string
  photoURL?: string
  department?: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLogin?: Timestamp
  permissions?: string[]
}
```

### Configuración de Empresa

```typescript
interface CompanySettings {
  id: string
  companyName: string
  legalName?: string
  rfc?: string
  address?: Address
  phone: string
  email: string
  website?: string
  logo?: string
  taxRate: number
  currency: string
  timezone: string
  language: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Configuración del Sistema

```typescript
interface SystemSettings {
  id: string
  emailNotifications: boolean
  smsNotifications: boolean
  autoInvoicing: boolean
  invoicePrefix: string
  shipmentPrefix: string
  clientPrefix: string
  lowStockAlert: boolean
  maintenanceMode: boolean
  apiKeys?: {
    deepseek?: string
    mistral?: string
    twillio?: string
    sendgrid?: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## Próximos Pasos

### Funcionalidades Recomendadas

1. **Autenticación Completa con Firebase Auth**
   - Login/Logout
   - Registro de usuarios
   - Recuperación de contraseña
   - Protección de rutas por rol

2. **Reportes y Analytics**
   - Gráficos de ventas
   - Métricas de envíos
   - Análisis de clientes
   - Exportación a Excel/PDF

3. **Notificaciones en Tiempo Real**
   - Email para eventos importantes
   - SMS para alertas críticas
   - Push notifications

4. **Integración con APIs Externas**
   - Pasarelas de pago
   - Servicios de mensajería (Twilio, SendGrid)
   - APIs de paquetería

---

## Soporte

Para más información o ayuda:
- **Email:** info@hoymismo.com
- **Dashboard:** http://localhost:3000/dashboard
- **Documentación:** Este archivo

---

**Versión:** 1.0.0
**Última actualización:** Diciembre 2024
