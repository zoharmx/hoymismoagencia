'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { createShipment } from '@/lib/firestore/shipments'
import { getClients } from '@/lib/firestore/clients'
import type { Shipment, Address, ShipmentStatus, Client } from '@/types/crm'
import { Timestamp } from 'firebase/firestore'

interface ShipmentFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface ShipmentFormData {
  clientId: string
  // Origen
  originStreet: string
  originCity: string
  originState: string
  originZipCode: string
  originCountry: string
  // Destino
  destStreet: string
  destCity: string
  destState: string
  destZipCode: string
  destCountry: string
  destReference?: string
  // Destinatario
  recipientName?: string
  recipientPhone?: string
  // Paquete
  weight: number
  packageType: string
  description: string
  declaredValue: number
  // Costos
  shippingCost: number
  insuranceCost?: number
  additionalCosts?: number
  currency: string
  // Estado
  status: ShipmentStatus
  requiresSignature: boolean
  specialInstructions?: string
  notes?: string
}

export default function ShipmentForm({ onClose, onSuccess }: ShipmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShipmentFormData>({
    defaultValues: {
      status: 'pendiente',
      currency: 'USD',
      originCountry: 'US',
      destCountry: 'MX',
      requiresSignature: false,
      packageType: 'caja',
    },
  })

  const shippingCost = watch('shippingCost') || 0
  const insuranceCost = watch('insuranceCost') || 0
  const additionalCosts = watch('additionalCosts') || 0
  const totalCost = Number(shippingCost) + Number(insuranceCost) + Number(additionalCosts)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients({ isActive: true })
        setClients(clientsData)
      } catch (err) {
        console.error('Error loading clients:', err)
      } finally {
        setLoadingClients(false)
      }
    }

    fetchClients()
  }, [])

  const onSubmit = async (data: ShipmentFormData) => {
    try {
      setLoading(true)
      setError(null)

      const selectedClient = clients.find((c) => c.id === data.clientId)
      if (!selectedClient) {
        throw new Error('Cliente no encontrado')
      }

      const origin: Address = {
        street: data.originStreet,
        city: data.originCity,
        state: data.originState,
        zipCode: data.originZipCode,
        country: data.originCountry,
      }

      const destination: Address = {
        street: data.destStreet,
        city: data.destCity,
        state: data.destState,
        zipCode: data.destZipCode,
        country: data.destCountry,
        reference: data.destReference,
      }

      await createShipment({
        clientId: data.clientId,
        clientName: selectedClient.name,
        origin,
        destination,
        recipient: data.recipientName && data.recipientPhone
          ? {
              name: data.recipientName,
              phone: data.recipientPhone,
            }
          : undefined,
        weight: Number(data.weight),
        packageType: data.packageType,
        description: data.description,
        declaredValue: Number(data.declaredValue),
        status: data.status,
        shippingCost: Number(data.shippingCost),
        insuranceCost: data.insuranceCost ? Number(data.insuranceCost) : undefined,
        additionalCosts: data.additionalCosts
          ? Number(data.additionalCosts)
          : undefined,
        totalCost,
        currency: data.currency,
        requiresSignature: data.requiresSignature,
        specialInstructions: data.specialInstructions,
        notes: data.notes,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating shipment:', err)
      setError(
        err instanceof Error ? err.message : 'Error al crear el envío'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Nuevo Envío</h2>
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
            {loadingClients ? (
              <div className="text-slate-400">Cargando clientes...</div>
            ) : (
              <select
                {...register('clientId', { required: 'El cliente es requerido' })}
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
              <p className="text-red-400 text-xs mt-1">{errors.clientId.message}</p>
            )}
          </div>

          {/* Origen */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Origen del Envío</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  {...register('originStreet', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Calle y número"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  {...register('originCity', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Houston"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  {...register('originState', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="TX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Código Postal *
                </label>
                <input
                  type="text"
                  {...register('originZipCode', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="77001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  País *
                </label>
                <select
                  {...register('originCountry', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                </select>
              </div>
            </div>
          </div>

          {/* Destino */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Destino del Envío</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  {...register('destStreet', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Calle y número"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  {...register('destCity', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Monterrey"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  {...register('destState', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Nuevo León"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Código Postal *
                </label>
                <input
                  type="text"
                  {...register('destZipCode', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="64000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  País *
                </label>
                <select
                  {...register('destCountry', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="MX">México</option>
                  <option value="GT">Guatemala</option>
                  <option value="SV">El Salvador</option>
                  <option value="HN">Honduras</option>
                  <option value="NI">Nicaragua</option>
                  <option value="CR">Costa Rica</option>
                  <option value="PA">Panamá</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Referencia
                </label>
                <input
                  type="text"
                  {...register('destReference')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Referencias adicionales"
                />
              </div>
            </div>

            {/* Información del Destinatario */}
            <div className="mt-6 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-primary-400 mb-3">Datos del Destinatario (para rastreo)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    {...register('recipientName')}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Juan Pérez García"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    {...register('recipientPhone')}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="8112345678"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                <i className="fa-solid fa-info-circle mr-1"></i>
                Estos datos aparecerán en el sistema de rastreo premium
              </p>
            </div>
          </div>

          {/* Detalles del Paquete */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalles del Paquete
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight', { required: 'Requerido', min: 0.1 })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="5.5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Tipo de Paquete *
                </label>
                <select
                  {...register('packageType', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="caja">Caja</option>
                  <option value="sobre">Sobre</option>
                  <option value="pallet">Pallet</option>
                  <option value="bulto">Bulto</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register('description', { required: 'Requerido' })}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Descripción del contenido"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Valor Declarado *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('declaredValue', { required: 'Requerido', min: 0 })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Estado *
                </label>
                <select
                  {...register('status', { required: 'Requerido' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en-transito">En Tránsito</option>
                  <option value="en-aduana">En Aduana</option>
                  <option value="en-distribucion">En Distribución</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Costos */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Costos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Costo de Envío *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('shippingCost', { required: 'Requerido', min: 0 })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="50.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Seguro (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('insuranceCost')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="10.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Costos Adicionales
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('additionalCosts')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
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
              <div className="md:col-span-2">
                <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Costo Total:</span>
                    <span className="text-2xl font-bold text-primary-400">
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Opciones Adicionales
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('requiresSignature')}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-slate-300">Requiere firma al entregar</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Instrucciones Especiales
                </label>
                <textarea
                  {...register('specialInstructions')}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Instrucciones especiales de manejo o entrega"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Notas Internas
                </label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Notas internas (no visibles para el cliente)"
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
              {loading ? 'Guardando...' : 'Guardar Envío'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
