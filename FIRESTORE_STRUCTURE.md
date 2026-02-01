# 📦 Estructura de Firestore para Tracking Premium

## 🎯 Para tu shipment: `HM-2026-6612674`

### ✅ Campos que YA TIENES (no tocar)

```javascript
shipments / 4Pgx813yapjorZjCnF0B
├── additionalCosts: 55
├── clientId: "v0WoIWkD7BgSXtOIF3xv"
├── clientName: "Gamaliel Hernandez Rodriguez"
├── createdAt: Timestamp(2026-01-03 00:57:46)
├── currency: "USD"
├── declaredValue: 250
├── description: "Prueba prueba"
├── destination: {
│     city: "Apodaca",
│     country: "MX",
│     reference: "Oficina 2 plantas",
│     state: "Nuevo León",
│     street: "Av Concordia 324",
│     zipCode: "66636"
│   }
├── insuranceCost: 15
├── notes: "Dev"
├── origin: {
│     city: "Houston",
│     country: "US",
│     state: "Tx",
│     street: "3St rd 334",
│     zipCode: "77001"
│   }
├── packageType: "caja"
├── requiresSignature: true
├── shipmentId: "HM-2026-6612674"
├── shippingCost: 360
├── specialInstructions: "Dev"
├── status: "En Tránsito" (o el que sea)
```

### 🆕 Campos NUEVOS a agregar

Agregar estos campos **al mismo nivel** que los existentes:

```javascript
├── 🆕 weight: 5.5
│   └── Type: number
│   └── Descripción: Peso del paquete en kg
│
├── 🆕 recipient: {
│       name: "Juan Pérez García",
│       phone: "8112345678"
│   }
│   └── Type: map
│   └── Descripción: Datos del destinatario
│
├── 🆕 trackingHistory: [
│       {
│           status: "Paquete recibido en Houston",
│           timestamp: Timestamp(2026-01-03 00:57:46),
│           location: "Houston, TX - Almacén Principal",
│           notes: "Paquete en buen estado, listo para envío"
│       },
│       {
│           status: "En tránsito hacia frontera",
│           timestamp: Timestamp(2026-01-03 08:30:00),
│           location: "En ruta hacia Laredo, TX",
│           notes: "Transporte terrestre"
│       },
│       {
│           status: "Cruce fronterizo",
│           timestamp: Timestamp(2026-01-03 14:15:00),
│           location: "Laredo - Nuevo Laredo",
│           notes: "Proceso de aduana en curso"
│       },
│       {
│           status: "En tránsito nacional",
│           timestamp: Timestamp(2026-01-03 18:45:00),
│           location: "Monterrey, NL - Centro de Distribución",
│           notes: "Paquete clasificado para entrega local"
│       }
│   ]
│   └── Type: array (de maps)
│   └── Descripción: Historial de movimientos del paquete
│
├── 🆕 estimatedDelivery: Timestamp(2026-01-05 18:00:00)
│   └── Type: timestamp
│   └── Descripción: Fecha estimada de entrega en Apodaca
│
└── 🆕 distance: 1200
    └── Type: number
    └── Descripción: Distancia en km (Houston a Apodaca ≈ 1200 km)
```

## 🔧 Paso a Paso en Firebase Console

### Paso 1: Abre tu documento
1. Ve a Firestore Database
2. Colección: `shipments`
3. Documento: `4Pgx813yapjorZjCnF0B`

### Paso 2: Agrega campos uno por uno

#### A. Campo `weight`
```
Click "Add field" →
  Field name: weight
  Type: number
  Value: 5.5
```

#### B. Campo `recipient` (map)
```
Click "Add field" →
  Field name: recipient
  Type: map

Dentro del map, agregar:
  Click "Add field" →
    Field name: name
    Type: string
    Value: "Juan Pérez García"

  Click "Add field" →
    Field name: phone
    Type: string
    Value: "8112345678"
```

#### C. Campo `trackingHistory` (array)
```
Click "Add field" →
  Field name: trackingHistory
  Type: array

Dentro del array, agregar primer evento [0]:
  Click "Add item" →
    Type: map

    Dentro del map:
      Field: status
      Type: string
      Value: "Paquete recibido en Houston"

      Field: timestamp
      Type: timestamp
      Value: 3 de enero de 2026, 12:57:46 AM

      Field: location
      Type: string
      Value: "Houston, TX - Almacén Principal"

      Field: notes
      Type: string
      Value: "Paquete en buen estado, listo para envío"

Repetir para eventos [1], [2], [3] con datos diferentes
```

#### D. Campo `estimatedDelivery`
```
Click "Add field" →
  Field name: estimatedDelivery
  Type: timestamp
  Value: 5 de enero de 2026, 6:00:00 PM
```

#### E. Campo `distance`
```
Click "Add field" →
  Field name: distance
  Type: number
  Value: 1200
```

## 📋 Template de trackingHistory

Puedes copiar/pegar estos eventos para el historial:

### Evento 1: Recepción
```
status: "Paquete recibido en Houston"
timestamp: [Usa el mismo de createdAt]
location: "Houston, TX - Almacén Principal"
notes: "Paquete en buen estado, listo para envío"
```

### Evento 2: En tránsito USA
```
status: "En tránsito hacia frontera"
timestamp: [createdAt + 8 horas]
location: "En ruta hacia Laredo, TX"
notes: "Transporte terrestre"
```

### Evento 3: Cruce fronterizo
```
status: "Cruce fronterizo"
timestamp: [createdAt + 14 horas]
location: "Laredo - Nuevo Laredo"
notes: "Proceso de aduana en curso"
```

### Evento 4: En México
```
status: "En tránsito nacional"
timestamp: [createdAt + 18 horas]
location: "Monterrey, NL - Centro de Distribución"
notes: "Paquete clasificado para entrega local"
```

### Evento 5: Cercano a destino (si aplica)
```
status: "En ruta de entrega"
timestamp: [createdAt + 48 horas]
location: "Apodaca, NL - Repartidor asignado"
notes: "Entrega programada para hoy"
```

## 🎯 Cómo calcular los valores

### Distance (distancia)
Houston a Apodaca: **~1200 km**
Puedes usar Google Maps para rutas específicas

### estimatedDelivery
Para envíos USA → México:
- Estándar: +2 a 4 días desde `createdAt`
- Express: +1 a 2 días desde `createdAt`

Para tu caso (creado 3 de enero):
- Entrega estimada: 5 de enero (2 días después)

## ✅ Resultado Final

Después de agregar todos los campos, tu documento se verá así:

```
shipments / 4Pgx813yapjorZjCnF0B
├── [Todos los campos existentes...]
├── weight: 5.5
├── recipient: { name: "Juan Pérez García", phone: "8112345678" }
├── trackingHistory: [4 eventos]
├── estimatedDelivery: Timestamp(2026-01-05 18:00)
└── distance: 1200
```

## 🧪 Probar el sistema

1. Guarda todos los cambios en Firestore
2. Ve a tu página de rastreo: `http://localhost:3000/artefacto.html`
3. Ingresa: `HM-2026-6612674`
4. Deberías ver:
   - ✅ Ruta animada Houston → Apodaca
   - ✅ Historial con 4 eventos
   - ✅ ETA: 5 de enero de 2026
   - ✅ Distancia: 1200 km
   - ✅ Botón de compartir funcionando

## 📞 Troubleshooting

### ❌ "No se muestra el mapa"
- Verifica que `origin` y `destination` tengan `city` y `street`
- Las ciudades deben existir en OpenStreetMap

### ❌ "No aparece el historial"
- Verifica que `trackingHistory` sea un **array** (no un map)
- Cada elemento debe tener: `status`, `timestamp`, `location`

### ❌ "La fecha de ETA no aparece"
- Verifica que `estimatedDelivery` sea tipo **timestamp**
- No debe ser string

## 🔄 Para futuros envíos

Cuando crees nuevos shipments, asegúrate de incluir estos campos desde el principio:

```javascript
// Al crear un nuevo shipment en tu código
const newShipment = {
  // ... campos existentes ...
  weight: parseFloat(formData.weight),
  recipient: {
    name: formData.recipientName,
    phone: formData.recipientPhone
  },
  trackingHistory: [{
    status: "Paquete recibido",
    timestamp: serverTimestamp(),
    location: `${formData.originCity}, ${formData.originState}`,
    notes: "Paquete registrado en el sistema"
  }],
  estimatedDelivery: calculateETA(formData),
  distance: calculateDistance(formData.origin, formData.destination)
};
```

---

**Nota**: Los campos existentes NO necesitan modificarse. Solo agregar los 5 nuevos campos.
