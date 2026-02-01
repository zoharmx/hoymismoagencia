# Configuración de Variables de Entorno en Vercel

## Problema Resuelto

El asistente de IA mostraba el error "Lo siento, hubo un error al procesar tu solicitud" porque las API keys no estaban configuradas en Vercel.

## Variables de Entorno Requeridas

Para que el asistente de IA funcione correctamente en producción (Vercel), necesitas configurar las siguientes variables de entorno:

```
MISTRAL_API_KEY=cqrcNINDiUWdfsRkUk9BBCq52XzphD1V
DEEPSEEK_API_KEY=sk-181034ba355c4292ad7f149d569ce4e7
```

## Pasos para Configurar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. **Acceder a Vercel**
   - Ve a https://vercel.com
   - Inicia sesión con tu cuenta

2. **Seleccionar tu Proyecto**
   - Busca el proyecto "hoymismodashboard"
   - Click en el nombre del proyecto

3. **Ir a Settings**
   - En el menú superior, click en "Settings"

4. **Abrir Environment Variables**
   - En el menú lateral, click en "Environment Variables"

5. **Agregar Variables**
   - Para cada variable:
     - **Name:** `MISTRAL_API_KEY`
     - **Value:** `cqrcNINDiUWdfsRkUk9BBCq52XzphD1V`
     - **Environments:** Seleccionar `Production`, `Preview`, y `Development`
     - Click en "Add"

   - Repetir para DeepSeek:
     - **Name:** `DEEPSEEK_API_KEY`
     - **Value:** `sk-181034ba355c4292ad7f149d569ce4e7`
     - **Environments:** Seleccionar `Production`, `Preview`, y `Development`
     - Click en "Add"

6. **Redesplegar**
   - Ve a la pestaña "Deployments"
   - En el último deployment, click en los tres puntos "..."
   - Seleccionar "Redeploy"
   - Confirmar "Redeploy"

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Login
vercel login

# Ir al directorio del proyecto
cd HoyMismoDashboard

# Agregar variables de entorno
vercel env add MISTRAL_API_KEY
# Pegar el valor cuando te lo pida: cqrcNINDiUWdfsRkUk9BBCq52XzphD1V
# Seleccionar: Production, Preview, Development

vercel env add DEEPSEEK_API_KEY
# Pegar el valor cuando te lo pida: sk-181034ba355c4292ad7f149d569ce4e7
# Seleccionar: Production, Preview, Development

# Redesplegar
vercel --prod
```

## Verificación

Después de configurar y redesplegar:

1. **Abrir la aplicación** en https://hoymismodashboard.vercel.app
2. **Ir al Dashboard** → Chat IA
3. **Probar el asistente** con una pregunta simple:
   ```
   "¿Cuántos clientes tengo?"
   ```
4. **Debe responder correctamente** sin errores

## Solución de Problemas

### Si el error persiste:

1. **Verificar que las variables estén guardadas:**
   - Vercel → Settings → Environment Variables
   - Deberías ver ambas variables listadas

2. **Verificar el deployment:**
   - Vercel → Deployments
   - El último deployment debe ser DESPUÉS de agregar las variables
   - Si no, hacer redeploy

3. **Revisar los logs:**
   - Vercel → Deployments → [Último deployment] → Runtime Logs
   - Buscar errores relacionados con "AI" o "API key"

4. **Forzar rebuild:**
   - Settings → General → Scroll hasta abajo
   - Click en "Redeploy" con "Use existing Build Cache" DESACTIVADO

## Otras Variables de Entorno Necesarias

Estas ya deberían estar configuradas (verificar que existan):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwV1iy-YWPFBQQGTmKxucyz0dPokPsy4A
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hoymismoapp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hoymismoapp-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hoymismoapp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hoymismoapp.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=904353239766
NEXT_PUBLIC_FIREBASE_APP_ID=1:904353239766:web:375e056d35793af9baaf77
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LS4EW25QPS
```

**Nota:** Las variables que empiezan con `NEXT_PUBLIC_` son públicas y se incluyen en el bundle del cliente.

## Seguridad

⚠️ **IMPORTANTE:**
- NUNCA subas el archivo `.env.local` al repositorio de Git
- Está en `.gitignore` por seguridad
- Las API keys son secretas y solo deben estar en Vercel
- No las compartas públicamente

## Resumen

✅ Código arreglado en commit `3665be4`
✅ Configurar variables en Vercel (siguiendo pasos arriba)
✅ Redesplegar aplicación
✅ Verificar que el chat funcione

---

**Última actualización:** Diciembre 2024
