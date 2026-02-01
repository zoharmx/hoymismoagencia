// Export all Firestore services for HoyMismo Agencia Aduanal

// Clientes
export * from './clients'

// Vehículos
export * from './vehicles'

// Trámites de importación (nuevo módulo principal)
export * from './import-processes'

// Re-exportar shipments desde import-processes para compatibilidad
export {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  searchShipments,
  getRecentShipments,
  getClientShipments,
  updateShipmentStatus,
  getShipmentStats,
} from './import-processes'

// Facturas
export * from './invoices'

// Actividades CRM
export * from './crm-activities'

// Dashboard
export * from './dashboard'

// Usuarios
export * from './users'

// Configuración
export * from './settings'
