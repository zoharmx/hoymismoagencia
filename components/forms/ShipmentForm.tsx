'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Car, FileText, DollarSign, User } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { createShipment } from '@/lib/firestore/shipments'
import { getClients } from '@/lib/firestore/clients'
import type { ImportProcessStatus, Client, PedimentoType } from '@/types/crm'

interface ShipmentFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface TramiteFormData {
  // Cliente
  clientId: string

  // Vehículo
  vehicleVin: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear?: number
  vehicleColor?: string

  // Trámite
  tipoPedimento: PedimentoType
  oficina: string
  status: ImportProcessStatus

  // Pagos
  anticipo: number
  liquidacion?: number
  currency: string

  // Adicional
  gestorName?: string
  notes?: string
}

// Oficinas de aduana disponibles
const OFICINAS = [
  'Tijuana',
  'Nogales',
  'Ciudad Juárez',
  'Nuevo Laredo',
  'Laredo',
  'Piedras Negras',
  'Reynosa',
  'Matamoros',
  'San Luis Río Colorado',
  'Mexicali',
  'Otra'
]

// Marcas de vehículos comunes
const MARCAS_VEHICULOS = [
  'Ford',
  'Chevrolet',
  'Toyota',
  'Honda',
  'Nissan',
  'Dodge',
  'Jeep',
  'GMC',
  'RAM',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Lexus',
  'Cadillac',
  'Buick',
  'Lincoln',
  'Chrysler',
  'Otra'
]

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
  } = useForm<TramiteFormData>({
    defaultValues: {
      status: 'contacto-creado',
      currency: 'USD',
      tipoPedimento: 'A1 - Importación definitiva',
      oficina: 'Nuevo Laredo',
      anticipo: 0,
    },
  })

  const anticipo = watch('anticipo') || 0
  const liquidacion = watch('liquidacion') || 0
  const totalCost = Number(anticipo) + Number(liquidacion)

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

  // Validar VIN (17 caracteres alfanuméricos)
  const validateVin = (vin: string) => {
    if (!vin) return 'El VIN es requerido'
    if (vin.length !== 17) return 'El VIN debe tener exactamente 17 caracteres'
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return 'El VIN contiene caracteres inválidos'
    return true
  }

  const onSubmit = async (data: TramiteFormData) => {
    try {
      setLoading(true)
      setError(null)

      const selectedClient = clients.find((c) => c.id === data.clientId)
      if (!selectedClient) {
        throw new Error('Cliente no encontrado')
      }

      // Generar folio automático
      const folio = `USHO-${Date.now().toString().slice(-6)}`

      // Generar ID de vehículo basado en VIN
      const vehicleId = `VEH-${data.vehicleVin.toUpperCase().slice(-8)}`

      await createShipment({
        // IDs
        clientId: data.clientId,
        clientName: selectedClient.name,
        folio,
        vehicleId,

        // Vehículo
        vehicleVin: data.vehicleVin.toUpperCase(),
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,

        // Trámite
        tipoPedimento: data.tipoPedimento,
        oficina: data.oficina,
        status: data.status,
        fechaInicio: Timestamp.now(),

        // Pagos
        anticipo: Number(data.anticipo),
        liquidacion: data.liquidacion ? Number(data.liquidacion) : 0,
        totalCost,
        currency: data.currency,

        // Adicional
        gestorName: data.gestorName,
        notes: data.notes,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating tramite:', err)
      setError(
        err instanceof Error ? err.message : 'Error al crear el trámite'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Nuevo Trámite de Importación</h2>
            <p className="text-sm text-slate-400 mt-1">Registro de importación vehicular</p>
          </div>
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
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Cliente</h3>
            </div>

            {loadingClients ? (
              <div className="text-slate-400">Cargando clientes...</div>
            ) : (
              <select
                {...register('clientId', { required: 'El cliente es requerido' })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.email} ({client.clientId})
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && (
              <p className="text-red-400 text-xs mt-1">{errors.clientId.message}</p>
            )}
          </div>

          {/* Datos del Vehículo */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Datos del Vehículo</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* VIN */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  VIN (Número de Identificación Vehicular) *
                </label>
                <input
                  type="text"
                  maxLength={17}
                  {...register('vehicleVin', {
                    required: 'El VIN es requerido',
                    validate: validateVin
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono uppercase tracking-wider focus:outline-none focus:border-primary-500"
                  placeholder="1HGBH41JXMN109186"
                />
                {errors.vehicleVin && (
                  <p className="text-red-400 text-xs mt-1">{errors.vehicleVin.message}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">17 caracteres alfanuméricos (sin I, O, Q)</p>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Marca *
                </label>
                <select
                  {...register('vehicleBrand', { required: 'La marca es requerida' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">Seleccionar marca</option>
                  {MARCAS_VEHICULOS.map((marca) => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
                {errors.vehicleBrand && (
                  <p className="text-red-400 text-xs mt-1">{errors.vehicleBrand.message}</p>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  {...register('vehicleModel', { required: 'El modelo es requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Mustang, RAV4, Civic..."
                />
                {errors.vehicleModel && (
                  <p className="text-red-400 text-xs mt-1">{errors.vehicleModel.message}</p>
                )}
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Año
                </label>
                <input
                  type="number"
                  min={1980}
                  max={new Date().getFullYear() + 1}
                  {...register('vehicleYear', {
                    min: { value: 1980, message: 'El año mínimo es 1980' },
                    max: { value: new Date().getFullYear() + 1, message: 'Año inválido' }
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="2020"
                />
                {errors.vehicleYear && (
                  <p className="text-red-400 text-xs mt-1">{errors.vehicleYear.message}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Color
                </label>
                <input
                  type="text"
                  {...register('vehicleColor')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Blanco, Negro, Rojo..."
                />
              </div>
            </div>
          </div>

          {/* Información del Trámite */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Información del Trámite</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Tipo de Pedimento */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Tipo de Pedimento *
                </label>
                <select
                  {...register('tipoPedimento', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="A1 - Importación definitiva">A1 - Importación definitiva</option>
                  <option value="A2 - Importación temporal">A2 - Importación temporal</option>
                  <option value="F4 - Retorno de vehículo">F4 - Retorno de vehículo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Oficina */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Oficina de Aduana *
                </label>
                <select
                  {...register('oficina', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  {OFICINAS.map((oficina) => (
                    <option key={oficina} value={oficina}>{oficina}</option>
                  ))}
                </select>
              </div>

              {/* Estado del Trámite */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Estado Inicial *
                </label>
                <select
                  {...register('status', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="contacto-creado">Contacto Creado</option>
                  <option value="documentacion-inicial">Documentación Inicial</option>
                  <option value="vehiculo-validado">Vehículo Validado</option>
                  <option value="anticipo-recibido">Anticipo Recibido</option>
                  <option value="tramite-en-proceso">Trámite en Proceso</option>
                  <option value="pedimento-generado">Pedimento Generado</option>
                  <option value="liquidacion">Liquidación</option>
                  <option value="tramite-finalizado">Trámite Finalizado</option>
                </select>
              </div>

              {/* Gestor Asignado */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Gestor Asignado
                </label>
                <input
                  type="text"
                  {...register('gestorName')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Nombre del gestor"
                />
              </div>
            </div>
          </div>

          {/* Pagos */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Pagos</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Anticipo */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Anticipo *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register('anticipo', { required: 'Requerido', min: 0 })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>

              {/* Liquidación */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Liquidación
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register('liquidacion')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>

              {/* Moneda */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Moneda *
                </label>
                <select
                  {...register('currency', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="USD">USD (Dólares)</option>
                  <option value="MXN">MXN (Pesos)</option>
                </select>
              </div>

              {/* Total */}
              <div className="md:col-span-3">
                <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Costo Total:</span>
                    <span className="text-2xl font-bold text-primary-400">
                      ${totalCost.toFixed(2)} {watch('currency')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Notas del Trámite
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
              placeholder="Observaciones adicionales sobre el trámite..."
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Crear Trámite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
