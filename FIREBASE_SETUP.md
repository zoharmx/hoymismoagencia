# Configuración de Firebase para HoyMismo Dashboard

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto: `hoymismo-dashboard` (o el nombre que prefieras)
4. Acepta los términos y crea el proyecto

## Paso 2: Habilitar Firestore

1. En la consola de Firebase, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona el modo:
   - **Modo de prueba** (para desarrollo): Permite lectura/escritura por 30 días
   - **Modo de producción**: Requiere reglas de seguridad configuradas
4. Selecciona la ubicación (recomendado: `us-central1` para mejor latencia en América)
5. Haz clic en "Habilitar"

## Paso 3: Configurar Reglas de Seguridad

Para desarrollo, usa estas reglas (permite todo):

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

Para producción, implementa reglas más estrictas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clientes
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Envíos
    match /shipments/{shipmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Facturas
    match /invoices/{invoiceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Actividades CRM
    match /crm_activities/{activityId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Paso 4: Obtener Credenciales

1. En la consola de Firebase, ve a **Configuración del proyecto** (ícono de engranaje)
2. En la sección "Tus aplicaciones", haz clic en el ícono de **Web** (`</>`)
3. Registra tu aplicación con el nombre `HoyMismo Web`
4. Copia las credenciales de configuración

## Paso 5: Configurar Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## Paso 6: Estructura de Colecciones

El sistema creará automáticamente estas colecciones cuando agregues el primer documento:

### `clients`
```javascript
{
  clientId: "CLT-001234",
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
  phone: "+1 346-555-0123",
  type: "individual", // o "empresa"
  address: {
    street: "Calle Principal 123",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    country: "US"
  },
  totalShipments: 0,
  totalSpent: 0,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `shipments`
```javascript
{
  shipmentId: "HM-2024-10045",
  clientId: "client_firestore_id",
  clientName: "Juan Pérez",
  origin: { /* Address */ },
  destination: { /* Address */ },
  weight: 5.5,
  status: "en-transito",
  totalCost: 125.00,
  currency: "USD",
  trackingHistory: [
    {
      date: Timestamp,
      status: "pendiente",
      location: "Houston, TX",
      description: "Envío registrado"
    }
  ],
  createdAt: Timestamp
}
```

### `invoices`
```javascript
{
  invoiceId: "INV-2024-00123",
  clientId: "client_firestore_id",
  clientName: "Juan Pérez",
  items: [
    {
      description: "Envío HM-2024-10045",
      quantity: 1,
      unitPrice: 125.00,
      total: 125.00
    }
  ],
  subtotal: 125.00,
  tax: 10.00,
  total: 135.00,
  status: "pendiente",
  dueDate: Timestamp,
  createdAt: Timestamp
}
```

### `crm_activities`
```javascript
{
  clientId: "client_firestore_id",
  type: "llamada", // llamada, email, reunion, nota, seguimiento, cotizacion
  title: "Seguimiento de envío",
  description: "Cliente preguntó por el estado del envío",
  priority: "media", // baja, media, alta
  createdAt: Timestamp,
  createdBy: "user_id",
  completedAt: null
}
```

## Paso 7: Datos de Prueba (Opcional)

Puedes usar la consola de Firebase o crear un script para agregar datos de prueba:

1. Ve a **Firestore Database** en la consola
2. Haz clic en "Agregar colección"
3. Nombre: `clients`
4. Agrega un documento con los campos del ejemplo

O usa el script de seed (próximamente disponible).

## Paso 8: Autenticación (Opcional pero Recomendado)

Para producción, habilita Firebase Authentication:

1. Ve a **Authentication** en la consola
2. Haz clic en "Comenzar"
3. Habilita el proveedor que prefieras:
   - Email/Password (más simple)
   - Google
   - Otros proveedores

## Troubleshooting

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifica que las variables de entorno estén configuradas correctamente
- Reinicia el servidor de desarrollo: `npm run dev`

### Error: "Missing or insufficient permissions"
- Revisa las reglas de seguridad en Firestore
- Para desarrollo, usa reglas permisivas temporalmente

### Los datos no se muestran
- Verifica en la consola de Firebase que las colecciones existen
- Revisa la consola del navegador para errores
- Asegúrate de que las variables de entorno estén descomentatadas en `.env.local`

## Recursos

- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)
- [Reglas de Seguridad](https://firebase.google.com/docs/firestore/security/get-started)
