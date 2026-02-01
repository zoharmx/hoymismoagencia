'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, MapPin, Tag, Package, FileText, DollarSign, Edit, Trash2, Calendar, Building } from 'lucide-react'
import { deleteClient, getClientShipments, getClientInvoices } from '@/lib/firestore'
import type { Client, Shipment, Invoice } from '@/types/crm'

interface ClientDetailsModalProps {
  client: Client
  onClose: () => void
  onSuccess: () => void
  onEdit: (client: Client) => void
}

export default function ClientDetailsModal({ client, onClose, onSuccess, onEdit }: ClientDetailsModalProps) {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadClientData()
  }, [client.id])

  const loadClientData = async () => {
    try {
      setLoading(true)
      const [clientShipments, clientInvoices] = await Promise.all([
        getClientShipments(client.id),
        getClientInvoices(client.id)
      ])
      setShipments(clientShipments)
      setInvoices(clientInvoices)
    } catch (error) {
      console.error('Error loading client data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmMessage = shipments.length > 0 || invoices.length > 0
      ? `Este cliente tiene ${shipments.length} envíos y ${invoices.length} facturas asociadas. ¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.`
      : '¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.'

    if (!confirm(confirmMessage)) return

    setDeleting(true)
    try {
      await deleteClient(client.id)
      alert('Cliente eliminado exitosamente')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error al eliminar el cliente')
    } finally {
      setDeleting(false)
    }
  }

  const totalPaid = invoices
    .filter(inv => inv.status === 'pagada')
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalPending = invoices
    .filter(inv => inv.status === 'pendiente')
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {client.type === 'empresa' ? (
                <Building className="w-7 h-7 text-primary-400" />
              ) : (
                <User className="w-7 h-7 text-primary-400" />
              )}
              {client.name}
            </h2>
            <p className="text-slate-400 text-sm font-mono mt-1">{client.clientId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(client)
                onClose()
              }}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
              title="Editar cliente"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
              title="Eliminar cliente"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado del cliente */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              client.isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {client.isActive ? 'ACTIVO' : 'INACTIVO'}
            </span>
            <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold uppercase">
              {client.type}
            </span>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-400" />
                <p className="text-sm text-slate-400">Envíos</p>
              </div>
              <p className="text-2xl font-bold text-white">{shipments.length}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <p className="text-sm text-slate-400">Facturas</p>
              </div>
              <p className="text-2xl font-bold text-white">{invoices.length}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <p className="text-sm text-slate-400">Total Pagado</p>
              </div>
              <p className="text-2xl font-bold text-white">${totalPaid.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-slate-400">Pendiente</p>
              </div>
              <p className="text-2xl font-bold text-white">${totalPending.toFixed(2)}</p>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              Información de Contacto
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-white">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-400">Teléfono</p>
                  <p className="text-white">{client.phone}</p>
                </div>
              </div>
              {client.type === 'empresa' && client.company && (
                <>
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-400">Empresa</p>
                      <p className="text-white">{client.company}</p>
                    </div>
                  </div>
                  {client.rfc && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-xs text-slate-400">RFC</p>
                        <p className="text-white font-mono">{client.rfc}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-400" />
              Dirección
            </h3>
            <div className="text-slate-300 space-y-1">
              <p>{client.address.street}</p>
              <p>{client.address.city}, {client.address.state} {client.address.zipCode}</p>
              <p>{client.address.country}</p>
              {client.address.reference && (
                <p className="text-sm text-slate-400 mt-2">
                  <span className="font-semibold">Referencia:</span> {client.address.reference}
                </p>
              )}
            </div>
          </div>

          {/* Etiquetas y Notas */}
          {(client.tags && client.tags.length > 0) || client.notes ? (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-400" />
                Etiquetas y Notas
              </h3>
              {client.tags && client.tags.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 mb-2">Etiquetas</p>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {client.notes && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Notas</p>
                  <p className="text-slate-300 text-sm">{client.notes}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Historial de Envíos */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-400" />
              Historial de Envíos ({shipments.length})
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : shipments.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-sm text-white">{shipment.shipmentId}</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        shipment.status === 'entregado'
                          ? 'bg-green-500/20 text-green-400'
                          : shipment.status === 'en-transito'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {shipment.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-slate-400">
                        {shipment.origin.city} → {shipment.destination.city}
                      </p>
                      <p className="text-white font-semibold">${shipment.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">No hay envíos registrados</p>
            )}
          </div>

          {/* Historial de Facturas */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" />
              Historial de Facturas ({invoices.length})
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : invoices.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-sm text-white">{invoice.invoiceId}</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        invoice.status === 'pagada'
                          ? 'bg-green-500/20 text-green-400'
                          : invoice.status === 'vencida'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-slate-400">
                        Vence: {invoice.dueDate.toDate().toLocaleDateString()}
                      </p>
                      <p className="text-white font-semibold">${invoice.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">No hay facturas registradas</p>
            )}
          </div>

          {/* Información de registro */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Cliente desde {client.createdAt.toDate().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
