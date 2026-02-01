'use client'

import { useState, useEffect } from 'react'
import { X, Car, Calendar, DollarSign, FileText, Printer, Download, MapPin, Clock, CheckCircle2, CreditCard } from 'lucide-react'
import { updateShipmentStatus, getClient } from '@/lib/firestore'
import type { Shipment, ShipmentStatus, Client } from '@/types/crm'

interface ShipmentDetailsModalProps {
  shipment: Shipment
  onClose: () => void
  onSuccess: () => void
}

export default function ShipmentDetailsModal({ shipment, onClose, onSuccess }: ShipmentDetailsModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<ShipmentStatus>(shipment.status)
  const [client, setClient] = useState<Client | null>(null)
  const [loadingClient, setLoadingClient] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await getClient(shipment.clientId)
        setClient(clientData)
      } catch (error) {
        console.error('Error loading client:', error)
      } finally {
        setLoadingClient(false)
      }
    }
    loadClient()
  }, [shipment.clientId])

  const handleUpdateStatus = async () => {
    if (newStatus === shipment.status) {
      alert('Selecciona un estado diferente')
      return
    }

    setUpdatingStatus(true)
    try {
      await updateShipmentStatus(
        shipment.id,
        newStatus,
        shipment.oficina || 'Oficina',
        `Estado actualizado a ${newStatus}`,
        'Admin'
      )
      onSuccess()
      alert('Estado actualizado exitosamente')
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al actualizar el estado')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Colores para estados de importación
  const statusColors: Record<string, string> = {
    'contacto-creado': 'bg-slate-500/20 text-slate-400',
    'documentacion-inicial': 'bg-yellow-500/20 text-yellow-400',
    'vehiculo-validado': 'bg-blue-500/20 text-blue-400',
    'anticipo-recibido': 'bg-green-500/20 text-green-400',
    'tramite-en-proceso': 'bg-orange-500/20 text-orange-400',
    'pedimento-generado': 'bg-purple-500/20 text-purple-400',
    'liquidacion': 'bg-cyan-500/20 text-cyan-400',
    'tramite-finalizado': 'bg-emerald-500/20 text-emerald-400',
    'cancelado': 'bg-red-500/20 text-red-400',
  }

  // Labels para estados
  const statusLabels: Record<string, string> = {
    'contacto-creado': 'Contacto Creado',
    'documentacion-inicial': 'Documentación Inicial',
    'vehiculo-validado': 'Vehículo Validado',
    'anticipo-recibido': 'Anticipo Recibido',
    'tramite-en-proceso': 'Trámite en Proceso',
    'pedimento-generado': 'Pedimento Generado',
    'liquidacion': 'Liquidación',
    'tramite-finalizado': 'Trámite Finalizado',
    'cancelado': 'Cancelado',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Detalles del Trámite</h2>
            <p className="text-slate-400 text-sm font-mono">{shipment.folio || shipment.shipmentId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Acciones Rápidas */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>

          {/* Estado Actual */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Estado del Trámite
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[shipment.status] || 'bg-slate-500/20 text-slate-400'}`}>
                {statusLabels[shipment.status] || shipment.status}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="contacto-creado">Contacto Creado</option>
                  <option value="documentacion-inicial">Documentación Inicial</option>
                  <option value="vehiculo-validado">Vehículo Validado</option>
                  <option value="anticipo-recibido">Anticipo Recibido</option>
                  <option value="tramite-en-proceso">Trámite en Proceso</option>
                  <option value="pedimento-generado">Pedimento Generado</option>
                  <option value="liquidacion">Liquidación</option>
                  <option value="tramite-finalizado">Trámite Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === shipment.status}
                  className="px-4 py-2 btn-primary disabled:opacity-50"
                >
                  {updatingStatus ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Cliente</h3>
            <p className="text-slate-300 text-lg">{shipment.clientName}</p>
            {client && (
              <div className="mt-2 text-sm text-slate-400">
                <p>Email: {client.email}</p>
                <p>Teléfono: {client.phone}</p>
              </div>
            )}
          </div>

          {/* Datos del Vehículo */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Datos del Vehículo
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">VIN</p>
                <p className="text-white font-mono font-semibold">{shipment.vehicleVin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Marca</p>
                <p className="text-white font-semibold">{shipment.vehicleBrand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Modelo</p>
                <p className="text-white font-semibold">{shipment.vehicleModel || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Año</p>
                <p className="text-white font-semibold">{(shipment as any).vehicleYear || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Información del Trámite */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tipo de Pedimento
              </h3>
              <p className="text-slate-300">{shipment.tipoPedimento || 'A1 - Importación definitiva'}</p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Oficina de Aduana
              </h3>
              <p className="text-slate-300">{shipment.oficina || 'N/A'}</p>
            </div>
          </div>

          {/* Pagos */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pagos
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Anticipo</span>
                <span className="text-white">${(shipment.anticipo ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Liquidación</span>
                <span className="text-white">${(shipment.liquidacion ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-semibold text-lg">
                  ${(shipment.totalCost ?? 0).toFixed(2)} {shipment.currency || 'USD'}
                </span>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Fecha de Inicio</p>
              <p className="text-white font-semibold">
                {shipment.fechaInicio?.toDate?.().toLocaleDateString() ||
                 shipment.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
              </p>
            </div>
            {shipment.fechaEstimadaFin?.toDate && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Fecha Estimada</p>
                <p className="text-white font-semibold">
                  {shipment.fechaEstimadaFin.toDate().toLocaleDateString()}
                </p>
              </div>
            )}
            {shipment.fechaFinalizacion?.toDate && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Fecha de Finalización</p>
                <p className="text-white font-semibold">
                  {shipment.fechaFinalizacion.toDate().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Gestor Asignado */}
          {shipment.gestorName && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Gestor Asignado</h3>
              <p className="text-slate-300">{shipment.gestorName}</p>
            </div>
          )}

          {/* Historial del Trámite */}
          {shipment.processHistory && shipment.processHistory.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Historial del Trámite
              </h3>
              <div className="space-y-3">
                {shipment.processHistory.map((event, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {statusLabels[event.status] || event.status}
                      </p>
                      <p className="text-slate-400">
                        {event.description} - {event.location}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {event.date?.toDate?.().toLocaleString() || 'N/A'}
                        {event.updatedBy && ` • ${event.updatedBy}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {shipment.notes && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notas
              </h3>
              <p className="text-slate-300">{shipment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
