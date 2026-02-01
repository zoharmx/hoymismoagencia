# Instrucciones para Deploy en Producción

## Estado Actual
- Build: **EXITOSO**
- Tipos: Temporalmente ignorados (pendiente corrección)
- Firestore: Sin colecciones (pendiente inicialización)

---

## PASO 1: Obtener Credenciales de Firebase Admin SDK

1. Ve a **Firebase Console**: https://console.firebase.google.com/project/hoymismoagencia

2. Navega a **Configuración del proyecto** (ícono de engranaje) > **Cuentas de servicio**

3. Haz clic en **"Generar nueva clave privada"**

4. Descarga el archivo JSON

5. **Guárdalo** en la carpeta `hoymismoagencia/` con el nombre:
   ```
   hoymismoagencia-firebase-adminsdk-fbsvc-c3a5e99745.json
   ```

---

## PASO 2: Habilitar Firestore en Modo Desarrollo (Temporal)

Para poder crear las colecciones iniciales, temporalmente habilita el modo desarrollo en Firestore:

1. Ve a **Firebase Console** > **Firestore Database** > **Reglas**

2. Cambia las reglas a:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **Publica** las reglas

4. **IMPORTANTE**: Esto es solo temporal para inicializar. Después restaura las reglas de seguridad.

---

## PASO 3: Ejecutar Importación de Datos

Una vez que tengas las credenciales:

```bash
npm run import-hubspot
```

Esto creará:
- Colección `users` con usuario admin y gestores
- Colección `settings` con configuración
- Colección `clients` con datos del CSV de HubSpot
- Colección `vehicles` con vehículos
- Colección `import_processes` con trámites

---

## PASO 4: Restaurar Reglas de Seguridad

Una vez importados los datos:

```bash
firebase deploy --only firestore:rules
```

O restaura manualmente desde Firebase Console las reglas del archivo `firestore.rules`.

---

## PASO 5: Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel > **Settings** > **Environment Variables**

Agrega las siguientes variables (para Production, Preview y Development):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCZBJJrQlY8ZEATcFQeKLkqYf-9_7jt4wU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hoymismoagencia.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hoymismoagencia-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hoymismoagencia
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hoymismoagencia.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=80317624980
NEXT_PUBLIC_FIREBASE_APP_ID=1:80317624980:web:63a75fca4dff997d83ba81
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GVEYX593CT

DEEPSEEK_API_KEY=sk-181034ba355c4292ad7f149d569ce4e7
MISTRAL_API_KEY=cqrcNINDiUWdfsRkUk9BBCq52XzphD1V
GEMINI_API_KEY=AIzaSyBS3psBaKY4ROVwxfzrcqP7Uv-LDEmccPA
```

---

## PASO 6: Hacer Redeploy en Vercel

Después de agregar las variables:

1. Ve a **Deployments** en Vercel
2. Selecciona el último deployment
3. Haz clic en **Redeploy**

---

## PASO 7: Crear tu Usuario Admin

1. Accede a la aplicación en Vercel
2. Inicia sesión con Google (el correo que quieras usar como admin)
3. Ve a **Firebase Console** > **Firestore** > **users**
4. Crea un documento con tu UID de Firebase Auth:
   - ID del documento: `tu-uid-de-firebase` (lo encuentras en Authentication)
   - Campos:
     ```json
     {
       "uid": "tu-uid",
       "email": "tu-email@gmail.com",
       "displayName": "Tu Nombre",
       "role": "admin",
       "isActive": true,
       "createdAt": (timestamp actual),
       "updatedAt": (timestamp actual)
     }
     ```

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Importar datos de HubSpot
npm run import-hubspot

# Deploy de reglas de Firestore
firebase deploy --only firestore:rules

# Deploy de índices de Firestore
firebase deploy --only firestore:indexes
```

---

## Verificación

Una vez completados los pasos:

1. Accede a tu URL de Vercel
2. Deberías poder iniciar sesión con Google
3. El dashboard debería mostrar los datos importados
4. Verifica en Firebase Console que las colecciones existan

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Las reglas de Firestore están bloqueando el acceso
- Asegúrate de que el usuario tenga un documento en la colección `users` con el rol correcto

### Error: "No se encontró el archivo de credenciales"
- Descarga las credenciales de Firebase Admin SDK como se indica en el Paso 1

### El dashboard no carga datos
- Verifica las variables de entorno en Vercel
- Haz un redeploy después de agregarlas
