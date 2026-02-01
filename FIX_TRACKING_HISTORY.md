# 🔧 GUÍA RÁPIDA: Corregir trackingHistory en Firestore

## ⚠️ Problema Actual

Tu campo `trackingHistory` está MAL estructurado:

```
trackingHistory: [
  0: "status"        ❌
  1: Timestamp       ❌
  2: "location"      ❌
  3: "notes"         ❌
]
```

## ✅ Cómo debe quedar

```
trackingHistory: [
  0: {               ✅ Objeto/map completo
    date: Timestamp(2026-01-03 17:32:44),
    status: "pendiente",
    location: "Houston, TX",
    description: "Paquete recibido en origen"
  }
]
```

---

## 📋 Pasos en Firebase Console

### 1. Abre Firebase Console
- Ve a: https://console.firebase.google.com
- Proyecto: HoyMismoDashboard
- Menú → Firestore Database

### 2. Navega a tu documento
```
shipments → 4Pgx813yapjorZjCnF0B
```

### 3. ELIMINA el campo `trackingHistory` actual

Click en el campo `trackingHistory` → Click botón "⋮" (3 puntos) → "Delete field" → Confirmar

### 4. CREA nuevo campo `trackingHistory`

```
Click "Add field"
├── Field name: trackingHistory
├── Type: array
└── Click "Add"
```

### 5. AGREGA primer evento (como map)

```
Dentro del array, click "Add item"
├── Type: map  ← IMPORTANTE!
└── Click "Add"
```

### 6. DENTRO del map, agrega 4 campos:

#### Campo 1: date
```
Field name: date
Type: timestamp
Value: 3 de enero de 2026, 12:57:46 AM
```
*(Usa el mismo timestamp de `createdAt`)*

#### Campo 2: status
```
Field name: status
Type: string
Value: pendiente
```
*(O el status actual del envío)*

#### Campo 3: location
```
Field name: location
Type: string
Value: Houston, TX
```

#### Campo 4: description
```
Field name: description
Type: string
Value: Paquete recibido y registrado en el sistema
```

---

## ✅ Verificación Final

Tu `trackingHistory` debe verse así en Firebase:

```
trackingHistory: array[1]
  └── 0: map
      ├── date: Timestamp "Jan 3, 2026 at 12:57:46 AM UTC-6"
      ├── status: "pendiente"
      ├── location: "Houston, TX"
      └── description: "Paquete recibido y registrado en el sistema"
```

---

## 🎯 Agregar más eventos (opcional)

Para agregar un segundo evento al historial:

```
Click en trackingHistory → "Add item"
Type: map

Agregar dentro:
  ├── date: Timestamp(2026-01-03 08:30:00)
  ├── status: "en-transito"
  ├── location: "En ruta hacia México"
  └── description: "Paquete en tránsito hacia la frontera"
```

---

## 🧪 Probar

Después de corregir:

1. Abre: `http://localhost:3000/artefacto.html`
2. Busca: `HM-2026-6612674`
3. Deberías ver el historial correctamente

---

## 💡 Tips

- **SIEMPRE** usa tipo `map` para cada evento en el array
- **NUNCA** pongas strings o timestamps directamente en el array
- El campo `date` debe ser tipo `timestamp`, no string
- El campo `status` debe coincidir con el status del envío

---

## ❓ Troubleshooting

### "No aparece el historial"
→ Verifica que sea un array de maps, no un array de strings

### "Error al cargar el rastreo"
→ Asegúrate de que el campo `date` sea timestamp, no string

### "Solo veo un array vacío"
→ Agrega al menos un evento con los 4 campos obligatorios

---

**⏱️ Tiempo estimado: 3-5 minutos**

Una vez corregido, el historial se mostrará perfecto en tu página de rastreo premium!
