# Guía del Asistente de IA - HoyMismo Dashboard

## Descripción General

El Asistente de IA es un agente inteligente avanzado que te ayuda a gestionar tu CRM de paquetería mediante conversación natural. Integra Mistral AI y DeepSeek para ofrecer respuestas precisas sobre clientes, envíos, facturas, cotizaciones y análisis de datos.

## Características Principales

### 🤖 Inteligencia Artificial Dual
- **Mistral AI**: Modelo principal (mistral-large-latest)
- **DeepSeek**: Modelo alternativo de respaldo
- Sistema de fallback automático: si Mistral falla, usa DeepSeek

### 🎙️ Entrada por Voz
- Reconocimiento de voz integrado (Chrome/Edge)
- Transcripción automática de español
- Activación con un clic en el ícono del micrófono

### 🛠️ Herramientas Disponibles

#### 1. Búsqueda de Clientes
```
Ejemplos:
- "Busca el cliente con email juan@ejemplo.com"
- "Muéstrame información de María González"
- "Encuentra el cliente CLT-383146543"
```

#### 2. Rastreo de Envíos
```
Ejemplos:
- "Rastrea el envío HM-2025-8381492"
- "¿Dónde está el paquete con tracking TRACK123456?"
- "Muéstrame los envíos en tránsito"
```

#### 3. Consulta de Facturas
```
Ejemplos:
- "¿Cuántas facturas pendientes tengo?"
- "Muéstrame las facturas vencidas"
- "Dame el total de facturas pagadas este mes"
```

#### 4. Cotizador Inteligente
```
Ejemplos:
- "Cotiza un envío de 5kg de Ciudad de México a Guadalajara"
- "¿Cuánto cuesta enviar 3 cajas de 10kg cada una urgente?"
- "Calcula el costo de un paquete de 2kg de Monterrey a Tijuana"
```

**Parámetros del cotizador:**
- Peso (kg)
- Origen y destino (ciudades)
- Tipo de paquete: documento, paquete, caja
- Servicio urgente (opcional)
- Incluye: costo base, seguro (2%), IVA (16%)
- Estimación de tiempo de entrega

#### 5. Análisis y Estadísticas
```
Ejemplos:
- "Calcula el ingreso total de facturas pagadas"
- "Dame estadísticas de envíos por estatus"
- "¿Cuáles son mis top 5 clientes?"
- "Compara ingresos de este mes vs mes pasado"
```

## Configuración

### Paso 1: Obtener API Keys

**Mistral AI (Recomendado):**
1. Ve a https://console.mistral.ai/
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Crea una nueva API key
5. Copia la key (empieza con `sk-...`)

**DeepSeek (Alternativa):**
1. Ve a https://platform.deepseek.com/
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Crea una nueva API key
5. Copia la key (empieza con `sk-...`)

### Paso 2: Configurar en el Dashboard

1. Inicia sesión en el dashboard como **Admin**
2. Ve a **Configuración** (menú lateral)
3. Selecciona la pestaña **Sistema**
4. Desplázate hasta la sección **API Keys (Asistente IA)**
5. Pega tu API key de Mistral y/o DeepSeek
6. Haz clic en **Guardar Cambios**

**Nota:** Necesitas configurar al menos una de las dos API keys para que el asistente funcione.

### Paso 3: Usar el Asistente

1. Haz clic en el botón **Asistente IA** en la barra superior (ícono de robot)
2. Se abrirá el modal de chat
3. Escribe tu pregunta o usa el micrófono
4. Presiona Enter o clic en el botón de enviar
5. El asistente procesará tu solicitud y responderá

## Ejemplos de Uso

### Caso 1: Buscar Cliente y Ver sus Envíos
```
Usuario: "Busca el cliente con ID CLT-383146543"
Asistente: [Muestra información del cliente]

Usuario: "¿Cuántos envíos tiene este cliente?"
Asistente: [Consulta y muestra el total de envíos]
```

### Caso 2: Cotización Completa
```
Usuario: "Necesito cotizar un envío urgente de 8kg de Ciudad de México a Monterrey, es una caja"
Asistente:
Cotización de Envío:
- Peso: 8 kg
- Ruta: Ciudad de México → Monterrey
- Tipo: Caja
- Urgente: Sí

Desglose:
- Costo base: $600.00
- Seguro: $80.00
- Subtotal: $680.00
- IVA (16%): $108.80
- Total: $788.80 MXN

Entrega estimada: 1 día
```

### Caso 3: Análisis de Negocios
```
Usuario: "Dame un reporte de mi situación financiera"
Asistente: [Consulta facturas y genera reporte]

Análisis Financiero:
- Ingresos totales (pagadas): $45,500.00
- Facturas pendientes: $12,300.00
- Facturas vencidas: $3,200.00
- Promedio por factura: $2,850.00
```

### Caso 4: Rastreo Rápido
```
Usuario: "¿Dónde está el envío HM-2025-8381492?"
Asistente:
Envío: HM-2025-8381492
Estado: EN TRÁNSITO
Origen: Ciudad de México
Destino: Guadalajara
Entrega estimada: 23 de diciembre de 2025

Última actualización:
20/12/2025 14:30 - En ruta hacia Guadalajara - Centro de Distribución CDMX
```

## Acciones Rápidas

El asistente muestra acciones rápidas sugeridas al iniciar:

1. **Buscar cliente** - Plantilla para búsqueda de clientes
2. **Rastrear envío** - Plantilla para tracking
3. **Generar cotización** - Ejemplo de cotización
4. **Ver facturas pendientes** - Consulta de facturas

## Características Técnicas

### Function Calling
El asistente usa function calling para ejecutar operaciones en tiempo real:
- Consultas a Firestore
- Cálculos matemáticos
- Análisis de datos
- Generación de reportes

### Herramientas Internas

**Herramientas de Consulta:**
- `search_clients` - Buscar clientes
- `search_shipments` - Buscar envíos
- `get_all_clients` - Listar todos los clientes
- `get_all_shipments` - Listar todos los envíos
- `get_all_invoices` - Listar todas las facturas
- `get_client_shipments` - Envíos de un cliente
- `get_client_invoices` - Facturas de un cliente

**Herramientas de Cálculo:**
- `calculate_shipping_quote` - Cotizador de envíos
- `calculate_total_revenue` - Cálculo de ingresos
- `get_shipment_statistics` - Estadísticas de envíos

### Algoritmo de Cotización

```typescript
Fórmula:
costo_base = 50 * peso * tipo_multiplicador * distancia_multiplicador

Multiplicadores:
- Documento: 0.8
- Paquete: 1.0
- Caja: 1.2

Distancia:
- Ruta principal (CDMX, GDL, MTY, etc.): 1.0
- Otras rutas: 1.3

Urgente: +50%

Seguro: 2% del valor estimado (peso * $500)
IVA: 16% del subtotal
```

## Solución de Problemas

### Error: "No AI API keys configured"
- Ve a Configuración > Sistema
- Verifica que agregaste al menos una API key
- Guarda los cambios
- Recarga la página

### Error: "Mistral API error"
- Verifica que tu API key sea válida
- Confirma que tienes créditos en tu cuenta Mistral
- El sistema automáticamente cambiará a DeepSeek si está configurado

### El asistente no responde
- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para errores
- Confirma que las API keys están guardadas correctamente

### Respuestas lentas
- Mistral puede tardar 2-5 segundos en responder
- DeepSeek puede tardar 3-8 segundos
- Las consultas complejas con múltiples herramientas toman más tiempo

## Límites y Consideraciones

### Límites de Uso
- Dependen de tu plan de Mistral/DeepSeek
- Mistral: Varía según el plan (free tier, pro, etc.)
- DeepSeek: Verifica en platform.deepseek.com

### Privacidad
- Los mensajes se envían a Mistral/DeepSeek para procesamiento
- Los datos de clientes se consultan de tu Firestore
- No se almacenan conversaciones en servidores externos
- API keys se guardan en Firestore (encriptadas por Firebase)

### Mejores Prácticas

1. **Sé específico**: "Busca cliente Juan" vs "Busca el cliente con email juan@ejemplo.com"
2. **Usa contexto**: El asistente recuerda la conversación
3. **Divide tareas complejas**: En lugar de pedir 5 cosas a la vez, hazlo paso a paso
4. **Verifica datos críticos**: Para operaciones importantes, confirma la información

## Roadmap Futuro

Funciones planeadas:
- [ ] Creación de clientes/envíos por voz
- [ ] Análisis predictivo de ventas
- [ ] Recomendaciones automáticas
- [ ] Integración con WhatsApp/Telegram
- [ ] Alertas proactivas
- [ ] Generación de gráficas
- [ ] Exportación de reportes PDF

## Soporte

Para problemas o sugerencias:
- Revisa esta guía primero
- Verifica la configuración de API keys
- Consulta los logs en la consola del navegador
- Contacta al administrador del sistema

---

**Versión:** 1.0.0
**Última actualización:** 20/12/2025
**Desarrollado con:** Mistral AI & DeepSeek
