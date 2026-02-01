'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Car, User, FileText, DollarSign } from 'lucide-react'
import { createImportProcess } from '@/lib/firestore/import-processes'
import { createVehicle, getVehicleByVin } from '@/lib/firestore/vehicles'
import { getClients } from '@/lib/firestore/clients'
import type { ImportProcessStatus, PedimentoType, Client } from '@/types/crm'
import { Timestamp } from 'firebase/firestore'

interface ImportProcessFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  // Cliente
  clientId: string
  // Vehículo
  vin: string
  marca: string
  modelo: string
  color: string
  anio: number
  // Trámite
  tipoPedimento: PedimentoType
  oficina: string
  status: ImportProcessStatus
  // Pagos
  anticipo: number
  liquidacion: number
  currency: string
  // Notas
  notes?: string
}

const OFICINAS = [
  'CINTHIA-TIJ',
  'VICTORIA-NOG',
  'LUIS-LAR',
  'MARIA-CDJ',
  'Otra'
]

const STATUS_OPTIONS: { value: ImportProcessStatus; label: string }[] = [
  { value: 'contacto-creado', label: 'Contacto Creado' },
  { value: 'documentacion-inicial', label: 'Documentación Inicial' },
  { value: 'vehiculo-validado', label: 'Vehículo Validado' },
  { value: 'anticipo-recibido', label: 'Anticipo Recibido' },
  { value: 'tramite-en-proceso', label: 'Trámite en Proceso' },
  { value: 'pedimento-generado', label: 'Pedimento Generado' },
  { value: 'liquidacion', label: 'Liquidación' },
  { value: 'tramite-finalizado', label: 'Trámite Finalizado' },
]

const TIPO_PEDIMENTO_OPTIONS: PedimentoType[] = [
  'A1 - Importación definitiva',
  'A2 - Importación temporal',
  'F4 - Retorno de vehículo',
  'Otro'
]

export default function ImportProcessForm({ onClose, onSuccess }: ImportProcessFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [vinExists, setVinExists] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      status: 'contacto-creado',
      currency: 'USD',
      tipoPedimento: 'A1 - Importación definitiva',
      oficina: 'CINTHIA-TIJ',
      anticipo: 0,
      liquidacion: 0,
    },
  })

  const anticipo = watch('anticipo') || 0
  const liquidacion = watch('liquidacion') || 0
  const totalCost = Number(anticipo) + Number(liquidacion)
  const vin = watch('vin')

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

  // Verificar si el VIN ya existe
  useEffect(() => {
    const checkVin = async () => {
      if (vin && vin.length >= 17) {
        const existingVehicle = await getVehicleByVin(vin)
        setVinExists(existingVehicle !== null)
      } else {
        setVinExists(false)
      }
    }
    checkVin()
  }, [vin])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError(null)

      const selectedClient = clients.find((c) => c.id === data.clientId)
      if (!selectedClient) {
        throw new Error('Cliente no encontrado')
      }

      // Crear o obtener vehículo
      let vehicleId = ''
      let existingVehicle = await getVehicleByVin(data.vin)

      if (existingVehicle) {
        vehicleId = existingVehicle.id
      } else {
        const newVehicle = await createVehicle({
          vin: data.vin.toUpperCase(),
          brand: data.marca,
          model: data.modelo,
          color: data.color,
          year: data.anio ? Number(data.anio) : undefined,
          clientId: data.clientId,
        })
        vehicleId = newVehicle.id
      }

      // Crear trámite de importación
      await createImportProcess({
        clientId: data.clientId,
        clientName: `${selectedClient.name} ${selectedClient.lastName || ''}`.trim(),
        vehicleId,
        vehicleVin: data.vin.toUpperCase(),
        vehicleBrand: data.marca,
        vehicleModel: data.modelo,
        tipoPedimento: data.tipoPedimento,
        oficina: data.oficina,
        status: data.status,
        fechaInicio: Timestamp.now(),
        anticipo: Number(data.anticipo),
        liquidacion: Number(data.liquidacion),
        totalCost,
        currency: data.currency,
        notes: data.notes,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating import process:', err)
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
            <p className="text-slate-400 text-sm mt-1">Registrar un nuevo trámite de importación vehicular</p>
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
          <div className="border-b border-white/10 pb-6">
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
                    {client.name} {client.lastName} - {client.clientId} - {client.email}
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && (
              <p className="text-red-400 text-xs mt-1">{errors.clientId.message}</p>
            )}
          </div>

          {/* Vehículo */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Datos del Vehículo</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  VIN (Número de Identificación Vehicular) *
                </label>
                <input
                  type="text"
                  {...register('vin', {
                    required: 'El VIN es requerido',
                    minLength: { value: 17, message: 'El VIN debe tener exactamente 17 caracteres' },
                    maxLength: { value: 17, message: 'El VIN debe tener exactamente 17 caracteres' },
                    pattern: {
                      value: /^[A-HJ-NPR-Z0-9]{17}$/i,
                      message: 'VIN inválido: solo letras (excepto I, O, Q) y números'
                    },
                  })}
                  className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-primary-500 uppercase ${
                    vinExists ? 'border-yellow-500' : errors.vin ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="1C6RR7LT1HS690473"
                  maxLength={17}
                />
                {vinExists && (
                  <p className="text-yellow-400 text-xs mt-1">
                    Este VIN ya está registrado. Se asociará al trámite existente.
                  </p>
                )}
                {errors.vin && (
                  <p className="text-red-400 text-xs mt-1">{errors.vin.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  {...register('marca', { required: 'La marca es requerida' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="DODGE, TOYOTA, CHEVROLET..."
                />
                {errors.marca && (
                  <p className="text-red-400 text-xs mt-1">{errors.marca.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  {...register('modelo', { required: 'El modelo es requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="RAM 1500, RAV4, SILVERADO..."
                />
                {errors.modelo && (
                  <p className="text-red-400 text-xs mt-1">{errors.modelo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Color
                </label>
                <input
                  type="text"
                  {...register('color')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="BLANCO, NEGRO, ROJO..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Año *
                </label>
                <input
                  type="number"
                  {...register('anio', {
                    required: 'El año es requerido',
                    min: { value: 1980, message: 'El año debe ser 1980 o posterior' },
                    max: { value: new Date().getFullYear() + 1, message: `El año no puede ser mayor a ${new Date().getFullYear() + 1}` },
                  })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="2020"
                  min={1980}
                  max={new Date().getFullYear() + 1}
                />
                {errors.anio && (
                  <p className="text-red-400 text-xs mt-1">{errors.anio.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Trámite */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Información del Trámite</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Tipo de Pedimento *
                </label>
                <select
                  {...register('tipoPedimento', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  {TIPO_PEDIMENTO_OPTIONS.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Oficina / Gestor *
                </label>
                <select
                  {...register('oficina', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  {OFICINAS.map((oficina) => (
                    <option key={oficina} value={oficina}>
                      {oficina}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Estatus del Trámite *
                </label>
                <select
                  {...register('status', { required: 'Requerido' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pagos */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Pagos</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Anticipo
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('anticipo')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Liquidación
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('liquidacion')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Moneda
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total del Trámite:</span>
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
              Notas Adicionales
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
              placeholder="Notas internas sobre el trámite..."
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
