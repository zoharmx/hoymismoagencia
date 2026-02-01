'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Package, Calendar, DollarSign, FileText, Printer, Download, Truck } from 'lucide-react'
import { updateShipmentStatus, getClient } from '@/lib/firestore'
import { generateShippingLabel } from '@/lib/pdf-templates'
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
        'Centro de distribución',
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

  const handlePrintLabel = () => {
    if (!client) {
      alert('Cargando información del cliente...')
      return
    }
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generateShippingLabel(shipment, client))
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  const handleGeneratePDF = () => {
    if (!client) {
      alert('Cargando información del cliente...')
      return
    }
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generateShippingLabel(shipment, client))
      printWindow.document.close()
    }
  }

  const statusColors: Record<ShipmentStatus, string> = {
    'pendiente': 'bg-yellow-500/20 text-yellow-400',
    'en-transito': 'bg-blue-500/20 text-blue-400',
    'en-aduana': 'bg-orange-500/20 text-orange-400',
    'en-distribucion': 'bg-purple-500/20 text-purple-400',
    'entregado': 'bg-green-500/20 text-green-400',
    'cancelado': 'bg-red-500/20 text-red-400',
    'devuelto': 'bg-slate-500/20 text-slate-400',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Detalles del Envío</h2>
            <p className="text-slate-400 text-sm font-mono">{shipment.shipmentId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Acciones Rápidas */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Generar PDF
            </button>
            <button
              onClick={handlePrintLabel}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir Guía
            </button>
          </div>

          {/* Estado Actual */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Estado del Envío
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[shipment.status]}`}>
                {shipment.status.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en-transito">En Tránsito</option>
                  <option value="en-aduana">En Aduana</option>
                  <option value="en-distribucion">En Distribución</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="devuelto">Devuelto</option>
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
            <p className="text-slate-300">{shipment.clientName}</p>
          </div>

          {/* Origen y Destino */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Origen
              </h3>
              <div className="text-slate-300 text-sm space-y-1">
                <p>{shipment.origin.street}</p>
                <p>{shipment.origin.city}, {shipment.origin.state}</p>
                <p>{shipment.origin.zipCode}</p>
                <p>{shipment.origin.country}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destino
              </h3>
              <div className="text-slate-300 text-sm space-y-1">
                <p>{shipment.destination.street}</p>
                <p>{shipment.destination.city}, {shipment.destination.state}</p>
                <p>{shipment.destination.zipCode}</p>
                <p>{shipment.destination.country}</p>
                {shipment.destination.reference && (
                  <p className="text-slate-400 italic">Ref: {shipment.destination.reference}</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles del Paquete */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Detalles del Paquete
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Peso</p>
                <p className="text-white font-semibold">{shipment.weight} kg</p>
              </div>
              <div>
                <p className="text-slate-400">Tipo</p>
                <p className="text-white font-semibold">{shipment.packageType}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-400">Descripción</p>
                <p className="text-white">{shipment.description}</p>
              </div>
              <div>
                <p className="text-slate-400">Valor Declarado</p>
                <p className="text-white font-semibold">${shipment.declaredValue.toFixed(2)}</p>
              </div>
              {shipment.trackingNumber && (
                <div>
                  <p className="text-slate-400">Tracking</p>
                  <p className="text-white font-mono">{shipment.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Costos */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Costos
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Costo de envío</span>
                <span className="text-white">${shipment.shippingCost.toFixed(2)}</span>
              </div>
              {shipment.insuranceCost && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Seguro</span>
                  <span className="text-white">${shipment.insuranceCost.toFixed(2)}</span>
                </div>
              )}
              {shipment.additionalCosts && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Costos adicionales</span>
                  <span className="text-white">${shipment.additionalCosts.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-semibold text-lg">
                  ${shipment.totalCost.toFixed(2)} {shipment.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Historial de Tracking */}
          {shipment.trackingHistory && shipment.trackingHistory.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Historial de Tracking
              </h3>
              <div className="space-y-3">
                {shipment.trackingHistory.map((event, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{event.description}</p>
                      <p className="text-slate-400">
                        {event.location} - {event.date.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instrucciones Especiales y Notas */}
          {(shipment.specialInstructions || shipment.notes) && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notas
              </h3>
              {shipment.specialInstructions && (
                <div className="mb-3">
                  <p className="text-slate-400 text-sm">Instrucciones Especiales</p>
                  <p className="text-white">{shipment.specialInstructions}</p>
                </div>
              )}
              {shipment.notes && (
                <div>
                  <p className="text-slate-400 text-sm">Notas Internas</p>
                  <p className="text-white">{shipment.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
