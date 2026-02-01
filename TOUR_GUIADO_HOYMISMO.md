# 🚀 Tour Guiado: Plataforma HoyMismo Paquetería

**Bienvenido al sistema completo de HoyMismo Paquetería**
Esta guía te llevará paso a paso por todas las funciones de la plataforma, desde el sitio web público hasta el panel de administración.

---

## 📑 Índice

1. [Sitio Web Público](#1-sitio-web-público)
2. [Sistema de Rastreo Público](#2-sistema-de-rastreo-público)
3. [Acceso al Dashboard](#3-acceso-al-dashboard)
4. [Dashboard Principal](#4-dashboard-principal)
5. [Gestión de Envíos](#5-gestión-de-envíos)
6. [Gestión de Clientes](#6-gestión-de-clientes)
7. [Sistema de Facturación](#7-sistema-de-facturación)
8. [Reportes y Análisis](#8-reportes-y-análisis)
9. [Portal de Clientes](#9-portal-de-clientes)
10. [Asistente de IA](#10-asistente-de-ia)
11. [Configuración y Usuarios](#11-configuración-y-usuarios)
12. [Roles y Permisos](#12-roles-y-permisos)
13. [Tips y Mejores Prácticas](#13-tips-y-mejores-prácticas)

---

## 1. Sitio Web Público

**URL**: `https://hoymismopaqueteria.com`

### ¿Qué es?
Es la cara pública de HoyMismo. Aquí los clientes potenciales conocen nuestros servicios.

### Secciones Principales:

#### 🏠 **Página de Inicio**
- **Logo y Nombre**: Identidad visual de HoyMismo
- **Hero Section**: Mensaje principal con llamado a la acción
- **Servicios**: Tarjetas mostrando qué ofrecemos
- **Ventajas**: Por qué elegir HoyMismo
- **Contacto**: Formulario para consultas

#### 📦 **Rastreo**
- Botón destacado "Rastrear Paquete"
- Lleva al sistema de rastreo público
- Sin necesidad de login

#### 📞 **Contacto**
- Información de la empresa
- Teléfono, email, redes sociales
- Formulario de contacto

### ¿Para quién?
- Clientes nuevos que buscan información
- Clientes actuales que quieren rastrear paquetes
- Público general

---

## 2. Sistema de Rastreo Público

**URL**: `https://hoymismopaqueteria.com/tracking`

### ¿Qué es?
Una herramienta premium donde cualquier persona puede rastrear su paquete usando el número de guía, sin necesidad de crear cuenta.

### Cómo Usarlo:

#### **Paso 1: Ingresar Número de Guía**
```
Ejemplo: HM-2026-6612674
```
- Escribe o pega el número de guía
- Click en "Rastrear"

#### **Paso 2: Ver Información del Paquete**

La pantalla mostrará:

**📊 Estado Actual**
- Badge grande con el estado: "En Tránsito", "Entregado", etc.
- Fecha estimada de entrega
- Distancia total en km

**🗺️ Mapa Interactivo**
- Muestra origen y destino con marcadores
- Ruta animada entre ciudades
- Botón para cambiar entre vista de mapa y satélite
- Zoom y navegación disponibles

**📍 Línea de Tiempo (Timeline)**
5 etapas visuales:
1. **Origen** (Paquete registrado)
2. **Tránsito** (En camino)
3. **Centro Dist.** (En almacén de distribución)
4. **En Ruta** (Salió para entrega)
5. **Entregado** (Llegó al destino)

**ℹ️ Información Detallada**

Secciones organizadas:
- **Información del Envío**: Guía, estado, fecha de recolección
- **Origen**: Ciudad y dirección de salida
- **Destino**: Ciudad y dirección completa de entrega
- **Remitente**: Nombre y teléfono
- **Destinatario**: Nombre del receptor
- **Detalles del Paquete**: Peso, dimensiones, distancia, ETA, costo

**📋 Historial de Movimientos**
- Lista cronológica de todos los eventos
- Fecha y hora de cada actualización
- Ubicación del evento
- Notas adicionales
- El evento más reciente aparece primero

**🤖 Asistente de IA**
- Botón "Explicar con IA"
- Genera resumen en lenguaje natural
- Explica qué significa el estado actual
- Da contexto sobre los próximos pasos

**📱 Compartir Rastreo**
- Botón de compartir en esquina superior derecha
- Genera código QR para escanear
- Link para copiar y enviar por WhatsApp, Email, etc.

### Características Premium:

✨ **Diseño Moderno**
- Modo oscuro profesional
- Animaciones suaves
- Iconos intuitivos

✨ **Mapa con Mapbox**
- Carga rápida
- Navegación fluida
- Precisión GPS
- Vista satélite disponible

✨ **Inteligencia Artificial**
- Resúmenes automáticos
- Lenguaje claro y amigable
- Contexto personalizado

---

## 3. Acceso al Dashboard

**URL**: `https://hoymismodashboard.vercel.app`

### Iniciar Sesión

#### **Pantalla de Login**

1. **Email**: Ingresa tu correo corporativo de HoyMismo
   ```
   Ejemplo: operador@hoymismo.com
   ```

2. **Contraseña**: Tu contraseña asignada por el administrador

3. **Click en "Iniciar Sesión"**

#### **Autenticación con Google**
- También puedes usar "Continuar con Google"
- Selecciona tu cuenta de Google
- Acceso instantáneo

#### **¿Olvidaste tu contraseña?**
- Click en "¿Olvidaste tu contraseña?"
- Recibirás un email para resetearla
- Sigue las instrucciones del correo

### Seguridad
- Las contraseñas están encriptadas
- Sesión se cierra automáticamente después de inactividad
- Cada acción queda registrada con tu usuario

---

## 4. Dashboard Principal

**Sección**: Overview

### ¿Qué es?
El centro de comando de HoyMismo. Aquí ves el resumen de todo lo que está pasando en tiempo real.

### Componentes del Dashboard:

#### **📊 Métricas Principales** (4 tarjetas grandes)

**1. Total de Envíos**
- Número total de paquetes gestionados
- Ícono: 📦
- Color: Azul

**2. Clientes Activos**
- Clientes con envíos en los últimos 30 días
- Ícono: 👥
- Color: Verde

**3. Ingresos del Mes**
- Suma de facturación del mes actual
- Formato: $X,XXX.XX USD
- Ícono: 💵
- Color: Oro

**4. Envíos Pendientes**
- Paquetes que no han sido entregados
- Estados: Pendiente, En Tránsito, En Distribución
- Ícono: 🕐
- Color: Naranja

#### **📈 Gráficos y Estadísticas**

**Gráfico de Envíos (Últimos 7 días)**
- Barras por día
- Muestra tendencias
- Click para ver detalle

**Distribución por Estado**
- Gráfico de dona/pastel
- Colores por estado:
  - 🟢 Entregado (verde)
  - 🔵 En Tránsito (azul)
  - 🟡 Pendiente (amarillo)
  - 🟠 En Distribución (naranja)
  - 🔴 Cancelado (rojo)

**Top 5 Destinos**
- Ciudades con más envíos
- Porcentaje del total

#### **📋 Envíos Recientes**

Tabla con los últimos 10 envíos:
- **Número de Guía**: HM-2026-XXXXXX
- **Cliente**: Nombre del remitente
- **Destino**: Ciudad
- **Estado**: Badge con color
- **Fecha**: Cuándo se creó
- **Acciones**: Ver detalles, editar

#### **⚠️ Alertas y Notificaciones**

Panel lateral que muestra:
- Envíos con retraso
- Problemas en aduana
- Pagos pendientes
- Tareas por hacer

### Navegación Rápida:

**Barra Lateral (Izquierda)**
- **Dashboard**: Donde estás ahora
- **Envíos**: Gestionar paquetes
- **Clientes**: Base de datos de clientes
- **Facturación**: Crear y ver facturas
- **Reportes**: Análisis detallados
- **Configuración**: Ajustes del sistema
- **Usuarios**: Administrar equipo (solo admin)

**Barra Superior (Derecha)**
- **Buscar**: 🔍 Buscar envíos, clientes, facturas
- **Asistente IA**: 🤖 Abrir chat con IA
- **Perfil**: Foto y nombre de usuario
- **Cerrar Sesión**: 🚪 Salir del sistema

---

## 5. Gestión de Envíos

**Sección**: Envíos (Shipments)

### ¿Qué es?
El módulo más importante. Aquí creas, editas y monitoreas todos los paquetes.

### Crear un Nuevo Envío

#### **Paso 1: Click en "Nuevo Envío"**
Botón naranja en la esquina superior derecha (+)

#### **Paso 2: Formulario de Envío**

**📝 Información del Cliente**
- **Nombre Completo**: Quien envía el paquete
- **Teléfono**: Para contacto
- **Email**: Opcional, para notificaciones

**📦 Detalles del Paquete**
- **Tipo de Paquete**:
  - Sobre (hasta 2 kg)
  - Caja (hasta 30 kg)
  - Palet (más de 30 kg)
- **Peso (kg)**: Número con decimales permitidos
  ```
  Ejemplo: 2.5
  ```
- **Dimensiones**: Largo x Ancho x Alto (cm)
  ```
  Ejemplo: 30 x 20 x 15
  ```
- **Descripción**: Qué contiene
  ```
  Ejemplo: Documentos legales / Ropa / Electrónicos
  ```
- **Valor Declarado**: Para seguro (USD)

**📍 Origen**
- **País**: USA / México
- **Ciudad**: Houston, Monterrey, etc.
- **Código Postal**: Opcional
- **Dirección Completa**: Calle y número
- **Referencias**: Opcional (entre calles, edificio)

**📍 Destino**
- **País**: USA / México
- **Ciudad**: Ciudad de destino
- **Código Postal**: Opcional
- **Dirección Completa**: Dirección de entrega
- **Referencias**: Opcional
- **Nombre del Receptor**: Quien recibe
- **Teléfono del Receptor**: Para coordinar entrega

**💰 Información de Costo**
- **Tipo de Servicio**:
  - Estándar (3-5 días)
  - Express (1-2 días)
  - Económico (5-7 días)
- **Costo del Envío**: Se calcula automáticamente
- **Seguro**: Opcional (% del valor declarado)
- **Costo Total**: Suma automática

**📅 Programación**
- **Fecha de Recolección**: Cuándo pasamos por el paquete
- **Notas Especiales**: Instrucciones adicionales

#### **Paso 3: Revisar y Crear**
- Click en "Crear Envío"
- El sistema genera automáticamente:
  - **Número de Guía**: HM-2026-XXXXXXX
  - **Tracking Number**: Para rastreo
  - **Estado Inicial**: Pendiente
  - **Distancia Estimada**: Calculada automáticamente
  - **Fecha Estimada de Entrega**: Basada en distancia y servicio

#### **Paso 4: Confirmación**
- Aparece mensaje de éxito
- Se muestra el número de guía
- Opciones:
  - Imprimir etiqueta
  - Enviar notificación al cliente
  - Ver detalles
  - Crear otro envío

### Ver Detalles de un Envío

**Click en cualquier envío** de la lista para ver:

**Información Completa**
- Todos los datos ingresados
- Historial de cambios
- Fotos adjuntas (si hay)

**Actualizar Estado**
Botones rápidos para cambiar estado:
1. ✅ Marcar como "En Tránsito"
2. ✅ Marcar como "En Aduana"
3. ✅ Marcar como "En Distribución"
4. ✅ Marcar como "En Ruta de Entrega"
5. ✅ Marcar como "Entregado"
6. ❌ Marcar como "Cancelado"
7. ⚠️ Reportar "Incidencia"

**Agregar Nota al Historial**
- Click en "Agregar Evento"
- Escribe descripción:
  ```
  Ejemplo: "Paquete retenido en aduana para revisión"
  ```
- Ubicación actual
- Se registra fecha/hora automáticamente

**Adjuntar Documentos**
- Subir fotos del paquete
- PDF de documentos aduanales
- Firma de entrega

**Generar Documentos**
- Etiqueta de envío (para imprimir)
- Guía de rastreo (para cliente)
- Manifiesto (para conductor)

### Editar un Envío

**Click en ícono de lápiz (✏️)**
- Puedes modificar cualquier campo
- Los cambios quedan registrados
- Se notifica al cliente si hay cambios importantes

### Eliminar un Envío

**Click en ícono de basura (🗑️)**
- Solo disponible para administradores
- Pide confirmación
- El envío se marca como "cancelado" (no se borra, por auditoría)

### Filtros y Búsqueda

**Barra de Búsqueda**
- Por número de guía
- Por nombre de cliente
- Por ciudad de destino

**Filtros**
- **Por Estado**: Todos, Pendiente, En Tránsito, etc.
- **Por Fecha**: Hoy, Esta semana, Este mes, Personalizado
- **Por Destino**: Ciudad específica
- **Por Tipo de Servicio**: Estándar, Express, Económico

**Ordenar Por**
- Fecha de creación (más reciente primero)
- Número de guía (A-Z)
- Estado (agrupados)
- Destino (alfabético)

### Exportar Datos

**Botón "Exportar" (📥)**
- Descarga en Excel (.xlsx)
- Descarga en PDF
- Descarga en CSV
- Incluye todos los envíos filtrados

---

## 6. Gestión de Clientes

**Sección**: Clientes (Clients)

### ¿Qué es?
Base de datos de todos tus clientes (remitentes frecuentes).

### Crear un Nuevo Cliente

#### **Click en "Nuevo Cliente"**

**Formulario tiene dos tipos:**

**👤 Cliente Individual**
- Nombre completo
- Teléfono
- Email
- Dirección
- RFC (opcional)

**🏢 Cliente Empresa**
- Razón social
- Nombre comercial
- RFC obligatorio
- Contacto principal
- Teléfono corporativo
- Email corporativo
- Dirección fiscal
- Persona de contacto

**Información Adicional**
- Descuento especial (%)
- Método de pago preferido (Efectivo, Transferencia, Tarjeta)
- Notas internas
- Estado: Activo / Inactivo

### Ver Detalles de Cliente

**Click en cualquier cliente** para ver:

**📊 Resumen**
- Datos de contacto
- Total de envíos realizados
- Gasto total histórico
- Promedio de envíos por mes
- Última compra

**📦 Historial de Envíos**
- Todos los paquetes que ha enviado
- Filtros por fecha y estado
- Exportar a PDF/Excel

**💵 Historial de Pagos**
- Facturas pagadas
- Facturas pendientes
- Saldo a favor
- Descuentos aplicados

**📝 Notas**
- Agregar nota privada
- Historial de interacciones
- Recordatorios

### Editar Cliente

- Click en lápiz (✏️)
- Modifica datos
- Guardar cambios

### Eliminar Cliente

- Click en basura (🗑️)
- Solo si no tiene envíos activos
- Pide confirmación

### Filtros de Clientes

**Por Tipo**
- Todos
- Solo individuales
- Solo empresas

**Por Estado**
- Activos (con envíos recientes)
- Inactivos (sin envíos en 90+ días)

**Por Gasto**
- Ordenar por mayor gasto
- Top 10 clientes VIP

### Acciones Masivas

**Seleccionar múltiples clientes**
- Enviar email promocional
- Aplicar descuento especial
- Exportar contactos
- Marcar como VIP

---

## 7. Sistema de Facturación

**Sección**: Facturación (Invoices)

**⚠️ Requiere rol: Operador o superior**

### ¿Qué es?
Módulo para crear y gestionar facturas de los envíos.

### Crear Nueva Factura

#### **Click en "Nueva Factura"**

**Paso 1: Seleccionar Cliente**
- Búsqueda rápida por nombre
- O crear cliente nuevo

**Paso 2: Agregar Conceptos**

Por cada envío o servicio:
- **Descripción**: "Envío a Monterrey"
- **Cantidad**: 1
- **Precio Unitario**: $50.00 USD
- **Subtotal**: Se calcula automático

**Botón "Agregar Concepto"** para más líneas

**Paso 3: Calcular Totales**

El sistema suma automáticamente:
- **Subtotal**: Suma de conceptos
- **Descuento**: Si el cliente tiene descuento especial
- **IVA**: 16% (configurable)
- **Total**: Cantidad final

**Paso 4: Detalles de Pago**

- **Método de Pago**:
  - Efectivo
  - Transferencia bancaria
  - Tarjeta de crédito/débito
  - PayPal
  - Otro
- **Estado del Pago**:
  - Pendiente
  - Pagado
  - Parcialmente pagado
  - Vencido
- **Fecha de Vencimiento**: 15, 30, 60 días
- **Notas**: Información adicional

**Paso 5: Crear Factura**

- Click en "Crear Factura"
- Se genera número de factura: INV-2026-XXXX
- PDF se crea automáticamente

### Ver Factura

**Click en cualquier factura** para:

**📄 Vista Previa**
- Ver PDF generado
- Diseño profesional con logo de HoyMismo
- Todos los datos legales

**Opciones Disponibles**:
- **Descargar PDF**: Para enviar al cliente
- **Imprimir**: Copia física
- **Enviar por Email**: Directamente al cliente
- **Marcar como Pagada**: Si se recibió el pago
- **Registrar Pago Parcial**: Si pagó solo una parte
- **Anular**: Cancelar la factura (solo admin)

### Estados de Factura

Colores en la lista:

- 🟢 **Pagada** (Verde): Cliente ya pagó
- 🟡 **Pendiente** (Amarillo): Esperando pago
- 🟠 **Por Vencer** (Naranja): Faltan pocos días
- 🔴 **Vencida** (Rojo): Pasó fecha de vencimiento
- ⚫ **Anulada** (Gris): Cancelada

### Filtros de Facturación

**Por Estado de Pago**
- Todas
- Solo pagadas
- Solo pendientes
- Solo vencidas

**Por Cliente**
- Buscar por nombre
- Ver todas las facturas de un cliente

**Por Fecha**
- Este mes
- Mes pasado
- Rango personalizado

**Por Monto**
- Ordenar de mayor a menor
- Ordenar de menor a mayor

### Reportes de Facturación

**Botón "Reportes"**

Genera reportes de:
- **Ingresos Mensuales**: Comparativa mes a mes
- **Clientes Morosos**: Con facturas vencidas
- **Proyección de Ingresos**: Basado en pendientes
- **Top Clientes**: Por facturación
- **Método de Pago Preferido**: Estadísticas

---

## 8. Reportes y Análisis

**Sección**: Reportes (Reports)

**⚠️ Requiere rol: Manager o superior**

### ¿Qué es?
Herramientas avanzadas para analizar el desempeño del negocio.

### Tipos de Reportes

#### **📊 Reporte de Ventas**

**Qué muestra**:
- Ingresos diarios, semanales, mensuales
- Gráfico de tendencia
- Comparativa con períodos anteriores
- Crecimiento porcentual

**Filtros**:
- Rango de fechas
- Por ciudad de origen
- Por ciudad de destino
- Por tipo de servicio

**Exportar**:
- PDF para presentaciones
- Excel para análisis
- CSV para otros sistemas

#### **🚚 Reporte de Envíos**

**Qué muestra**:
- Total de envíos por período
- Distribución por estado
- Tiempos promedio de entrega
- Rutas más comunes
- Mapa de calor de destinos

**Métricas Clave**:
- **Tasa de Entrega**: % entregados exitosamente
- **Tiempo Promedio**: Días desde recolección a entrega
- **Envíos por Día**: Promedio diario
- **Tasa de Incidencias**: % con problemas

#### **👥 Reporte de Clientes**

**Qué muestra**:
- Clientes nuevos vs recurrentes
- Top 10 clientes VIP
- Análisis RFM (Recencia, Frecuencia, Monto)
- Clientes en riesgo de abandonar
- Tasa de retención

**Segmentación**:
- Clientes muy activos (5+ envíos/mes)
- Clientes activos (1-4 envíos/mes)
- Clientes ocasionales (<1 envío/mes)
- Clientes inactivos (sin envíos en 3 meses)

#### **💰 Reporte Financiero**

**Qué muestra**:
- Ingresos totales
- Costos operativos
- Margen de ganancia
- Flujo de efectivo
- Proyecciones

**Gráficos**:
- Ingresos vs Gastos (barras)
- Evolución mensual (línea)
- Distribución por tipo de servicio (pastel)

#### **⏱️ Reporte de Rendimiento**

**Qué muestra**:
- Tiempo promedio por etapa
- Demoras en aduana
- Eficiencia de rutas
- Comparativa con metas

**KPIs**:
- Envíos a tiempo: >95%
- Satisfacción del cliente: >4.5/5
- Tasa de reenvíos: <2%

### Dashboard de Análisis

**Vista Ejecutiva**

Panel con todos los KPIs importantes:
- Gráficos interactivos
- Click para profundizar
- Actualizados en tiempo real
- Alertas visuales si algo está fuera de rango

### Exportar Reportes

Cada reporte se puede:
- **Descargar PDF**: Para imprimir o presentar
- **Descargar Excel**: Para análisis adicional
- **Programar Email**: Recibir automáticamente cada semana/mes
- **Compartir Link**: Acceso temporal para socios

---

## 9. Portal de Clientes

**URL**: `https://hoymismodashboard.vercel.app/portal`

### ¿Qué es?
Una versión simplificada del dashboard que los clientes pueden usar para ver sus envíos.

### Acceso del Cliente

**Login de Cliente**
- Email registrado
- Contraseña creada por ellos
- O usar Google Auth

### Vista del Cliente

**Dashboard del Cliente**

El cliente ve:
- **Mis Envíos Activos**: Los que están en camino
- **Historial**: Todos sus envíos pasados
- **Perfil**: Sus datos de contacto
- **Facturas**: Pendientes de pago

**Funciones Disponibles**:
- Ver detalles de cada envío
- Rastrear en tiempo real
- Descargar facturas
- Actualizar perfil
- Ver historial completo

**Limitaciones** (vs. dashboard admin):
- Solo ve SUS envíos (no los de otros)
- No puede crear envíos (debe contactar a HoyMismo)
- No puede modificar estados
- No puede eliminar

### Notificaciones al Cliente

**El cliente recibe notificaciones cuando**:
- Se crea un envío a su nombre
- El paquete cambia de estado
- El paquete está por llegar
- El paquete fue entregado
- Hay una incidencia

**Canales de notificación**:
- Email automático
- SMS (si está configurado)
- Notificación en la app

---

## 10. Asistente de IA

**Botón**: Ícono 🤖 en barra superior

### ¿Qué es?
Un chatbot inteligente que te ayuda con tareas comunes usando inteligencia artificial.

### Cómo Usarlo

**Click en ícono del robot** para abrir el chat

**Ventana emergente** aparece a la derecha

### Cosas que Puedes Preguntarle:

#### **📊 Consultas de Datos**

```
"¿Cuántos envíos tengo hoy?"
"¿Quiénes son mis top 5 clientes?"
"¿Cuánto he facturado este mes?"
"Muéstrame los envíos pendientes"
```

#### **🔍 Búsquedas**

```
"Busca el envío HM-2026-123456"
"¿Dónde está el paquete de Juan Pérez?"
"Muéstrame los envíos a Monterrey"
```

#### **📝 Creación Rápida**

```
"Crea un envío para María González a Guadalajara"
"Registra un nuevo cliente: Empresa ABC"
```

#### **📈 Análisis**

```
"¿Cuál es mi tasa de entrega este mes?"
"Compara las ventas de enero vs febrero"
"¿Qué ruta es más rentable?"
```

#### **❓ Ayuda**

```
"¿Cómo marco un envío como entregado?"
"¿Cómo creo una factura?"
"Explícame el sistema de reportes"
```

### Respuestas del AI

El asistente:
- Responde en lenguaje natural
- Proporciona enlaces directos a secciones
- Muestra tablas y gráficos
- Hace sugerencias inteligentes
- Aprende de tus preguntas frecuentes

### Comandos Especiales

**Atajos rápidos**:
- `/nuevo-envio`: Abre formulario
- `/buscar [guía]`: Busca envío
- `/stats`: Muestra estadísticas del día
- `/help`: Lista de comandos

---

## 11. Configuración y Usuarios

### Configuración del Sistema

**Sección**: Configuración (Settings)

**⚠️ Requiere rol: Manager o superior**

#### **🏢 Información de la Empresa**

- Nombre legal
- RFC
- Dirección fiscal
- Teléfonos
- Emails
- Redes sociales
- Logo (subir imagen)

#### **💰 Configuración de Precios**

**Tarifas por Tipo de Servicio**:
- Estándar: $X por kg
- Express: $X por kg
- Económico: $X por kg

**Cálculo de Costo**:
- Peso volumétrico
- Distancia
- Zonas (local, regional, nacional, internacional)
- Recargos especiales

**Descuentos**:
- Por volumen (10+ envíos/mes)
- Clientes VIP
- Promociones temporales

#### **🔔 Notificaciones**

**Email**:
- Servidor SMTP
- Plantillas de email
- Firma automática

**SMS** (opcional):
- Proveedor de SMS
- API Key
- Plantillas de mensajes

**WhatsApp** (opcional):
- API de WhatsApp Business
- Plantillas aprobadas

#### **🗺️ Zonas y Rutas**

**Ciudades Disponibles**:
- Agregar nuevas ciudades
- Coordenadas GPS
- Zona tarifaria

**Rutas Predefinidas**:
- Houston → Monterrey
- Houston → Guadalajara
- Etc.

**Tiempos Estimados**:
- Por ruta y tipo de servicio

#### **📄 Documentos y Plantillas**

**Subir Plantillas**:
- Etiqueta de envío (.docx)
- Factura (.pdf)
- Guía de rastreo (.html)
- Manifiesto (.xlsx)

**Variables Disponibles**:
```
{{numero_guia}}
{{nombre_cliente}}
{{direccion_destino}}
{{fecha_entrega}}
```

#### **🔐 Seguridad**

**Políticas de Contraseñas**:
- Longitud mínima
- Requiere mayúsculas/números
- Expiración cada X días

**Sesiones**:
- Tiempo de inactividad
- Dispositivos permitidos
- Ubicaciones bloqueadas

**Auditoría**:
- Log de todas las acciones
- Quién hizo qué y cuándo
- Exportar logs

### Gestión de Usuarios

**Sección**: Usuarios (Users)

**⚠️ Requiere rol: Admin**

#### **Crear Usuario**

**Click en "Nuevo Usuario"**

**Formulario**:
- Nombre completo
- Email corporativo
- Contraseña temporal (deberá cambiarla)
- Rol (ver sección 12)
- Permisos específicos
- Foto de perfil (opcional)

**Enviar Invitación**:
- Email con credenciales
- Link para activar cuenta
- Instrucciones de primer acceso

#### **Editar Usuario**

- Cambiar rol
- Activar/desactivar cuenta
- Resetear contraseña
- Modificar permisos

#### **Eliminar Usuario**

- Solo desactiva (no elimina por auditoría)
- Historial de acciones permanece
- Puede reactivarse después

#### **Monitorear Actividad**

**Por Usuario**:
- Último acceso
- Acciones del día
- Envíos creados
- Errores cometidos

**Vista General**:
- Usuarios activos ahora
- Horas pico de uso
- Eficiencia por usuario

---

## 12. Roles y Permisos

### Jerarquía de Roles

#### **👁️ Viewer (Observador)**

**Puede**:
- Ver dashboard
- Ver envíos
- Ver clientes
- Rastrear paquetes
- Descargar reportes

**NO Puede**:
- Crear, editar o eliminar nada
- Acceder a facturación
- Ver configuración

**Ideal para**:
- Personal de atención al cliente
- Consultores externos
- Practicantes

---

#### **⚙️ Operator (Operador)**

**Puede todo lo de Viewer, más**:
- Crear envíos
- Actualizar estados
- Crear y editar clientes
- Ver facturación
- Generar etiquetas

**NO Puede**:
- Eliminar envíos
- Anular facturas
- Acceder a reportes avanzados
- Modificar configuración
- Gestionar usuarios

**Ideal para**:
- Personal de almacén
- Repartidores
- Operadores de call center

---

#### **📊 Manager (Gerente)**

**Puede todo lo de Operator, más**:
- Eliminar envíos
- Crear y anular facturas
- Acceder a todos los reportes
- Configurar precios
- Ver análisis financieros

**NO Puede**:
- Modificar configuración de seguridad
- Crear o eliminar usuarios
- Cambiar roles

**Ideal para**:
- Gerentes de sucursal
- Coordinadores de operaciones
- Jefes de área

---

#### **👑 Admin (Administrador)**

**Puede TODO**:
- Acceso completo al sistema
- Crear y eliminar usuarios
- Modificar roles
- Configurar sistema completo
- Acceso a logs de auditoría
- Configuración de seguridad

**Ideal para**:
- Director General
- Gerente de TI
- Propietarios

---

### Permisos Personalizados

Adicionalmente, se pueden dar permisos específicos:

- ✅ Ver datos financieros
- ✅ Exportar datos
- ✅ Enviar notificaciones masivas
- ✅ Aplicar descuentos
- ✅ Acceder a API
- ✅ Modificar históricos

---

## 13. Tips y Mejores Prácticas

### 📝 Para Crear Envíos

✅ **DO (Hacer)**:
- Verifica que la dirección esté completa
- Incluye referencias (entre calles, color de casa)
- Agrega teléfono del receptor para coordinar
- Toma foto del paquete antes de enviarlo
- Describe bien el contenido

❌ **DON'T (No Hacer)**:
- Dejar campos vacíos
- Poner direcciones ambiguas ("cerca del parque")
- Olvidar el peso real (causa problemas)
- Prometer fechas que no podemos cumplir

### 📞 Para Atención al Cliente

✅ **DO (Hacer)**:
- Actualiza el estado en tiempo real
- Agrega notas al historial de movimientos
- Responde rápido (usa el AI para ayuda)
- Sé proactivo con notificaciones
- Mantén al cliente informado

❌ **DON'T (No Hacer)**:
- Olvidar actualizar estados
- Dar información contradictoria
- Prometer sin verificar
- Ignorar incidencias

### 💰 Para Facturación

✅ **DO (Hacer)**:
- Factura inmediatamente después del envío
- Verifica datos fiscales del cliente
- Envía factura por email automáticamente
- Da seguimiento a pagos pendientes
- Aplica descuentos solo si están aprobados

❌ **DON'T (No Hacer)**:
- Acumular muchas facturas pendientes
- Crear facturas sin autorización
- Dar descuentos sin aprobar
- Olvidar hacer cobro

### 📊 Para Reportes

✅ **DO (Hacer)**:
- Revisa reportes semanalmente
- Compara con períodos anteriores
- Identifica tendencias
- Actúa sobre datos (no solo los veas)
- Comparte insights con el equipo

❌ **DON'T (No Hacer)**:
- Ignorar alertas rojas
- Tomar decisiones sin datos
- Confiar solo en intuición
- Dejar de revisar métricas

### 🔐 Para Seguridad

✅ **DO (Hacer)**:
- Usa contraseñas fuertes
- Cierra sesión al terminar
- No compartas tu usuario
- Reporta actividad sospechosa
- Actualiza tu contraseña regularmente

❌ **DON'T (No Hacer)**:
- Dejar sesión abierta en computadora compartida
- Dar tu contraseña a compañeros
- Acceder desde redes públicas sin VPN
- Ignorar alertas de seguridad

---

## 🆘 Soporte y Ayuda

### ¿Necesitas Ayuda?

#### **Dentro del Sistema**

1. **Asistente de IA** 🤖
   - Disponible 24/7
   - Click en ícono de robot
   - Pregunta lo que necesites

2. **Tooltips (Info)**
   - Ícono ℹ️ en campos
   - Pasa mouse sobre ellos
   - Explica qué va en cada campo

3. **Videos Tutorial**
   - En cada sección hay un link
   - Videos de 2-3 minutos
   - Paso a paso visual

#### **Contacto Directo**

**Email de Soporte**
```
soporte@hoymismo.com
```
- Respuesta en menos de 4 horas
- Adjunta screenshots si hay error

**WhatsApp**
```
+52 XXX XXX XXXX
```
- Atención en horario laboral
- Respuesta inmediata

**Teams/Slack**
- Canal: #soporte-dashboard
- Comunidad de usuarios
- Ayuda entre compañeros

### Reportar un Bug

Si encuentras un error:

1. **Toma screenshot** de la pantalla
2. **Anota qué estabas haciendo** cuando pasó
3. **Envía a soporte** con:
   - Tu nombre de usuario
   - Hora aproximada
   - Descripción del problema
   - Screenshot

### Solicitar Nueva Función

¿Necesitas algo que no existe?

1. **Describe la necesidad**
   - ¿Qué quieres hacer?
   - ¿Por qué lo necesitas?
   - ¿Cómo te ayudaría?

2. **Envía sugerencia**
   - Email a: mejoras@hoymismo.com
   - O usa formulario en Configuración

3. **Evaluación**
   - El equipo revisa tu solicitud
   - Si es aprobada, se agrega al roadmap
   - Te notificamos cuando esté lista

---

## 📅 Actualizaciones del Sistema

### Historial de Versiones

La plataforma se actualiza continuamente:

**Enero 2026**
- ✅ Integración con Mapbox para mapas premium
- ✅ Asistente de IA mejorado
- ✅ Sistema de rastreo público rediseñado
- ✅ Coordenadas predefinidas para 50+ ciudades

**Diciembre 2025**
- ✅ Portal de clientes con Google Auth
- ✅ Reportes financieros avanzados
- ✅ Exportar datos en múltiples formatos

**Noviembre 2025**
- ✅ Sistema de facturación automatizado
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de roles y permisos

### Próximas Funciones

🔜 **En Desarrollo**:
- App móvil nativa (iOS y Android)
- Firma digital en entregas
- Chat en vivo con clientes
- Integración con PayPal
- API pública para partners

---

## 🎓 Certificación de Usuario

### Programa de Capacitación

HoyMismo ofrece certificación para usuarios:

**Nivel 1: Operador Básico** (2 horas)
- Navegación del sistema
- Crear envíos
- Actualizar estados
- Atención al cliente

**Nivel 2: Operador Avanzado** (4 horas)
- Facturación
- Gestión de clientes
- Reportes básicos
- Resolución de incidencias

**Nivel 3: Gerente** (8 horas)
- Análisis de datos
- Reportes avanzados
- Configuración del sistema
- Gestión de equipo

**Nivel 4: Administrador** (12 horas)
- Todo lo anterior
- Seguridad y auditoría
- Gestión de usuarios
- Optimización del sistema

### Evaluación

Al terminar cada nivel:
- Examen teórico (70% mínimo)
- Ejercicio práctico
- Certificado digital

---

## 📞 Contactos Importantes

### Equipo de HoyMismo

**Soporte Técnico**
- Email: soporte@hoymismo.com
- Tel: +52 XXX XXX XXXX
- Horario: Lun-Vie 8AM-8PM, Sáb 9AM-2PM

**Ventas**
- Email: ventas@hoymismo.com
- Tel: +52 XXX XXX XXXX

**Administración**
- Email: admin@hoymismo.com
- Tel: +52 XXX XXX XXXX

**Emergencias**
- Tel: +52 XXX XXX XXXX (24/7)
- Solo para incidencias críticas

---

## ✅ Checklist de Inicio

### Tu Primera Semana

**Día 1: Familiarización**
- [ ] Login exitoso
- [ ] Tour por el dashboard
- [ ] Explorar secciones
- [ ] Probar asistente de IA

**Día 2: Práctica Básica**
- [ ] Crear envío de prueba
- [ ] Actualizar estado
- [ ] Buscar envío
- [ ] Ver detalles

**Día 3: Clientes**
- [ ] Crear cliente
- [ ] Editar cliente
- [ ] Ver historial
- [ ] Aplicar filtros

**Día 4: Facturación**
- [ ] Crear factura
- [ ] Descargar PDF
- [ ] Marcar como pagada
- [ ] Enviar por email

**Día 5: Reportes**
- [ ] Ver reporte de ventas
- [ ] Exportar a Excel
- [ ] Analizar métricas
- [ ] Identificar tendencias

---

## 🎉 ¡Listo!

Ahora conoces toda la plataforma HoyMismo de principio a fin.

**Recuerda**:
- 🤖 El AI está para ayudarte
- 📚 Esta guía siempre disponible
- 👥 El equipo está aquí para apoyarte
- 📈 La práctica hace al maestro

**¡Bienvenido al equipo HoyMismo!** 🚀

---

*Última actualización: Enero 2026*
*Versión: 1.0*
*Documento creado con [Claude Code](https://claude.com/claude-code)*
