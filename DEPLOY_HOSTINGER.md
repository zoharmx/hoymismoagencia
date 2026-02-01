# 🚀 Guía de Deploy para Hostinger

## 📋 **El Problema que Resolvimos**

Tu sitio está dividido en 2 partes:
- **Landing Page**: `hoymismopaqueteria.com` (Hostinger - HTML estático)
- **Dashboard + APIs**: `hoymismodashboard.vercel.app` (Vercel - Next.js)

Cuando copiaste `artefacto.html` a Hostinger, intentaba llamar a `/api/track/` **en Hostinger**, pero las APIs están **en Vercel**.

---

## ✅ **Solución Implementada**

### 1. **Archivo especial para Hostinger**: `artefacto-hostinger.html`

Este archivo apunta a las APIs en Vercel:
```javascript
const DASHBOARD_URL = "https://hoymismodashboard.vercel.app";
const API_URL = `${DASHBOARD_URL}/api/track/`;
const AI_SUMMARY_URL = `${DASHBOARD_URL}/api/ai-summary`;
```

### 2. **CORS habilitado en las APIs**

Actualicé las APIs para aceptar peticiones desde Hostinger:
- ✅ `app/api/track/[trackingNumber]/route.ts` - Con CORS
- ✅ `app/api/ai-summary/route.ts` - Con CORS

---

## 📝 **Pasos para Deploy**

### **Paso 1: Deploy a Vercel (APIs actualizadas)**

```bash
# En tu terminal
git add .
git commit -m "feat: add CORS support for Hostinger integration"
git push origin main
```

Vercel desplegará automáticamente los cambios.

**Espera 1-2 minutos** hasta que el deploy termine.

### **Paso 2: Verificar que las APIs funcionen**

Abre en tu navegador:
```
https://hoymismodashboard.vercel.app/api/track/HM-2026-6612674
```

Deberías ver un JSON con los datos del paquete.

### **Paso 3: Copiar archivo a Hostinger**

1. **Abre el archivo**: `artefacto-hostinger.html` (NO uses `artefacto.html`)

2. **Copia TODO el contenido**

3. **Ve al CMS de Hostinger**:
   - Busca la página de rastreo
   - Pega el contenido completo
   - **Guarda**

### **Paso 4: Probar en Producción**

Abre:
```
https://hoymismopaqueteria.com/rastreo
```

Busca una guía:
```
HM-2026-6612674
```

---

## 🐛 **Solución a Errores**

### ❌ Error: "404 Not Found"
**Causa**: Archivo incorrecto o APIs no desplegadas

**Solución**:
1. Verifica que usaste `artefacto-hostinger.html` (NO `artefacto.html`)
2. Confirma que Vercel terminó de desplegar
3. Abre `https://hoymismodashboard.vercel.app/api/track/HM-2026-6612674` directamente

### ❌ Error: "CORS policy"
**Causa**: CORS no configurado correctamente

**Solución**:
1. Asegúrate de hacer `git push` con los cambios de CORS
2. Espera a que Vercel despliegue
3. Limpia caché del navegador (Ctrl+F5)

### ⚠️ Warning: "cdn.tailwindcss.com should not be used in production"
**Causa**: El CDN de Tailwind es solo para desarrollo

**Solución**: Esto es solo un warning, no afecta la funcionalidad. Para eliminarlo:
1. Instala Tailwind CSS localmente
2. Compila los estilos
3. Incluye el CSS compilado

**Por ahora**: Ignóralo, no rompe nada.

---

## 🔍 **Verificación**

### ✅ Checklist de Deploy:

- [ ] Vercel desplegado con APIs actualizadas
- [ ] API responde en: `https://hoymismodashboard.vercel.app/api/track/HM-2026-6612674`
- [ ] Archivo `artefacto-hostinger.html` copiado a Hostinger
- [ ] Página abre en: `https://hoymismopaqueteria.com/rastreo`
- [ ] Búsqueda de guía funciona
- [ ] Mapa se muestra correctamente
- [ ] Historial aparece
- [ ] Botón compartir funciona

---

## 📊 **Arquitectura Final**

```
┌─────────────────────────────────────────┐
│  hoymismopaqueteria.com (Hostinger)    │
│  ├─ Landing page (HTML/CSS)            │
│  └─ artefacto-hostinger.html           │
│      │                                  │
│      │ Llama a APIs ↓                   │
│      │                                  │
└──────┼──────────────────────────────────┘
       │
       │ HTTPS
       │
┌──────▼──────────────────────────────────┐
│  hoymismodashboard.vercel.app          │
│  ├─ Dashboard (Next.js)                │
│  └─ APIs:                              │
│      ├─ /api/track/[trackingNumber]   │
│      └─ /api/ai-summary               │
│                                        │
│  Firestore (Firebase)                 │
└────────────────────────────────────────┘
```

---

## 🎯 **URLs Finales**

| Servicio | URL |
|----------|-----|
| Landing Page | https://hoymismopaqueteria.com |
| Rastreo Público | https://hoymismopaqueteria.com/rastreo (o donde esté) |
| Dashboard Admin | https://hoymismodashboard.vercel.app |
| API Tracking | https://hoymismodashboard.vercel.app/api/track/[guia] |
| API IA Summary | https://hoymismodashboard.vercel.app/api/ai-summary |

---

## 💡 **Recomendación Futura**

Para simplificar, considera:

**Opción 1**: Mover toda la landing page a Vercel
- Más fácil de mantener
- Todo en un solo lugar
- Sin problemas de CORS

**Opción 2**: Usar un subdominio
- Landing: `www.hoymismopaqueteria.com` (Hostinger)
- App: `app.hoymismopaqueteria.com` (Vercel)
- Rastreo: `track.hoymismopaqueteria.com` (Vercel)

Por ahora, la solución actual funciona perfectamente.

---

## 📞 **Testing**

Después del deploy, prueba:

1. **Rastreo básico**:
   - Abre: https://hoymismopaqueteria.com/rastreo
   - Busca: HM-2026-6612674
   - Verifica: Datos, mapa, historial

2. **Compartir**:
   - Click en botón compartir
   - Verifica QR code
   - Copia link y abre en otra pestaña

3. **IA**:
   - Click "Explicar con IA"
   - Verifica que responda

---

**🎉 ¡Listo! Tu sistema de rastreo premium está en producción!**
