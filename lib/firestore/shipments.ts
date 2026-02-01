// Este archivo mantiene compatibilidad con código legacy
// Todas las funciones ahora están en import-processes.ts

export {
  // Funciones principales renombradas para importación vehicular
  getImportProcesses as getShipments,
  getImportProcess as getShipment,
  createImportProcess as createShipment,
  updateImportProcess as updateShipment,
  deleteImportProcess as deleteShipment,
  searchImportProcesses as searchShipments,
  getRecentProcesses as getRecentShipments,
  getClientProcesses as getClientShipments,
  updateProcessStatus as updateShipmentStatus,
  getProcessStats as getShipmentStats,

  // Funciones nuevas específicas para agencia aduanal
  getProcessByFolio,
  getProcessByVin,
  getGestorProcesses,
  getProcessesByOffice,
  generateProcessFolio,
} from './import-processes'

// Re-exportar tipos para compatibilidad
export type { ImportProcess as Shipment } from '@/types/crm'
