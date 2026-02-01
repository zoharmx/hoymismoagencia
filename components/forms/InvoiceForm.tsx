'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X, Plus, Trash2 } from 'lucide-react'
import { createInvoice } from '@/lib/firestore/invoices'
import { getClients } from '@/lib/firestore/clients'
import { getShipments } from '@/lib/firestore/shipments'
import type { InvoiceStatus, Client, Shipment } from '@/types/crm'
import { Timestamp } from 'firebase/firestore'

interface InvoiceFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface InvoiceItemForm {
  description: string
  quantity: number
  unitPrice: number
  shipmentId?: string
}

interface InvoiceFormData {
  clientId: string
  items: InvoiceItemForm[]
  tax: number
  discount?: number
  status: InvoiceStatus
  dueDate: string
  notes?: string
  currency: string
}

export default function InvoiceForm({ onClose, onSuccess }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      status: 'pendiente',
      currency: 'USD',
      tax: 16,
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const items = watch('items')
  const tax = watch('tax') || 0
  const discount = watch('discount') || 0

  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)

  const taxAmount = (subtotal * tax) / 100
  const discountAmount = discount ? (subtotal * discount) / 100 : 0
  const total = subtotal + taxAmount - discountAmount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, shipmentsData] = await Promise.all([
          getClients({ isActive: true }),
          getShipments({}),
        ])
        setClients(clientsData)
        setShipments(shipmentsData)
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedClientId) {
      const clientShipments = shipments.filter(
        (s) => s.clientId === selectedClientId && !s.invoiceId
      )
      // Puedes agregar automáticamente envíos sin facturar del cliente
    }
  }, [selectedClientId, shipments])

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setLoading(true)
      setError(null)

      const selectedClient = clients.find((c) => c.id === data.clientId)
      if (!selectedClient) {
        throw new Error('Cliente no encontrado')
      }

      await createInvoice({
        clientId: data.clientId,
        clientName: selectedClient.name,
        items: data.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.quantity) * Number(item.unitPrice),
          shipmentId: item.shipmentId,
        })),
        subtotal,
        tax: taxAmount,
        discount: discountAmount || undefined,
        total,
        status: data.status,
        currency: data.currency,
        dueDate: Timestamp.fromDate(new Date(data.dueDate)),
        notes: data.notes,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating invoice:', err)
      setError(
        err instanceof Error ? err.message : 'Error al crear la factura'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Nueva Factura</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Cliente */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Cliente *
            </label>
            {loadingData ? (
              <div className="text-slate-400">Cargando clientes...</div>
            ) : (
              <select
                {...register('clientId', {
                  required: 'El cliente es requerido',
                })}
                onChange={(e) => {
                  setValue('clientId', e.target.value)
                  setSelectedClientId(e.target.value)
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.clientId}
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && (
              <p className="text-red-400 text-xs mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Items de la Factura
              </h3>
              <button
                type="button"
                onClick={() =>
                  append({ description: '', quantity: 1, unitPrice: 0 })
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">
                      Item {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Descripción *
                      </label>
                      <input
                        type="text"
                        {...register(`items.${index}.description`, {
                          required: 'Requerido',
                        })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                        placeholder="Descripción del item"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        {...register(`items.${index}.quantity`, {
                          required: 'Requerido',
                          min: 1,
                        })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Precio Unitario *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.unitPrice`, {
                          required: 'Requerido',
                          min: 0,
                        })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Envío Relacionado (opcional)
                      </label>
                      <select
                        {...register(`items.${index}.shipmentId`)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="">Ninguno</option>
                        {shipments
                          .filter(
                            (s) =>
                              s.clientId === selectedClientId && !s.invoiceId
                          )
                          .map((shipment) => (
                            <option key={shipment.id} value={shipment.id}>
                              {shipment.shipmentId} - $
                              {shipment.totalCost.toFixed(2)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Total del item:</span>
                      <span className="font-semibold text-white">
                        $
                        {(
                          (Number(items[index]?.quantity) || 0) *
                          (Number(items[index]?.unitPrice) || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cálculos */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Cálculos y Totales
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Impuesto (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register('tax')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="16"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register('discount')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Moneda *
                </label>
                <select
                  {...register('currency', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-6 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Impuesto ({tax}%):</span>
                <span className="font-mono">${taxAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-400">
                  <span>Descuento ({discount}%):</span>
                  <span className="font-mono">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-primary-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Detalles Adicionales */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalles Adicionales
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Estado *
                </label>
                <select
                  {...register('status', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagada">Pagada</option>
                  <option value="vencida">Vencida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  {...register('dueDate', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Notas adicionales sobre la factura..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Crear Factura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
