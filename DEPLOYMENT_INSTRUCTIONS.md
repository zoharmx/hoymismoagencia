# 🚀 Instrucciones de Despliegue y Configuración

## ✅ Configuración Completada

Ya se han configurado las siguientes cosas:

- ✅ Variables de entorno en `.env.local`
- ✅ Configuración de Firebase en `lib/firebase.ts`
- ✅ Reglas de seguridad de Firestore en `firestore.rules`
- ✅ Índices de Firestore en `firestore.indexes.json`
- ✅ Servicios CRUD completos
- ✅ Formularios de cliente y envío
- ✅ Script de seed con datos de ejemplo
- ✅ API de testing y seed
- ✅ Página de configuración en `/admin/setup`

---

## 🔧 Pasos para Activar el Sistema

### 1. Desplegar Reglas de Seguridad

Tienes dos opciones:

#### Opción A: Usar Firebase CLI (Recomendado)

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login a Firebase
firebase login

# Seleccionar el proyecto
firebase use hoymismoapp

# Desplegar solo las reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar reglas e índices
firebase deploy --only firestore
```

#### Opción B: Copiar manualmente desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore/rules)
2. Copia el contenido de `firestore.rules`
3. Pégalo en el editor de reglas
4. Haz clic en "Publicar"

**Reglas actuales (Modo Desarrollo):**
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

⚠️ **IMPORTANTE**: Estas reglas permiten acceso total. Están bien para desarrollo, pero DEBES cambiarlas antes de producción.

---

### 2. Habilitar Firestore (Si no está habilitado)

1. Ve a [Firebase Console > Firestore Database](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore)
2. Si no está habilitado, haz clic en "Crear base de datos"
3. Selecciona el modo:
   - **Modo de prueba** (para desarrollo): Permite lectura/escritura por 30 días
   - **Modo de producción**: Usa las reglas personalizadas
4. Selecciona la ubicación: `us-central1` (recomendado para América)
5. Haz clic en "Habilitar"

---

### 3. Verificar la Configuración

#### Opción A: Usar la página de configuración (Recomendado)

```bash
# Asegúrate de que el servidor esté corriendo
npm run dev

# Abre en el navegador:
http://localhost:3000/admin/setup
```

En esta página puedes:
- ✅ Ejecutar test de conexión
- ✅ Poblar la base de datos con datos de ejemplo
- ✅ Ver el estado de la configuración

#### Opción B: Desde la consola del navegador

```javascript
// Test de conexión
fetch('/api/test-firebase')
  .then(r => r.json())
  .then(console.log)

// Poblar con datos de ejemplo
fetch('/api/seed', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

---

### 4. Verificar en Firebase Console

1. Ve a [Firestore Database](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore/data)
2. Deberías ver las colecciones:
   - `clients` - Clientes
   - `shipments` - Envíos
   - `invoices` - Facturas
   - `crm_activities` - Actividades del CRM

---

## 🎯 Testing

### Test Rápido

```bash
# Iniciar el servidor
npm run dev

# En otra terminal o en el navegador
curl http://localhost:3000/api/test-firebase
```

### Test de Seed

```bash
curl -X POST http://localhost:3000/api/seed
```

Esto creará:
- 3 clientes (María González, Carlos Ramírez, Ana López)
- 4 envíos en diferentes estados
- 3 facturas
- 4 actividades del CRM

---

## 📊 Verificar Datos

### En Firebase Console

1. Ve a [Firestore Data](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore/data)
2. Explora las colecciones creadas
3. Verifica que los datos se vean correctos

### En el Dashboard

```bash
# Ve al dashboard
http://localhost:3000/dashboard
```

---

## 🔒 Configurar Reglas de Producción

Cuando estés listo para producción, actualiza `firestore.rules`:

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
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
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

Luego despliega:
```bash
firebase deploy --only firestore:rules
```

---

## 🚨 Troubleshooting

### Error: "Permission denied"

**Solución:**
1. Ve a Firebase Console > Firestore > Reglas
2. Verifica que las reglas permitan acceso
3. Para desarrollo, usa:
   ```javascript
   match /{document=**} {
     allow read, write: if true;
   }
   ```

### Error: "Firebase not configured"

**Solución:**
1. Verifica que `.env.local` tenga todas las variables
2. Reinicia el servidor: `Ctrl+C` y `npm run dev`
3. Verifica en http://localhost:3000/admin/setup

### Los datos no aparecen

**Solución:**
1. Ejecuta el seed: http://localhost:3000/admin/setup
2. Verifica en Firebase Console que los datos existen
3. Revisa la consola del navegador (F12) para errores

### Error: "Module not found"

**Solución:**
```bash
npm install
```

---

## 📱 Próximos Pasos

1. ✅ Verificar que todo funciona con `/admin/setup`
2. ✅ Poblar datos de ejemplo con el seed
3. ✅ Integrar formularios en el dashboard existente
4. 🔜 Configurar Firebase Authentication
5. 🔜 Implementar roles y permisos
6. 🔜 Agregar notificaciones en tiempo real
7. 🔜 Deploy a producción

---

## 🔗 Enlaces Útiles

- [Firebase Console - Proyecto](https://console.firebase.google.com/u/0/project/hoymismoapp)
- [Firestore Database](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore)
- [Reglas de Seguridad](https://console.firebase.google.com/u/0/project/hoymismoapp/firestore/rules)
- [Página de Setup Local](http://localhost:3000/admin/setup)
- [Dashboard](http://localhost:3000/dashboard)

---

## 📝 Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Test de Firebase
curl http://localhost:3000/api/test-firebase

# Ejecutar seed
curl -X POST http://localhost:3000/api/seed

# Build de producción
npm run build

# Desplegar reglas a Firebase
firebase deploy --only firestore:rules

# Login a Firebase
firebase login

# Ver proyectos
firebase projects:list
```

---

## ✅ Checklist Final

- [ ] Firestore habilitado en Firebase Console
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Test de conexión exitoso (http://localhost:3000/admin/setup)
- [ ] Seed ejecutado con éxito
- [ ] Datos visibles en Firebase Console
- [ ] Reglas de seguridad desplegadas
- [ ] Dashboard funcionando correctamente

---

**¿Necesitas ayuda?** Revisa la documentación completa en:
- `FIREBASE_SETUP.md` - Configuración detallada
- `CRM_IMPLEMENTATION.md` - Documentación del CRM
- `CRM_QUICKSTART.md` - Guía rápida

**Estado del Proyecto**: ✅ Configurado y listo para usar
