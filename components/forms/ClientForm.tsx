'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { createClient } from '@/lib/firestore'
import type { Client, Address, ClientType } from '@/types/crm'
import { Timestamp } from 'firebase/firestore'

interface ClientFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface ClientFormData {
  name: string
  email: string
  phone: string
  type: ClientType
  company?: string
  rfc?: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
  notes?: string
  tags?: string
}

export default function ClientForm({ onClose, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      type: 'individual',
      country: 'MX',
    },
  })

  const clientType = watch('type')

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true)
      setError(null)

      const address: Address = {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        reference: data.reference,
      }

      const tags = data.tags
        ? data.tags.split(',').map((tag) => tag.trim())
        : []

      await createClient({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        company: data.company,
        rfc: data.rfc,
        address,
        totalShipments: 0,
        totalSpent: 0,
        notes: data.notes,
        tags,
        isActive: true,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating client:', err)
      setError(
        err instanceof Error ? err.message : 'Error al crear el cliente'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Nuevo Cliente</h2>
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

          {/* Tipo de Cliente */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tipo de Cliente *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="individual"
                  {...register('type')}
                  className="text-primary-500"
                />
                <span className="text-slate-300">Individual</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="empresa"
                  {...register('type')}
                  className="text-primary-500"
                />
                <span className="text-slate-300">Empresa</span>
              </label>
            </div>
          </div>

          {/* Información Básica */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                {...register('name', { required: 'El nombre es requerido' })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Juan Pérez"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="juan@ejemplo.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'El teléfono es requerido' })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="+1 (346) 555-0123"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {clientType === 'empresa' && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  {...register('company')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Nombre de la empresa"
                />
              </div>
            )}
          </div>

          {clientType === 'empresa' && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                RFC (opcional)
              </label>
              <input
                type="text"
                {...register('rfc')}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="RFC123456789"
              />
            </div>
          )}

          {/* Dirección */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dirección</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Calle y Número *
                </label>
                <input
                  type="text"
                  {...register('street', { required: 'La calle es requerida' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Calle Principal 123"
                />
                {errors.street && (
                  <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'La ciudad es requerida' })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Monterrey"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'El estado es requerido' })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Nuevo León"
                  />
                  {errors.state && (
                    <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    {...register('zipCode', {
                      required: 'El código postal es requerido',
                    })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="64000"
                  />
                  {errors.zipCode && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    País *
                  </label>
                  <select
                    {...register('country', { required: 'El país es requerido' })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="MX">México</option>
                    <option value="US">Estados Unidos</option>
                    <option value="GT">Guatemala</option>
                    <option value="SV">El Salvador</option>
                    <option value="HN">Honduras</option>
                    <option value="NI">Nicaragua</option>
                    <option value="CR">Costa Rica</option>
                    <option value="PA">Panamá</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  {...register('reference')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Entre calles X y Y"
                />
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Información Adicional
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="vip, frecuente, corporativo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Notas adicionales sobre el cliente..."
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
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
