# Implementación del CRM con Firestore

## Resumen de la Implementación

Se ha implementado un sistema CRM completo integrado con Firebase Firestore para el dashboard de HoyMismo Paquetería. Esta implementación incluye gestión de clientes, envíos, facturas y actividades del CRM.

---

## 🎯 Características Implementadas

### 1. **Sistema de Base de Datos (Firestore)**

#### Configuración
- `lib/firebase.ts` - Configuración de Firebase y Firestore
- Soporte para variables de entorno
- Inicialización singleton para evitar múltiples instancias

#### Tipos TypeScript (`types/crm.ts`)
- **Client**: Información completa de clientes (individual/empresa)
- **Shipment**: Gestión de envíos con tracking
- **Invoice**: Sistema de facturación
- **CRMActivity**: Seguimiento de interacciones con clientes
- **Address**: Tipo reutilizable para direcciones
- **Estados**: ShipmentStatus, InvoiceStatus, ActivityType, etc.

### 2. **Servicios de Firestore (CRUD Completo)**

#### `lib/firestore/clients.ts`
- ✅ Crear clientes con IDs personalizados (CLT-XXXXXX)
- ✅ Obtener cliente por ID
- ✅ Listar clientes con filtros
- ✅ Actualizar información de cliente
- ✅ Soft delete (marcar como inactivo)
- ✅ Búsqueda por nombre/email
- ✅ Incrementar contadores automáticamente

#### `lib/firestore/shipments.ts`
- ✅ Crear envíos con IDs personalizados (HM-YYYY-XXXXX)
- ✅ Tracking history automático
- ✅ Actualizar estado con eventos de tracking
- ✅ Filtros avanzados (estado, cliente, fechas, valores)
- ✅ Búsqueda por número de tracking
- ✅ Estadísticas de envíos
- ✅ Integración automática con clientes

#### `lib/firestore/invoices.ts`
- ✅ Crear facturas con IDs personalizados (INV-YYYY-XXXXX)
- ✅ Items con detalles y subtotales
- ✅ Marcar como pagada con método de pago
- ✅ Detectar facturas vencidas
- ✅ Estadísticas de facturación
- ✅ Filtros por estado, cliente y montos

#### `lib/firestore/crm-activities.ts`
- ✅ Registrar actividades (llamadas, emails, reuniones, notas)
- ✅ Sistema de prioridades (baja, media, alta)
- ✅ Fechas de vencimiento
- ✅ Asignación a usuarios
- ✅ Vincular con envíos y facturas
- ✅ Marcar como completadas
- ✅ Actividades vencidas y de alta prioridad

#### `lib/firestore/dashboard.ts`
- ✅ Estadísticas consolidadas del dashboard
- ✅ Resumen rápido con métricas clave
- ✅ Cálculos de ingresos mensuales

#### `lib/firestore/index.ts`
- Exportaciones centralizadas de todos los servicios

### 3. **Hooks de React (`lib/hooks/useFirestore.ts`)**

Hooks personalizados para facilitar el uso de Firestore en componentes:

- `useClients()` - Lista de clientes activos
- `useShipments()` - Lista de envíos
- `useInvoices()` - Lista de facturas
- `useCRMActivities()` - Actividades recientes
- `useDashboardStats()` - Estadísticas del dashboard

Cada hook incluye:
- Estado de carga (loading)
- Manejo de errores
- Función de recarga (refetch)

### 4. **Formularios de Gestión**

#### `components/forms/ClientForm.tsx`
- Formulario completo para crear clientes
- Validación con react-hook-form
- Soporte para clientes individuales y empresas
- Campos de dirección completos
- Sistema de etiquetas (tags)
- Notas adicionales
- Diseño responsive y accesible

#### `components/forms/ShipmentForm.tsx`
- Formulario para crear envíos
- Selector de clientes desde Firestore
- Direcciones de origen y destino completas
- Detalles del paquete (peso, tipo, descripción)
- Sistema de costos con cálculo automático del total
- Estados de envío
- Opciones adicionales (firma requerida, instrucciones)
- Validación completa

### 5. **Sistema de Seed Data**

#### `lib/firestore/seed.ts`
Script para poblar la base de datos con datos de ejemplo:
- 3 clientes (individual y empresa)
- 4 envíos (diferentes estados)
- 3 facturas (pagadas y pendientes)
- 4 actividades del CRM

#### `app/api/seed/route.ts`
API endpoint para ejecutar el seed:
- Solo disponible en desarrollo
- Endpoint: POST /api/seed
- Protección contra ejecución en producción

### 6. **Documentación**

#### `FIREBASE_SETUP.md`
Guía completa de configuración:
- Crear proyecto en Firebase
- Habilitar Firestore
- Configurar reglas de seguridad
- Obtener credenciales
- Variables de entorno
- Estructura de colecciones
- Troubleshooting

---

## 📁 Estructura de Archivos

```
lib/
├── firebase.ts                 # Configuración de Firebase
├── ai-helpers.ts              # Helpers de IA (existente)
├── firestore/
│   ├── index.ts               # Exportaciones
│   ├── clients.ts             # CRUD de clientes
│   ├── shipments.ts           # CRUD de envíos
│   ├── invoices.ts            # CRUD de facturas
│   ├── crm-activities.ts      # CRUD de actividades
│   ├── dashboard.ts           # Estadísticas
│   └── seed.ts                # Datos de ejemplo
└── hooks/
    └── useFirestore.ts        # Hooks de React

types/
└── crm.ts                     # Tipos TypeScript

components/
└── forms/
    ├── ClientForm.tsx         # Formulario de clientes
    └── ShipmentForm.tsx       # Formulario de envíos

app/
└── api/
    └── seed/
        └── route.ts           # API para seed

docs/
├── FIREBASE_SETUP.md          # Guía de configuración
└── CRM_IMPLEMENTATION.md      # Este archivo
```

---

## 🚀 Cómo Usar

### 1. Configurar Firebase

Sigue la guía en `FIREBASE_SETUP.md`:

1. Crea un proyecto en Firebase Console
2. Habilita Firestore
3. Copia las credenciales
4. Configura `.env.local`

```bash
# Descomenta y completa estas variables en .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

### 4. Poblar con Datos de Ejemplo

Opción A - Usando la API:
```bash
curl -X POST http://localhost:3000/api/seed
```

Opción B - Desde el navegador:
```javascript
// En la consola del navegador
fetch('/api/seed', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

### 5. Usar los Formularios

#### En el Dashboard:

```tsx
'use client'

import { useState } from 'react'
import ClientForm from '@/components/forms/ClientForm'
import ShipmentForm from '@/components/forms/ShipmentForm'

export default function DashboardPage() {
  const [showClientForm, setShowClientForm] = useState(false)
  const [showShipmentForm, setShowShipmentForm] = useState(false)

  return (
    <>
      <button onClick={() => setShowClientForm(true)}>
        Nuevo Cliente
      </button>
      <button onClick={() => setShowShipmentForm(true)}>
        Nuevo Envío
      </button>

      {showClientForm && (
        <ClientForm
          onClose={() => setShowClientForm(false)}
          onSuccess={() => {
            // Actualizar lista de clientes
            window.location.reload()
          }}
        />
      )}

      {showShipmentForm && (
        <ShipmentForm
          onClose={() => setShowShipmentForm(false)}
          onSuccess={() => {
            // Actualizar lista de envíos
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
```

#### Usando los Hooks:

```tsx
'use client'

import { useClients, useShipments } from '@/lib/hooks/useFirestore'

export default function ClientsPage() {
  const { clients, loading, error } = useClients()

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {clients.map(client => (
        <div key={client.id}>
          <h3>{client.name}</h3>
          <p>{client.email}</p>
          <p>Total gastado: ${client.totalSpent}</p>
        </div>
      ))}
    </div>
  )
}
```

#### Usando los Servicios Directamente:

```tsx
import { createClient, getClients } from '@/lib/firestore'

// Crear un nuevo cliente
const newClient = await createClient({
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  phone: '+1 346-555-0123',
  type: 'individual',
  address: {
    street: 'Calle Principal 123',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    country: 'US',
  },
  totalShipments: 0,
  totalSpent: 0,
  isActive: true,
})

// Obtener clientes activos
const activeClients = await getClients({ isActive: true })

// Buscar clientes
const results = await searchClients('juan')
```

---

## 🔒 Seguridad

### Reglas de Firestore

Para desarrollo (archivo `firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Para producción, implementa reglas más estrictas basadas en autenticación.

---

## 📊 Estructura de Datos

### Colecciones Principales

1. **clients** - Información de clientes
2. **shipments** - Envíos y su tracking
3. **invoices** - Facturas y pagos
4. **crm_activities** - Actividades e interacciones

### IDs Personalizados

- Clientes: `CLT-XXXXXX`
- Envíos: `HM-YYYY-XXXXX`
- Facturas: `INV-YYYY-XXXXX`

Estos IDs son generados automáticamente y son únicos.

---

## 🛠️ Próximos Pasos Sugeridos

1. **Autenticación**: Implementar Firebase Auth
2. **Roles y Permisos**: Sistema de roles (admin, operador, cliente)
3. **Dashboard Actualizado**: Integrar los hooks en el dashboard existente
4. **Notificaciones**: Sistema de notificaciones en tiempo real
5. **Reportes**: Generación de reportes en PDF
6. **Búsqueda Avanzada**: Integrar Algolia o ElasticSearch
7. **Imágenes**: Subir fotos de paquetes a Firebase Storage
8. **Email**: Envío de notificaciones por email
9. **WhatsApp**: Integración con API de WhatsApp Business
10. **Analytics**: Dashboard de analytics con gráficas

---

## 🐛 Troubleshooting

### Firebase no está configurado
- Verifica que las variables de entorno estén en `.env.local`
- Reinicia el servidor de desarrollo

### Los datos no aparecen
- Ejecuta el seed: `POST /api/seed`
- Verifica en Firebase Console que las colecciones existen
- Revisa la consola del navegador para errores

### Error de permisos
- Verifica las reglas de seguridad en Firebase Console
- Para desarrollo, usa reglas permisivas

### TypeScript errors
- Ejecuta: `npm run build` para verificar
- Verifica que todos los tipos estén correctamente importados

---

## 📝 Notas Adicionales

- **Performance**: Los hooks actuales recargan en cada mount. Para aplicaciones grandes, considera implementar caché o SWR
- **Paginación**: Los servicios tienen límites por defecto (50-100 documentos). Implementa paginación para listas grandes
- **Optimistic Updates**: Considera implementar actualizaciones optimistas para mejor UX
- **Real-time**: Firestore soporta subscripciones en tiempo real con `onSnapshot`

---

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hook Form](https://react-hook-form.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## ✅ Checklist de Implementación

- [x] Configuración de Firebase
- [x] Tipos TypeScript completos
- [x] CRUD de Clientes
- [x] CRUD de Envíos
- [x] CRUD de Facturas
- [x] CRUD de Actividades CRM
- [x] Sistema de estadísticas
- [x] Hooks de React
- [x] Formulario de clientes
- [x] Formulario de envíos
- [x] Script de seed
- [x] API de seed
- [x] Documentación completa
- [ ] Integración con dashboard existente
- [ ] Autenticación
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Deploy a producción

---

**Implementado por**: Claude Code
**Fecha**: Diciembre 2024
**Versión**: 1.0.0
