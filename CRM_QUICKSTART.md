# 🚀 Quick Start - CRM con Firestore

Guía rápida para comenzar a usar el sistema CRM integrado con Firestore.

## ⚡ Inicio Rápido (5 minutos)

### 1. Configurar Firebase

```bash
# 1. Ir a https://console.firebase.google.com/
# 2. Crear nuevo proyecto "hoymismo-dashboard"
# 3. Habilitar Firestore Database (modo de prueba)
# 4. Ir a Project Settings > Web App
# 5. Copiar las credenciales
```

### 2. Configurar Variables de Entorno

Edita `.env.local` y descomenta las variables de Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hoymismo-dashboard.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hoymismo-dashboard
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hoymismo-dashboard.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Poblar con Datos de Ejemplo

Abre tu navegador y ve a: http://localhost:3000

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('/api/seed', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log('✅', data))
```

¡Listo! Ahora tienes:
- 3 clientes de ejemplo
- 4 envíos en diferentes estados
- 3 facturas
- 4 actividades del CRM

---

## 📖 Ejemplo de Uso

### Usar en un Componente

```tsx
'use client'

import { useClients } from '@/lib/hooks/useFirestore'
import ClientForm from '@/components/forms/ClientForm'
import { useState } from 'react'

export default function MyPage() {
  const { clients, loading } = useClients()
  const [showForm, setShowForm] = useState(false)

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <button onClick={() => setShowForm(true)}>
        Nuevo Cliente
      </button>

      {clients.map(client => (
        <div key={client.id}>
          <h3>{client.name}</h3>
          <p>{client.email}</p>
        </div>
      ))}

      {showForm && (
        <ClientForm
          onClose={() => setShowForm(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  )
}
```

### Crear Datos Directamente

```tsx
import { createClient, createShipment } from '@/lib/firestore'

// Crear cliente
const client = await createClient({
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  phone: '+1 346-555-0123',
  type: 'individual',
  address: {
    street: 'Calle 123',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    country: 'US',
  },
  totalShipments: 0,
  totalSpent: 0,
  isActive: true,
})

// Crear envío
const shipment = await createShipment({
  clientId: client.id,
  clientName: client.name,
  origin: { /* dirección */ },
  destination: { /* dirección */ },
  weight: 5.5,
  packageType: 'caja',
  description: 'Ropa',
  declaredValue: 200,
  status: 'pendiente',
  shippingCost: 100,
  totalCost: 100,
  currency: 'USD',
  requiresSignature: false,
})
```

---

## 📚 Documentación Completa

- **Configuración detallada**: Ver `FIREBASE_SETUP.md`
- **Implementación completa**: Ver `CRM_IMPLEMENTATION.md`

---

## 🎯 Hooks Disponibles

```tsx
import {
  useClients,        // Lista de clientes
  useShipments,      // Lista de envíos
  useInvoices,       // Lista de facturas
  useCRMActivities,  // Actividades del CRM
  useDashboardStats, // Estadísticas
} from '@/lib/hooks/useFirestore'
```

---

## 🔧 Servicios Disponibles

```tsx
import {
  // Clientes
  createClient,
  getClient,
  getClients,
  updateClient,
  deleteClient,
  searchClients,

  // Envíos
  createShipment,
  getShipment,
  getShipments,
  updateShipment,
  updateShipmentStatus,
  searchShipments,
  getShipmentStats,

  // Facturas
  createInvoice,
  getInvoice,
  getInvoices,
  updateInvoice,
  markInvoiceAsPaid,
  getOverdueInvoices,

  // Actividades CRM
  createActivity,
  getClientActivities,
  getPendingActivities,
  completeActivity,

  // Dashboard
  getDashboardStats,
} from '@/lib/firestore'
```

---

## 🚨 Troubleshooting

**"Firebase: No Firebase App"**
- Verifica las variables en `.env.local`
- Reinicia el servidor: Ctrl+C y `npm run dev`

**"Permission denied"**
- Ve a Firebase Console > Firestore > Reglas
- Usa reglas de prueba (permitir todo) para desarrollo

**Los datos no aparecen**
- Ejecuta el seed: `fetch('/api/seed', { method: 'POST' })`
- Revisa Firebase Console para verificar los datos

---

## ✅ Checklist

- [ ] Proyecto Firebase creado
- [ ] Firestore habilitado
- [ ] Variables de entorno configuradas
- [ ] `npm install` ejecutado
- [ ] `npm run dev` corriendo
- [ ] Seed ejecutado
- [ ] Datos visibles en Firebase Console

---

¿Necesitas ayuda? Revisa la documentación completa o abre un issue.
