# Manual de Capacitación - HoyMismo Dashboard
## Sistema de Gestión de Paquetería

**Versión:** 1.0
**Fecha:** Diciembre 2024
**Dirigido a:** Personal operativo y administrativo

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Navegación Principal](#3-navegación-principal)
4. [Gestión de Clientes](#4-gestión-de-clientes)
5. [Gestión de Envíos](#5-gestión-de-envíos)
6. [Sistema de Rastreo](#6-sistema-de-rastreo)
7. [Generación de Documentos](#7-generación-de-documentos)
8. [Reportes y Estadísticas](#8-reportes-y-estadísticas)
9. [Asistente Virtual con IA](#9-asistente-virtual-con-ia)
10. [Configuración del Sistema](#10-configuración-del-sistema)
11. [Casos de Uso Comunes](#11-casos-de-uso-comunes)
12. [Preguntas Frecuentes](#12-preguntas-frecuentes)
13. [Soporte Técnico](#13-soporte-técnico)

---

## 1. Introducción

### ¿Qué es HoyMismo Dashboard?

HoyMismo Dashboard es el sistema centralizado de gestión de paquetería que permite administrar todos los aspectos del negocio de envíos internacionales entre Estados Unidos, México y Centroamérica.

### Objetivos del Sistema

- **Centralizar** toda la información de clientes y envíos
- **Automatizar** procesos de facturación y etiquetado
- **Facilitar** el seguimiento en tiempo real de paquetes
- **Optimizar** la toma de decisiones con reportes analíticos
- **Mejorar** el servicio al cliente con herramientas de comunicación

### Beneficios Principales

✅ Acceso desde cualquier dispositivo con internet
✅ Actualizaciones en tiempo real
✅ Respaldo automático de información
✅ Generación instantánea de documentos
✅ Asistente virtual inteligente 24/7

---

## 2. Acceso al Sistema

### Requisitos Técnicos Mínimos

- **Navegador web:** Chrome, Firefox, Safari o Edge (versiones recientes)
- **Conexión a internet:** Banda ancha estable
- **Resolución de pantalla:** Mínimo 1280x720 píxeles
- **Sistema operativo:** Windows, macOS, Linux, iOS o Android

### Proceso de Inicio de Sesión

1. **Abrir el navegador web**
   - Escribir la dirección: `https://hoymismodashboard.vercel.app`

2. **Acceder al Dashboard**
   - Click en el botón "Dashboard" en la esquina superior derecha
   - O navegar directamente a `/dashboard`

3. **Autenticación**
   - El sistema utiliza autenticación de Google Firebase
   - Ingresa tus credenciales corporativas proporcionadas
   - Si es tu primer acceso, contacta al administrador para activación

### Cerrar Sesión de Forma Segura

1. Click en tu avatar/foto en la esquina superior derecha
2. Seleccionar "Cerrar Sesión"
3. Siempre cierra sesión al terminar, especialmente en computadoras compartidas

---

## 3. Navegación Principal

### Menú Lateral (Sidebar)

El sistema cuenta con 6 secciones principales accesibles desde el menú izquierdo:

#### 📦 Envíos
- **Función:** Gestión completa de todos los envíos
- **Acceso rápido:** Click en el ícono de paquete
- **Vista:** Tabla con todos los envíos activos e históricos

#### 👥 Clientes
- **Función:** Base de datos de clientes
- **Acceso rápido:** Click en el ícono de personas
- **Vista:** Lista completa con datos de contacto y estadísticas

#### 📊 Reportes
- **Función:** Análisis y métricas del negocio
- **Acceso rápido:** Click en el ícono de gráficas
- **Vista:** Dashboard con KPIs y gráficos interactivos

#### 💬 Chat IA
- **Función:** Asistente virtual inteligente
- **Acceso rápido:** Click en el ícono de mensaje
- **Vista:** Interfaz de conversación

#### ⚙️ Configuración
- **Función:** Ajustes del sistema
- **Acceso rápido:** Click en el ícono de engranaje
- **Vista:** Paneles de configuración

### Barra Superior (Header)

- **Título de sección actual:** Muestra dónde te encuentras
- **Avatar/Foto:** Acceso a perfil y cierre de sesión
- **Notificaciones:** Alertas importantes del sistema

### Diseño Responsivo

El sistema se adapta automáticamente a diferentes tamaños de pantalla:
- **Escritorio:** Menú lateral visible permanentemente
- **Tablet:** Menú colapsable
- **Móvil:** Menú hamburguesa (☰)

---

## 4. Gestión de Clientes

### 4.1 Visualización de Clientes

**Ruta:** Dashboard → Clientes

#### Información Mostrada

La tabla de clientes muestra:
- **Nombre completo**
- **Email**
- **Teléfono**
- **Dirección**
- **Ciudad, Estado, Código Postal**
- **Total de envíos realizados**
- **Acciones disponibles**

#### Funciones de Búsqueda

- **Barra de búsqueda:** Filtra por nombre, email o teléfono
- **Filtros:** Por ciudad, estado o número de envíos
- **Ordenamiento:** Click en encabezados de columnas

### 4.2 Crear Nuevo Cliente

**Pasos:**

1. Click en botón "**+ Nuevo Cliente**" (esquina superior derecha)
2. Completar el formulario modal:

**Información Básica:**
```
- Nombre completo *
- Email *
- Teléfono *
```

**Dirección:**
```
- Calle y número *
- Ciudad *
- Estado *
- Código Postal *
- País * (seleccionar de lista)
```

**Notas:**
```
- Notas adicionales (opcional)
- Información de facturación
- Preferencias de envío
```

3. Click en "**Guardar Cliente**"
4. Confirmación: El sistema mostrará mensaje de éxito

**Campos obligatorios marcados con asterisco (*)**

### 4.3 Editar Cliente Existente

**Pasos:**

1. Localizar al cliente en la tabla
2. Click en botón "**Editar**" (ícono de lápiz)
3. Modificar la información necesaria
4. Click en "**Actualizar Cliente**"
5. Los cambios se guardan automáticamente en la base de datos

### 4.4 Eliminar Cliente

**⚠️ ADVERTENCIA:** Esta acción es permanente

**Pasos:**

1. Click en botón "**Eliminar**" (ícono de basura)
2. Confirmar en el diálogo de seguridad
3. El cliente se eliminará de la base de datos

**Nota:** No se pueden eliminar clientes con envíos activos

### 4.5 Ver Detalles y Historial

**Pasos:**

1. Click en el nombre del cliente (enlace azul)
2. Se abrirá modal con:
   - **Información completa del cliente**
   - **Historial de envíos**
   - **Total gastado**
   - **Envíos en tránsito**
   - **Envíos completados**

---

## 5. Gestión de Envíos

### 5.1 Visualización de Envíos

**Ruta:** Dashboard → Envíos

#### Información de Cada Envío

- **ID de Envío:** Número único (HM-XXXX-XXXX)
- **Cliente:** Nombre del remitente
- **Origen → Destino:** Ciudades y estados
- **Estado actual:** Badge con color según estatus
- **Fecha de creación**
- **Fecha estimada de entrega**
- **Acciones disponibles**

#### Estados de Envío (con colores)

| Estado | Color | Significado |
|--------|-------|-------------|
| 🟡 Pendiente | Amarillo | Esperando recolección |
| 🔵 En Tránsito | Azul | En camino al destino |
| 🟠 En Aduana | Naranja | Proceso aduanal |
| 🟣 En Distribución | Púrpura | Última milla de entrega |
| 🟢 Entregado | Verde | Completado exitosamente |
| 🔴 Cancelado | Rojo | Cancelado por usuario |

### 5.2 Crear Nuevo Envío

**Pasos Detallados:**

1. Click en "**+ Nuevo Envío**"

2. **Sección 1: Seleccionar o Crear Cliente**
   - Buscar cliente existente en el dropdown
   - O click en "Crear nuevo cliente" para abrir formulario

3. **Sección 2: Información del Paquete**
   ```
   - Peso (lb) *
   - Dimensiones (largo x ancho x alto en pulgadas) *
   - Tipo de contenido *
   - Valor declarado (USD) *
   - Descripción del contenido *
   ```

4. **Sección 3: Origen**
   ```
   - Dirección completa *
   - Ciudad *
   - Estado *
   - Código Postal *
   - País *
   ```

5. **Sección 4: Destino**
   ```
   - Dirección completa *
   - Ciudad *
   - Estado *
   - Código Postal *
   - País *
   - Nombre del destinatario *
   - Teléfono del destinatario *
   ```

6. **Sección 5: Opciones de Envío**
   ```
   - Tipo de servicio (Express, Estándar, Económico)
   - Seguro adicional (checkbox)
   - Entrega con firma (checkbox)
   - Instrucciones especiales (texto)
   ```

7. Click en "**Crear Envío**"

8. **Resultado:**
   - Se genera automáticamente:
     - ID único de envío
     - Número de rastreo
     - Etiqueta de envío (PDF)
     - Factura (PDF)

### 5.3 Actualizar Estado de Envío

**Método 1: Desde la Tabla**

1. Click en el dropdown de estado
2. Seleccionar nuevo estado
3. Se actualiza automáticamente

**Método 2: Desde Detalles**

1. Click en "Ver Detalles"
2. En el modal, usar dropdown de estado
3. Agregar nota opcional del cambio
4. Click en "Actualizar"

### 5.4 Agregar Eventos de Rastreo

**Pasos:**

1. Abrir detalles del envío
2. Ir a pestaña "**Tracking**"
3. Click en "**+ Agregar Evento**"
4. Completar:
   ```
   - Fecha y hora *
   - Ubicación *
   - Descripción del evento *
   - Estado asociado
   ```
5. Guardar

**Eventos comunes:**
- "Paquete recolectado en origen"
- "En tránsito hacia hub de distribución"
- "Llegó a aduana"
- "Liberado de aduana"
- "En ruta de entrega local"
- "Entregado - Firmado por: [nombre]"

### 5.5 Generar Documentos

**Desde Detalles del Envío:**

#### Etiqueta de Envío
1. Click en "**Generar Etiqueta**"
2. Se descarga PDF automáticamente
3. Imprimir en papel adhesivo tamaño carta
4. Colocar en paquete

#### Factura
1. Click en "**Generar Factura**"
2. Se descarga PDF con:
   - Datos del cliente
   - Desglose de costos
   - Total a pagar
   - Código QR de tracking

### 5.6 Cancelar Envío

**⚠️ Solo permitido para envíos en estado "Pendiente"**

**Pasos:**

1. Abrir detalles del envío
2. Click en botón "**Cancelar Envío**"
3. Ingresar motivo de cancelación
4. Confirmar acción
5. El estado cambia a "Cancelado"

---

## 6. Sistema de Rastreo

### 6.1 Portal Público de Rastreo

**URL:** `https://hoymismodashboard.vercel.app/rastreo`

#### Funcionalidad

- Permite a **clientes finales** rastrear sus paquetes
- **No requiere** inicio de sesión
- Búsqueda por **número de guía/tracking**

#### Información Mostrada

1. **Datos del envío:**
   - ID de envío
   - Origen y destino
   - Estado actual
   - Fecha estimada de entrega

2. **Timeline visual:**
   - Todos los eventos registrados
   - Fechas y horas
   - Ubicaciones
   - Descripciones

3. **Resumen ejecutivo con IA:**
   - Análisis inteligente del estado
   - Tiempo estimado de llegada
   - Recomendaciones

### 6.2 Rastreo desde el Dashboard

**Ruta:** Dashboard → Envíos → [Seleccionar envío] → Pestaña "Tracking"

**Ventajas:**
- Vista completa del historial
- Capacidad de editar eventos
- Agregar notas internas
- Exportar historial

### 6.3 Notificaciones de Rastreo

El sistema puede configurarse para enviar notificaciones automáticas:
- Email al cliente en cada cambio de estado
- SMS para eventos críticos
- Alertas de retrasos

**Configuración:** Dashboard → Configuración → Notificaciones

---

## 7. Generación de Documentos

### 7.1 Etiquetas de Envío

#### Contenido de la Etiqueta

```
┌─────────────────────────────────────┐
│ HOYMISMO PAQUETERÍA                 │
│ [Logo]                              │
├─────────────────────────────────────┤
│ ORIGEN:                             │
│ [Dirección completa]                │
│                                     │
│ DESTINO:                            │
│ [Dirección completa]                │
│ Destinatario: [Nombre]              │
│ Tel: [Teléfono]                     │
├─────────────────────────────────────┤
│ ID: HM-XXXX-XXXX                    │
│ Peso: XX lb                         │
│ [Código de barras]                  │
│ [Código QR]                         │
└─────────────────────────────────────┘
```

#### Especificaciones de Impresión

- **Tamaño:** Carta (8.5" x 11")
- **Formato:** PDF
- **Orientación:** Vertical
- **Márgenes:** 0.5" en todos los lados
- **Papel recomendado:** Adhesivo para etiquetas

### 7.2 Facturas

#### Contenido de la Factura

1. **Encabezado:**
   - Logo de HoyMismo
   - Información fiscal de la empresa
   - Número de factura
   - Fecha de emisión

2. **Datos del Cliente:**
   - Nombre o razón social
   - Dirección
   - RFC/Tax ID (si aplica)

3. **Detalle del Servicio:**
   - ID de envío
   - Descripción del servicio
   - Origen → Destino
   - Peso y dimensiones
   - Tarifa base
   - Cargos adicionales (seguro, combustible, etc.)

4. **Totales:**
   - Subtotal
   - IVA/Taxes (si aplica)
   - **Total a pagar**

5. **Pie de página:**
   - Términos y condiciones
   - Métodos de pago aceptados
   - Información de contacto
   - Código QR para rastreo

#### Exportar Facturas

**Formatos disponibles:**
- PDF (recomendado para impresión)
- Excel/CSV (para contabilidad)

**Descarga masiva:**
1. Dashboard → Reportes → Facturación
2. Seleccionar rango de fechas
3. Click en "Exportar Facturas"
4. Descargar archivo ZIP con todos los PDFs

---

## 8. Reportes y Estadísticas

### 8.1 Dashboard de Métricas

**Ruta:** Dashboard → Reportes

#### KPIs Principales (Parte Superior)

**Tarjetas de Métricas:**

1. **Total de Envíos**
   - Número total del mes actual
   - Comparación con mes anterior (% cambio)
   - Indicador visual (↑ o ↓)

2. **Ingresos**
   - Total facturado del mes
   - Promedio por envío
   - Tendencia vs mes anterior

3. **Clientes Activos**
   - Clientes que hicieron envíos este mes
   - Nuevos clientes este mes
   - Tasa de retención

4. **Tasa de Entrega**
   - % de envíos entregados a tiempo
   - Tiempo promedio de entrega
   - Benchmark vs objetivo

### 8.2 Gráficos Analíticos

#### Gráfico de Envíos por Día
- **Tipo:** Línea temporal
- **Período:** Últimos 30 días
- **Muestra:** Volumen diario de envíos
- **Interactivo:** Hover para ver detalles

#### Distribución por Estado
- **Tipo:** Gráfico de dona (donut)
- **Muestra:** Porcentaje de envíos en cada estado
- **Colores:** Mismo código que badges de estado
- **Click:** Filtra tabla de envíos

#### Ingresos por Mes
- **Tipo:** Barras verticales
- **Período:** Últimos 12 meses
- **Muestra:** Ingresos mensuales
- **Objetivo:** Línea de meta opcional

#### Top Clientes
- **Tipo:** Tabla ranking
- **Ordena por:** Número de envíos o monto gastado
- **Top:** 10 mejores clientes
- **Acción:** Click para ver detalles del cliente

### 8.3 Filtros de Reportes

**Panel de Filtros (Izquierda):**

```
📅 Rango de Fechas
   ├─ Últimos 7 días
   ├─ Últimos 30 días
   ├─ Este mes
   ├─ Mes anterior
   ├─ Este año
   └─ Personalizado (selector de fechas)

📊 Estado de Envío
   ├─ Todos
   ├─ Pendiente
   ├─ En Tránsito
   ├─ En Aduana
   ├─ En Distribución
   ├─ Entregado
   └─ Cancelado

🌍 Ubicación
   ├─ País de origen
   ├─ País de destino
   ├─ Estado/Provincia
   └─ Ciudad

💵 Rango de Monto
   ├─ Mínimo
   └─ Máximo
```

**Aplicar Filtros:**
1. Seleccionar opciones deseadas
2. Click en "Aplicar Filtros"
3. Todos los gráficos se actualizan automáticamente

### 8.4 Exportar Reportes

**Opciones de Exportación:**

1. **Excel (.xlsx)**
   - Incluye todas las tablas
   - Gráficos como imágenes
   - Múltiples hojas

2. **PDF**
   - Documento formateado
   - Gráficos de alta resolución
   - Ideal para presentaciones

3. **CSV**
   - Datos crudos
   - Para análisis externo
   - Compatible con Excel/Google Sheets

**Proceso:**
1. Aplicar filtros deseados
2. Click en botón "Exportar"
3. Seleccionar formato
4. Descargar archivo

---

## 9. Asistente Virtual con IA

### 9.1 Introducción al Chat IA

**Ruta:** Dashboard → Chat IA

#### ¿Qué puede hacer?

El asistente virtual utiliza inteligencia artificial para:
- ✅ Responder preguntas sobre envíos
- ✅ Proporcionar información de clientes
- ✅ Generar resúmenes ejecutivos
- ✅ Ayudar con tareas administrativas
- ✅ Explicar procedimientos
- ✅ Consultar estadísticas

### 9.2 Cómo Usar el Chat

#### Interfaz del Chat

```
┌─────────────────────────────────────┐
│ 🤖 Asistente HoyMismo              │
├─────────────────────────────────────┤
│                                     │
│  [Historial de conversación]       │
│                                     │
│  Usuario: [Tu mensaje]              │
│  Asistente: [Respuesta]             │
│                                     │
├─────────────────────────────────────┤
│ [Escribe tu mensaje aquí...]    [→]│
└─────────────────────────────────────┘
```

#### Proceso de Uso

1. **Escribir pregunta o comando**
2. **Presionar Enter** o click en botón enviar (→)
3. **Esperar respuesta** (usualmente 2-5 segundos)
4. **Continuar conversación** si es necesario

### 9.3 Ejemplos de Preguntas Útiles

#### Consultas sobre Envíos

```
"¿Cuántos envíos tengo pendientes?"
"Muéstrame los envíos de esta semana"
"¿Dónde está el envío HM-2024-0123?"
"¿Cuáles envíos están retrasados?"
"Dame un resumen de envíos a México"
```

#### Consultas sobre Clientes

```
"¿Cuántos clientes tengo registrados?"
"Muéstrame información de [nombre cliente]"
"¿Qué cliente tiene más envíos?"
"Lista de clientes en Texas"
"Clientes que enviaron este mes"
```

#### Consultas de Negocio

```
"¿Cuánto he facturado este mes?"
"¿Cuál es mi ingreso promedio por envío?"
"Compara este mes con el anterior"
"¿Cuál es mi tasa de entrega?"
"Tendencia de envíos últimos 3 meses"
```

#### Ayuda Operativa

```
"¿Cómo creo un nuevo envío?"
"Explícame el proceso de rastreo"
"¿Qué documentos necesito generar?"
"Ayuda con la facturación"
"Procedimiento para cancelar envío"
```

### 9.4 Comandos Especiales

#### Búsqueda de Tracking

```
Usuario: "Tracking HM-2024-0123"
Asistente: [Muestra estado actual, ubicación,
            historial completo y análisis]
```

#### Resúmenes Ejecutivos

```
Usuario: "Resumen ejecutivo del mes"
Asistente: [Genera análisis completo con KPIs,
            tendencias y recomendaciones]
```

#### Generación de Reportes

```
Usuario: "Reporte de envíos de enero"
Asistente: [Crea reporte detallado con
            estadísticas y gráficos]
```

### 9.5 Mejores Prácticas

**✅ Hacer:**
- Ser específico en las preguntas
- Proporcionar IDs o nombres exactos cuando sea necesario
- Usar lenguaje natural
- Hacer preguntas de seguimiento para clarificar

**❌ Evitar:**
- Preguntas muy generales o ambiguas
- Solicitar información sensible o confidencial
- Esperar que el IA tome decisiones de negocio
- Depender 100% del IA sin verificar información crítica

### 9.6 Limitaciones

- El asistente accede a datos hasta el momento actual
- No puede modificar directamente la base de datos
- Respuestas basadas en información disponible en el sistema
- Para operaciones críticas, siempre verificar manualmente

---

## 10. Configuración del Sistema

### 10.1 Configuración General

**Ruta:** Dashboard → Configuración → General

#### Información de la Empresa

```
- Nombre legal de la empresa
- RFC/Tax ID
- Dirección fiscal
- Teléfono principal
- Email de contacto
- Sitio web
- Logo de la empresa (upload de imagen)
```

#### Preferencias de Sistema

```
- Zona horaria
- Formato de fecha (DD/MM/YYYY o MM/DD/YYYY)
- Moneda predeterminada (USD, MXN, etc.)
- Idioma de interfaz (Español/English)
- Tema (Claro/Oscuro/Auto)
```

### 10.2 Configuración de Notificaciones

**Ruta:** Dashboard → Configuración → Notificaciones

#### Notificaciones por Email

**Para Clientes:**
```
☑ Confirmación de envío creado
☑ Paquete recolectado
☑ En tránsito
☑ Llegada a aduana
☐ Liberado de aduana
☑ En ruta de entrega
☑ Entregado
☐ Retrasos o excepciones
```

**Para Administradores:**
```
☑ Nuevo cliente registrado
☑ Nuevo envío creado
☑ Envío cancelado
☑ Problemas en aduana
☑ Reportes diarios/semanales
```

#### Plantillas de Email

- Personalizar asunto y cuerpo de mensajes
- Incluir variables dinámicas (nombre, tracking, etc.)
- Vista previa antes de activar

### 10.3 Configuración de Precios

**Ruta:** Dashboard → Configuración → Tarifas

#### Tarifas Base

```
Destino: [Seleccionar país]

┌──────────────────┬──────────┬──────────┐
│ Peso (lb)        │ Estándar │ Express  │
├──────────────────┼──────────┼──────────┤
│ 0 - 5            │ $X.XX    │ $X.XX    │
│ 6 - 10           │ $X.XX    │ $X.XX    │
│ 11 - 20          │ $X.XX    │ $X.XX    │
│ 21 - 50          │ $X.XX    │ $X.XX    │
│ 51+              │ $X.XX/lb │ $X.XX/lb │
└──────────────────┴──────────┴──────────┘
```

#### Cargos Adicionales

```
- Seguro (% del valor declarado): ____%
- Combustible (% de tarifa base): ____%
- Entrega con firma: $___
- Manejo especial: $___
- Empaque adicional: $___
```

#### Descuentos

```
Clientes frecuentes:
- 10+ envíos/mes: ____%
- 25+ envíos/mes: ____%
- 50+ envíos/mes: ____%
```

### 10.4 Gestión de Usuarios

**Ruta:** Dashboard → Configuración → Usuarios

**⚠️ Solo para administradores**

#### Roles y Permisos

**Administrador:**
- Acceso total al sistema
- Crear/editar/eliminar usuarios
- Modificar configuración
- Acceso a reportes financieros

**Operador:**
- Crear y editar envíos
- Ver información de clientes
- Generar documentos
- Ver reportes básicos

**Soporte:**
- Solo lectura
- Acceso a tracking
- Chat con clientes
- Sin acceso a información financiera

#### Agregar Nuevo Usuario

1. Click en "**+ Nuevo Usuario**"
2. Completar:
   ```
   - Nombre completo
   - Email corporativo
   - Rol
   - Permisos especiales (opcional)
   ```
3. Enviar invitación por email
4. Usuario completa registro en primer acceso

### 10.5 Integraciones

**Ruta:** Dashboard → Configuración → Integraciones

#### APIs Disponibles

**Servicios de Mensajería:**
- SendGrid (Email)
- Twilio (SMS)
- WhatsApp Business API

**Pasarelas de Pago:**
- Stripe
- PayPal
- MercadoPago

**Contabilidad:**
- QuickBooks
- SAT (México)
- Exportación a Excel

**Configuración de API:**
1. Seleccionar servicio
2. Ingresar API Key
3. Configurar webhooks
4. Probar conexión
5. Activar integración

---

## 11. Casos de Uso Comunes

### Caso 1: Procesar un Nuevo Envío Completo

**Escenario:** Cliente llega con paquete para enviar a México

**Pasos:**

1. **Registrar Cliente (si es nuevo)**
   - Dashboard → Clientes → + Nuevo Cliente
   - Llenar formulario con datos del cliente
   - Guardar

2. **Crear Envío**
   - Dashboard → Envíos → + Nuevo Envío
   - Seleccionar cliente del dropdown
   - Ingresar datos del paquete (peso, dimensiones, contenido)
   - Completar dirección de destino
   - Seleccionar tipo de servicio (Express/Estándar)
   - Agregar seguro si el valor es alto
   - Guardar envío

3. **Generar Documentos**
   - Sistema muestra detalles del envío creado
   - Click en "Generar Etiqueta" → Descargar PDF
   - Click en "Generar Factura" → Descargar PDF

4. **Imprimir y Etiquetar**
   - Imprimir etiqueta en papel adhesivo
   - Colocar en el paquete
   - Imprimir factura
   - Entregar copia al cliente

5. **Cobrar al Cliente**
   - Mostrar total en la factura
   - Procesar pago (efectivo, tarjeta, transferencia)
   - Registrar pago en sistema (si aplica)

6. **Entregar Comprobantes**
   - Factura con QR de tracking
   - Número de guía verbal
   - Instrucciones de rastreo en línea

**Tiempo estimado:** 5-10 minutos

---

### Caso 2: Consulta de Cliente sobre su Envío

**Escenario:** Cliente llama preguntando dónde está su paquete

**Pasos:**

1. **Solicitar Información**
   - Pedir número de tracking o nombre completo

2. **Buscar Envío**
   - Opción A: Dashboard → Envíos → Buscar por tracking
   - Opción B: Dashboard → Chat IA → "Tracking [número]"

3. **Revisar Estado Actual**
   - Ver estado en la tabla
   - Click en "Ver Detalles" para historial completo

4. **Comunicar al Cliente**
   - Estado actual del envío
   - Última ubicación conocida
   - Fecha estimada de entrega
   - Próximo paso en el proceso

5. **Documentar Interacción**
   - En detalles del envío, agregar nota:
     "Cliente consultó vía telefónica - [fecha] - [nombre agente]"

**Tiempo estimado:** 2-3 minutos

---

### Caso 3: Actualizar Envío que Llegó a Aduana

**Escenario:** Recibimos notificación de que un envío está en proceso aduanal

**Pasos:**

1. **Localizar Envío**
   - Dashboard → Envíos
   - Buscar por ID o tracking number

2. **Actualizar Estado**
   - Abrir detalles del envío
   - Cambiar estado a "En Aduana"

3. **Agregar Evento de Tracking**
   - Pestaña "Tracking" → + Agregar Evento
   - Completar:
     ```
     Fecha: [fecha actual]
     Ubicación: Aduana de [ciudad]
     Descripción: Paquete ingresado a revisión aduanal
     ```

4. **Notificar al Cliente (opcional)**
   - Si está habilitado, el sistema envía email automático
   - Si no, enviar mensaje manual informando el proceso

5. **Monitorear Progreso**
   - Revisar diariamente hasta liberación
   - Actualizar cuando salga de aduana

**Tiempo estimado:** 3-5 minutos

---

### Caso 4: Generar Reporte Mensual para Gerencia

**Escenario:** Fin de mes, necesitas presentar resultados a gerencia

**Pasos:**

1. **Acceder a Reportes**
   - Dashboard → Reportes

2. **Configurar Filtros**
   - Rango de fechas: "Mes anterior"
   - Estado: "Todos"
   - Ubicación: "Todas"

3. **Revisar KPIs**
   - Total de envíos del mes
   - Ingresos generados
   - Clientes activos
   - Tasa de entrega

4. **Analizar Gráficos**
   - Tendencia de envíos
   - Distribución por estado
   - Top clientes

5. **Usar Asistente IA**
   - Chat IA → "Resumen ejecutivo del mes pasado"
   - IA genera análisis con insights

6. **Exportar Reporte**
   - Click en "Exportar"
   - Seleccionar formato PDF
   - Descargar

7. **Presentar**
   - Abrir PDF
   - Revisar con gerencia
   - Discutir estrategias basadas en datos

**Tiempo estimado:** 10-15 minutos

---

### Caso 5: Cliente Solicita Cancelación de Envío

**Escenario:** Cliente se arrepiente y quiere cancelar antes de que salga

**Pasos:**

1. **Verificar Estado**
   - Buscar envío en el sistema
   - Confirmar que está en estado "Pendiente"
   - Si ya está "En Tránsito", explicar que no es posible

2. **Cancelar Envío**
   - Abrir detalles del envío
   - Click en "Cancelar Envío"
   - Ingresar motivo: "Solicitud del cliente"
   - Confirmar

3. **Procesar Reembolso (si aplica)**
   - Calcular monto a reembolsar según políticas
   - Procesar devolución del pago
   - Registrar en sistema de contabilidad

4. **Documentar**
   - Guardar registro de la cancelación
   - Conservar comprobantes

5. **Comunicar**
   - Confirmar cancelación al cliente
   - Enviar comprobante de reembolso
   - Explicar políticas de cancelación futura

**Tiempo estimado:** 5-7 minutos

---

## 12. Preguntas Frecuentes

### Sobre el Sistema

**P: ¿Puedo acceder desde mi celular?**
R: Sí, el sistema es completamente responsivo y funciona en smartphones y tablets. Solo necesitas un navegador web.

**P: ¿Los datos se guardan automáticamente?**
R: Sí, cada cambio se guarda inmediatamente en la nube. No necesitas presionar "Guardar" manualmente en la mayoría de casos.

**P: ¿Qué hago si pierdo mi contraseña?**
R: En la pantalla de login, usa la opción "Olvidé mi contraseña" y sigue las instrucciones por email. Si persiste el problema, contacta al administrador.

**P: ¿Puedo trabajar offline?**
R: No, el sistema requiere conexión a internet para funcionar, ya que los datos están en la nube.

### Sobre Envíos

**P: ¿Cuál es el peso máximo por paquete?**
R: El sistema no tiene límite técnico, pero verifica las políticas de la empresa y restricciones de transportistas.

**P: ¿Puedo editar un envío después de crearlo?**
R: Puedes editar la mayoría de campos mientras el envío esté en estado "Pendiente". Una vez "En Tránsito", solo se puede actualizar el estado y agregar eventos de tracking.

**P: ¿Cómo sé si un envío llegó a tiempo?**
R: Compara la "Fecha de Entrega Real" con la "Fecha Estimada de Entrega" en los detalles del envío. El reporte de KPIs también muestra la tasa general de entregas a tiempo.

**P: ¿Puedo rastrear múltiples paquetes a la vez?**
R: Sí, usa los filtros en la sección de Envíos o pregunta al Chat IA: "Muéstrame todos los envíos en tránsito".

### Sobre Clientes

**P: ¿Puedo tener clientes duplicados?**
R: El sistema permite clientes con el mismo nombre, pero se recomienda verificar por email o teléfono antes de crear uno nuevo.

**P: ¿Los clientes pueden acceder al sistema?**
R: No directamente al dashboard. Pero tienen acceso al portal público de rastreo con su número de tracking.

**P: ¿Cómo exporto mi base de clientes?**
R: Dashboard → Clientes → Click en botón de descarga → Seleccionar formato (Excel o CSV).

### Sobre Facturación

**P: ¿Las facturas son fiscalmente válidas?**
R: Las facturas generadas incluyen toda la información requerida. Consulta con tu contador sobre requisitos específicos de tu jurisdicción (SAT en México, IRS en USA).

**P: ¿Puedo modificar una factura ya generada?**
R: No se recomienda por temas fiscales. Si hay un error, genera una nota de crédito y emite una nueva factura.

**P: ¿Cómo genero facturas masivas?**
R: Dashboard → Reportes → Facturación → Seleccionar período → "Exportar Facturas" → Descarga ZIP con todos los PDFs.

### Sobre Reportes

**P: ¿Puedo personalizar los reportes?**
R: Puedes filtrar por fecha, estado, ubicación, etc. Para reportes más específicos, usa el Chat IA para solicitar análisis personalizados.

**P: ¿Los reportes se generan en tiempo real?**
R: Sí, todos los KPIs y gráficos se calculan con la información más reciente de la base de datos.

**P: ¿Puedo programar reportes automáticos?**
R: Actualmente no, pero puedes exportar manualmente. Esta funcionalidad está planeada para futuras versiones.

### Sobre el Chat IA

**P: ¿El IA tiene acceso a toda mi información?**
R: El IA solo puede ver información de envíos, clientes y estadísticas. No tiene acceso a contraseñas ni información sensible de usuarios.

**P: ¿Puedo confiar en las respuestas del IA?**
R: El IA es muy preciso, pero siempre verifica información crítica manualmente. Úsalo como asistente, no como fuente única de verdad.

**P: ¿El IA aprende de mis preguntas?**
R: El sistema mejora con el tiempo, pero no almacena conversaciones individuales. Cada sesión es independiente.

---

## 13. Soporte Técnico

### Niveles de Soporte

#### Nivel 1: Autoayuda
- **Consultar este manual**
- **Usar el Chat IA del sistema**
- **Revisar tutoriales en video** (si están disponibles)

#### Nivel 2: Soporte por Email
- **Email:** soporte@hoymismopaqueteria.com
- **Tiempo de respuesta:** 24-48 horas
- **Horario:** Lunes a Viernes, 9 AM - 6 PM

#### Nivel 3: Soporte Telefónico
- **Teléfono:** +1 346-580-1238
- **Horario:** Lunes a Viernes, 9 AM - 6 PM (hora de Houston)
- **Para:** Problemas urgentes o críticos

#### Nivel 4: Soporte Técnico Especializado
- **Para:** Integraciones, APIs, problemas de infraestructura
- **Contacto:** a través del administrador del sistema

### Información a Proporcionar al Solicitar Soporte

Para agilizar la resolución:

```
1. Tu nombre y rol en la empresa
2. Descripción del problema
3. Pasos que realizaste antes del error
4. Mensaje de error (si hay alguno)
5. Navegador y sistema operativo que usas
6. Capturas de pantalla (si es posible)
7. Número de envío o cliente afectado (si aplica)
```

### Problemas Comunes y Soluciones

#### "No puedo iniciar sesión"

**Soluciones:**
1. Verifica que estés usando el email correcto
2. Intenta restablecer contraseña
3. Limpia caché y cookies del navegador
4. Intenta en modo incógnito/privado
5. Verifica tu conexión a internet
6. Contacta al administrador si persiste

#### "El sistema está lento"

**Soluciones:**
1. Refresca la página (F5 o Ctrl+R)
2. Verifica tu conexión a internet
3. Cierra pestañas innecesarias del navegador
4. Limpia caché del navegador
5. Intenta en horario de menor uso
6. Reporta si persiste

#### "No se genera el PDF"

**Soluciones:**
1. Verifica que tu navegador permita descargas
2. Desactiva bloqueador de pop-ups temporalmente
3. Intenta en otro navegador
4. Verifica espacio en disco
5. Reporta si el error continúa

#### "No encuentro un envío"

**Soluciones:**
1. Verifica que estés escribiendo el ID correctamente
2. Usa la búsqueda avanzada con filtros
3. Pregunta al Chat IA
4. Verifica que tengas permisos para ver ese envío
5. Contacta al administrador

### Reportar Bugs o Sugerir Mejoras

Si encuentras un error o tienes ideas para mejorar:

**Email:** desarrollo@hoymismopaqueteria.com

**Incluye:**
- Descripción detallada
- Pasos para reproducir (si es un bug)
- Sugerencia de cómo debería funcionar
- Impacto en tu trabajo diario

### Actualizaciones del Sistema

El sistema se actualiza regularmente:
- **Mantenimiento programado:** Domingos 2-4 AM
- **Actualizaciones menores:** Sin interrupción del servicio
- **Actualizaciones mayores:** Notificación con 1 semana de anticipación

---

## Conclusión

Este manual cubre las funcionalidades principales del HoyMismo Dashboard. A medida que uses el sistema diariamente, te familiarizarás más con sus capacidades y flujos de trabajo.

### Próximos Pasos Recomendados

1. **Práctica:** Crea envíos de prueba para familiarizarte
2. **Exploración:** Revisa cada sección del dashboard
3. **Experimentación:** Usa el Chat IA con diferentes preguntas
4. **Personalización:** Ajusta la configuración a tus preferencias

### Recordatorios Importantes

- ✅ Siempre cierra sesión en computadoras compartidas
- ✅ Mantén actualizada la información de clientes
- ✅ Genera documentos inmediatamente al crear envíos
- ✅ Actualiza estados de envío diariamente
- ✅ Revisa reportes regularmente para insights de negocio
- ✅ Consulta este manual cuando tengas dudas

### Recursos Adicionales

- **Portal web:** https://hoymismopaqueteria.com
- **Dashboard:** https://hoymismodashboard.vercel.app
- **Email:** ventas@hoymismopaqueteria.com
- **Teléfono:** +1 346-580-1238

---

**¡Gracias por usar HoyMismo Dashboard!**

*Versión 1.0 - Diciembre 2024*
*© 2024 HoyMismo Paquetería. Todos los derechos reservados.*
