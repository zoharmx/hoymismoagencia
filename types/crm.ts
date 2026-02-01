import { Timestamp } from 'firebase/firestore'

// ==========================================
// TIPOS PARA HOYMISMO AGENCIA ADUANAL
// Sistema de Gestión de Trámites de Importación Vehicular
// ==========================================

// Estados del trámite de importación
export type ImportProcessStatus =
  | 'contacto-creado'
  | 'documentacion-inicial'
  | 'vehiculo-validado'
  | 'anticipo-recibido'
  | 'tramite-en-proceso'
  | 'pedimento-generado'
  | 'liquidacion'
  | 'tramite-finalizado'
  | 'cancelado'

// ==========================================
// DEFINICIÓN DE ESTADOS IMPORTANTES
// ==========================================

// Estados TERMINALES: El trámite no puede cambiar de estos estados
export const TERMINAL_STATES: ImportProcessStatus[] = [
  'tramite-finalizado',
  'cancelado',
]

// Estados BLOQUEANTES: El trámite está pausado, requiere acción del cliente
export const BLOCKING_STATES: ImportProcessStatus[] = [
  'documentacion-inicial', // Esperando documentos del cliente
]

// Estados ACTIVOS: El trámite está en progreso
export const ACTIVE_STATES: ImportProcessStatus[] = [
  'anticipo-recibido',
  'tramite-en-proceso',
  'pedimento-generado',
  'liquidacion',
]

// Estados INICIALES: El trámite apenas comenzó
export const INITIAL_STATES: ImportProcessStatus[] = [
  'contacto-creado',
  'documentacion-inicial',
  'vehiculo-validado',
]

// Orden de flujo del trámite (para validación de transiciones)
export const STATUS_FLOW_ORDER: ImportProcessStatus[] = [
  'contacto-creado',
  'documentacion-inicial',
  'vehiculo-validado',
  'anticipo-recibido',
  'tramite-en-proceso',
  'pedimento-generado',
  'liquidacion',
  'tramite-finalizado',
]

// Helper: Verificar si un estado es terminal
export function isTerminalStatus(status: ImportProcessStatus): boolean {
  return TERMINAL_STATES.includes(status)
}

// Helper: Verificar si un estado es bloqueante
export function isBlockingStatus(status: ImportProcessStatus): boolean {
  return BLOCKING_STATES.includes(status)
}

// Helper: Obtener el siguiente estado en el flujo
export function getNextStatus(current: ImportProcessStatus): ImportProcessStatus | null {
  const currentIndex = STATUS_FLOW_ORDER.indexOf(current)
  if (currentIndex === -1 || currentIndex >= STATUS_FLOW_ORDER.length - 1) {
    return null
  }
  return STATUS_FLOW_ORDER[currentIndex + 1]
}

// Estados de factura
export type InvoiceStatus = 'pendiente' | 'pagada' | 'vencida' | 'cancelada'

// Tipo de cliente
export type ClientType = 'individual' | 'empresa'

// Tipo de pedimento
export type PedimentoType =
  | 'A1 - Importación definitiva'
  | 'A2 - Importación temporal'
  | 'F4 - Retorno de vehículo'
  | 'Otro'

// Prioridad de nota
export type NotePriority = 'baja' | 'media' | 'alta'

// Tipo de actividad del CRM
export type ActivityType =
  | 'llamada'
  | 'email'
  | 'reunion'
  | 'nota'
  | 'seguimiento'
  | 'cotizacion'
  | 'documento-recibido'
  | 'pago-recibido'

// Tipo de documento
export type DocumentType =
  | 'ine'
  | 'titulo-vehiculo'
  | 'factura-compra'
  | 'comprobante-domicilio'
  | 'rfc'
  | 'pedimento'
  | 'fotos-vehiculo'
  | 'comprobante-pago'
  | 'otro'

// Tipo de pago
export type PaymentType = 'anticipo' | 'liquidacion' | 'ajuste'

// Dirección
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
}

// ==========================================
// ENTIDAD: Cliente
// ==========================================
export interface Client {
  id: string
  clientId: string // ID personalizado tipo CLT-XXXXXX
  hubspotId?: string // ID original de HubSpot para referencia

  // Datos personales
  name: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string

  type: ClientType
  company?: string
  rfc?: string

  // Ubicación
  address: Address

  // Gestor asignado
  gestorId?: string
  gestorName?: string

  // Estadísticas
  totalProcesses: number
  totalPaid: number
  // Alias para compatibilidad con importación CSV
  totalShipments?: number // = totalProcesses
  totalSpent?: number // = totalPaid

  // Metadatos
  createdAt: Timestamp
  updatedAt: Timestamp
  lastProcessDate?: Timestamp
  notes?: string
  tags?: string[]
  isActive: boolean

  // Fuente del contacto
  source?: string // Formularios, Tráfico directo, etc.
  originalConversion?: string
}

// ==========================================
// ENTIDAD: Vehículo
// ==========================================
export interface Vehicle {
  id: string
  vin: string // Número de Identificación Vehicular (único)

  // Datos del vehículo
  brand: string // MARCA
  model: string // MODELO
  year?: number // Antigüedad
  color: string // COLOR

  // Relaciones
  clientId: string
  processId?: string // Trámite asociado

  // Metadatos
  createdAt: Timestamp
  updatedAt: Timestamp

  // Documentos del vehículo
  titleUrl?: string
  photosUrls?: string[]
}

// ==========================================
// ENTIDAD: Proceso de Importación (Trámite)
// ==========================================
export interface ImportProcess {
  id: string
  folio: string // FOLIO - ID personalizado tipo USHO-XXXX
  numeroGuiaOriginal?: string // Referencia histórica de HubSpot

  // Relaciones
  clientId: string
  clientName: string // Desnormalizado para queries
  vehicleId: string
  vehicleVin: string // Desnormalizado
  vehicleBrand: string // Desnormalizado
  vehicleModel: string // Desnormalizado

  // Información del trámite
  tipoPedimento: PedimentoType
  oficina: string // OFICINA (Tijuana, Nogales, etc.)
  status: ImportProcessStatus

  // Gestor asignado
  gestorId?: string
  gestorName?: string

  // Fechas clave
  fechaInicio: Timestamp
  fechaEstimadaFin?: Timestamp
  fechaFinalizacion?: Timestamp

  // Pagos
  anticipo: number
  liquidacion: number
  totalCost: number
  currency: string // MXN, USD

  // Documentos
  documentosCliente?: string[] // URLs de documentos
  fotosVehiculo?: string[] // URLs de fotos

  // Historial del trámite
  processHistory?: ProcessEvent[]

  // Metadatos
  createdAt: Timestamp
  updatedAt: Timestamp
  notes?: string
}

// Evento del historial del trámite
export interface ProcessEvent {
  date: Timestamp
  status: ImportProcessStatus
  location: string
  description: string
  updatedBy?: string
}

// ==========================================
// ENTIDAD: Documento
// ==========================================
export interface Document {
  id: string
  processId: string
  clientId: string

  type: DocumentType
  name: string
  url: string

  uploadedAt: Timestamp
  validatedAt?: Timestamp
  validatedBy?: string
  isValid: boolean

  notes?: string
}

// ==========================================
// ENTIDAD: Pago
// ==========================================
export interface Payment {
  id: string
  paymentId: string // PAY-XXXX
  processId: string
  clientId: string

  type: PaymentType // anticipo o liquidación
  amount: number
  currency: string

  date: Timestamp
  status: 'pendiente' | 'confirmado' | 'rechazado'

  paymentMethod?: string
  reference?: string
  comprobante?: string // URL del comprobante

  createdAt: Timestamp
  updatedAt: Timestamp
  notes?: string
}

// ==========================================
// ENTIDAD: Factura
// ==========================================
export interface Invoice {
  id: string
  invoiceId: string // INV-YYYY-XXXXX
  clientId: string
  clientName: string
  processId?: string

  // Detalles de facturación
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount?: number
  total: number
  currency: string

  // Estado
  status: InvoiceStatus
  dueDate: Timestamp
  paidDate?: Timestamp

  // Fechas
  createdAt: Timestamp
  updatedAt: Timestamp

  // Información adicional
  notes?: string
  paymentMethod?: string
  paymentReference?: string
}

// Item de factura
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  processId?: string
}

// ==========================================
// ENTIDAD: Actividad del CRM
// ==========================================
export interface CRMActivity {
  id: string
  clientId: string
  type: ActivityType
  title: string
  description: string
  priority: NotePriority

  createdAt: Timestamp
  updatedAt: Timestamp
  dueDate?: Timestamp
  completedAt?: Timestamp

  createdBy: string
  assignedTo?: string

  relatedProcessId?: string
  relatedInvoiceId?: string
  relatedPaymentId?: string
}

// ==========================================
// ESTADÍSTICAS DEL DASHBOARD
// ==========================================
export interface DashboardStats {
  // Trámites
  totalProcesses: number
  activeProcesses: number
  completedProcesses: number
  pendingProcesses: number

  // Ingresos
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number

  // Clientes
  totalClients: number
  activeClients: number
  newClientsThisMonth: number

  // Facturas
  pendingInvoices: number
  overdueInvoices: number

  // Por oficina
  processesByOffice?: { [key: string]: number }

  // Por status
  processesByStatus?: { [key: string]: number }
}

// ==========================================
// FILTROS PARA BÚSQUEDAS
// ==========================================
export interface ImportProcessFilters {
  status?: ImportProcessStatus[]
  clientId?: string
  gestorId?: string
  oficina?: string
  tipoPedimento?: PedimentoType
  startDate?: Date
  endDate?: Date
  minValue?: number
  maxValue?: number
}

export interface ClientFilters {
  type?: ClientType
  isActive?: boolean
  gestorId?: string
  tags?: string[]
  minProcesses?: number
  minPaid?: number
}

export interface InvoiceFilters {
  status?: InvoiceStatus[]
  clientId?: string
  processId?: string
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
}

export interface VehicleFilters {
  brand?: string
  model?: string
  year?: number
  clientId?: string
}

// ==========================================
// USUARIO DEL SISTEMA
// ==========================================
export type UserRole = 'admin' | 'manager' | 'gestor' | 'viewer'

export interface User {
  id: string
  uid: string // Firebase Auth UID
  email: string
  displayName: string
  role: UserRole
  phone?: string
  photoURL?: string

  // Oficina asignada
  oficina?: string

  department?: string
  isActive: boolean

  createdAt: Timestamp
  updatedAt: Timestamp
  lastLogin?: Timestamp

  permissions?: string[]

  // Estadísticas del gestor
  assignedProcesses?: number
  completedProcesses?: number
}

// ==========================================
// CONFIGURACIÓN DE LA EMPRESA
// ==========================================
export interface CompanySettings {
  id: string
  companyName: string
  legalName?: string
  rfc?: string
  address?: Address
  phone: string
  email: string
  website?: string
  logo?: string

  // Configuración fiscal
  taxRate: number
  currency: string
  timezone: string
  language: string

  // Oficinas
  offices?: string[]

  createdAt: Timestamp
  updatedAt: Timestamp
}

// ==========================================
// CONFIGURACIÓN DEL SISTEMA
// ==========================================
export interface SystemSettings {
  id: string

  // Notificaciones
  emailNotifications: boolean
  smsNotifications: boolean
  whatsappNotifications: boolean

  // Automatización
  autoInvoicing: boolean

  // Prefijos para IDs
  invoicePrefix: string
  processPrefix: string // USHO-
  clientPrefix: string
  paymentPrefix: string

  // Integración HubSpot
  hubspotApiKey?: string
  hubspotSyncEnabled?: boolean

  // API Keys para IA
  apiKeys?: {
    deepseek?: string
    mistral?: string
    twillio?: string
    sendgrid?: string
  }

  createdAt: Timestamp
  updatedAt: Timestamp
}

// ==========================================
// TIPOS LEGACY (para compatibilidad)
// ==========================================

// Alias para migración gradual
export type Shipment = ImportProcess
export type ShipmentStatus = ImportProcessStatus
export type TrackingEvent = ProcessEvent
export interface ShipmentFilters extends ImportProcessFilters {}
