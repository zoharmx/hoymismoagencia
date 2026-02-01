'use client'

import { useState, useEffect } from 'react'
import { useCompanySettings, useSystemSettings } from '@/lib/hooks/useFirestore'
import { saveCompanySettings, saveSystemSettings } from '@/lib/firestore'
import {
  Settings,
  Building,
  Globe,
  Mail,
  Phone,
  Save,
  Loader2,
  Bell,
  MessageSquare,
  FileText,
  Package,
  Users,
  DollarSign,
  Clock,
  Key,
  Bot,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { CompanySettings, SystemSettings } from '@/types/crm'

export default function SettingsSection() {
  const { settings: companySettings, loading: loadingCompany, refetch: refetchCompany } = useCompanySettings()
  const { settings: systemSettings, loading: loadingSystem, refetch: refetchSystem } = useSystemSettings()

  const [activeTab, setActiveTab] = useState<'company' | 'system'>('company')
  const [saving, setSaving] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState({
    mistral: false,
    deepseek: false,
    twillio: false,
    sendgrid: false,
  })

  // Company form
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    legalName: '',
    rfc: '',
    phone: '',
    email: '',
    website: '',
    taxRate: 16,
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    language: 'es',
  })

  // System form
  const [systemForm, setSystemForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoInvoicing: false,
    invoicePrefix: 'INV',
    shipmentPrefix: 'HM',
    clientPrefix: 'CLT',
    lowStockAlert: false,
    maintenanceMode: false,
    apiKeys: {
      mistral: '',
      deepseek: '',
      twillio: '',
      sendgrid: '',
    },
  })

  useEffect(() => {
    if (companySettings) {
      setCompanyForm({
        companyName: companySettings.companyName,
        legalName: companySettings.legalName || '',
        rfc: companySettings.rfc || '',
        phone: companySettings.phone,
        email: companySettings.email,
        website: companySettings.website || '',
        taxRate: companySettings.taxRate,
        currency: companySettings.currency,
        timezone: companySettings.timezone,
        language: companySettings.language,
      })
    }
  }, [companySettings])

  useEffect(() => {
    if (systemSettings) {
      setSystemForm({
        emailNotifications: systemSettings.emailNotifications,
        smsNotifications: systemSettings.smsNotifications,
        autoInvoicing: systemSettings.autoInvoicing,
        invoicePrefix: systemSettings.invoicePrefix,
        shipmentPrefix: systemSettings.shipmentPrefix,
        clientPrefix: systemSettings.clientPrefix,
        lowStockAlert: systemSettings.lowStockAlert,
        maintenanceMode: systemSettings.maintenanceMode,
        apiKeys: {
          mistral: systemSettings.apiKeys?.mistral || '',
          deepseek: systemSettings.apiKeys?.deepseek || '',
          twillio: systemSettings.apiKeys?.twillio || '',
          sendgrid: systemSettings.apiKeys?.sendgrid || '',
        },
      })
    }
  }, [systemSettings])

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveCompanySettings(companyForm)
      refetchCompany()
      alert('Configuración de empresa guardada exitosamente')
    } catch (error) {
      console.error('Error saving company settings:', error)
      alert('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystem = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSystemSettings(systemForm)
      refetchSystem()
      alert('Configuración del sistema guardada exitosamente')
    } catch (error) {
      console.error('Error saving system settings:', error)
      alert('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const loading = loadingCompany || loadingSystem

  return (
    <div className="card-gradient p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
        <p className="text-slate-400 text-sm mt-1">
          Personaliza y configura tu dashboard
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'company'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Empresa
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'system'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Sistema
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Company Settings Tab */}
          {activeTab === 'company' && (
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.companyName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="HoyMismo Paquetería"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={companyForm.legalName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, legalName: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="HoyMismo S.A. de C.V."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Key className="w-4 h-4 inline mr-2" />
                    RFC
                  </label>
                  <input
                    type="text"
                    value={companyForm.rfc}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, rfc: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="HMP920312ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={companyForm.phone}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="+1 (346) 555-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="info@hoymismo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={companyForm.website}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, website: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="https://hoymismo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Tasa de Impuesto (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    value={companyForm.taxRate}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        taxRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Moneda *
                  </label>
                  <select
                    value={companyForm.currency}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, currency: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Zona Horaria *
                  </label>
                  <select
                    value={companyForm.timezone}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="America/Mexico_City">Ciudad de México (CST)</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="America/Los_Angeles">Los Angeles (PST)</option>
                    <option value="America/Chicago">Chicago (CST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Idioma *
                  </label>
                  <select
                    value={companyForm.language}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, language: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 btn-primary disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <form onSubmit={handleSaveSystem} className="space-y-6">
              <div className="space-y-6">
                {/* Notificaciones */}
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Notificaciones por Email</p>
                        <p className="text-sm text-slate-400">
                          Recibir notificaciones importantes por correo electrónico
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemForm.emailNotifications}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Notificaciones por SMS</p>
                        <p className="text-sm text-slate-400">
                          Recibir alertas críticas por mensaje de texto
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemForm.smsNotifications}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            smsNotifications: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Automatización */}
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Automatización
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Facturación Automática</p>
                        <p className="text-sm text-slate-400">
                          Generar facturas automáticamente al completar envíos
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemForm.autoInvoicing}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            autoInvoicing: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Alertas de Stock Bajo</p>
                        <p className="text-sm text-slate-400">
                          Notificar cuando el inventario esté bajo
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemForm.lowStockAlert}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            lowStockAlert: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Prefijos */}
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Prefijos de Identificadores
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Facturas
                      </label>
                      <input
                        type="text"
                        required
                        value={systemForm.invoicePrefix}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            invoicePrefix: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Envíos
                      </label>
                      <input
                        type="text"
                        required
                        value={systemForm.shipmentPrefix}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            shipmentPrefix: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Clientes
                      </label>
                      <input
                        type="text"
                        required
                        value={systemForm.clientPrefix}
                        onChange={(e) =>
                          setSystemForm({
                            ...systemForm,
                            clientPrefix: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* API Keys */}
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary-400" />
                    API Keys (Asistente IA)
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Configura las claves API para habilitar el asistente de IA con Mistral y DeepSeek.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Mistral AI API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.mistral ? 'text' : 'password'}
                          value={systemForm.apiKeys.mistral}
                          onChange={(e) =>
                            setSystemForm({
                              ...systemForm,
                              apiKeys: {
                                ...systemForm.apiKeys,
                                mistral: e.target.value,
                              },
                            })
                          }
                          placeholder="sk-..."
                          className="w-full px-4 py-2 pr-12 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowApiKeys({
                              ...showApiKeys,
                              mistral: !showApiKeys.mistral,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showApiKeys.mistral ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Obtén tu API key en{' '}
                        <a
                          href="https://console.mistral.ai/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:underline"
                        >
                          console.mistral.ai
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        DeepSeek API Key (Alternativa)
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.deepseek ? 'text' : 'password'}
                          value={systemForm.apiKeys.deepseek}
                          onChange={(e) =>
                            setSystemForm({
                              ...systemForm,
                              apiKeys: {
                                ...systemForm.apiKeys,
                                deepseek: e.target.value,
                              },
                            })
                          }
                          placeholder="sk-..."
                          className="w-full px-4 py-2 pr-12 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowApiKeys({
                              ...showApiKeys,
                              deepseek: !showApiKeys.deepseek,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showApiKeys.deepseek ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Obtén tu API key en{' '}
                        <a
                          href="https://platform.deepseek.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:underline"
                        >
                          platform.deepseek.com
                        </a>
                      </p>
                    </div>

                    <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                      <p className="text-xs text-primary-400">
                        💡 El sistema intentará usar Mistral primero. Si Mistral falla o no está
                        configurado, usará DeepSeek como alternativa. Configura al menos una de las
                        dos API keys para habilitar el asistente de IA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modo Mantenimiento */}
                <div className="p-6 bg-slate-800/50 rounded-lg border-2 border-red-500/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-red-400" />
                    Zona de Peligro
                  </h3>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-white font-medium text-red-400">
                        Modo Mantenimiento
                      </p>
                      <p className="text-sm text-slate-400">
                        Desactivar el sistema temporalmente para mantenimiento
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemForm.maintenanceMode}
                      onChange={(e) =>
                        setSystemForm({
                          ...systemForm,
                          maintenanceMode: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-red-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 btn-primary disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
