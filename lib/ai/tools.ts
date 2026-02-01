import {
  getClients,
  getImportProcesses,
  getInvoices,
  searchClients,
  searchImportProcesses,
  getClientProcesses,
  getClientInvoices,
  getVehicles,
  searchVehicles,
  getProcessByFolio,
  getProcessByVin,
  getGestorProcesses,
  getProcessesByOffice,
  getProcessStats,
} from '@/lib/firestore'

// Tool definitions for AI function calling - HoyMismo Agencia Aduanal
export const tools = [
  {
    type: 'function',
    function: {
      name: 'search_clients',
      description: 'Busca clientes por nombre, apellido, email, teléfono o ID. Útil para encontrar información de clientes específicos.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'El nombre, email, teléfono o ID del cliente a buscar'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_processes',
      description: 'Busca trámites de importación por folio, VIN del vehículo o nombre del cliente. Útil para rastrear el estado de un trámite.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'El folio del trámite (ej: USHO-1234), VIN del vehículo o nombre del cliente'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_vehicles',
      description: 'Busca vehículos por VIN, marca, modelo o color.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'El VIN, marca, modelo o color del vehículo'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_process_by_folio',
      description: 'Obtiene un trámite específico por su número de folio.',
      parameters: {
        type: 'object',
        properties: {
          folio: {
            type: 'string',
            description: 'El número de folio del trámite (ej: USHO-1234)'
          }
        },
        required: ['folio']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_process_by_vin',
      description: 'Obtiene el trámite de importación asociado a un vehículo por su VIN.',
      parameters: {
        type: 'object',
        properties: {
          vin: {
            type: 'string',
            description: 'El número VIN del vehículo'
          }
        },
        required: ['vin']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_clients',
      description: 'Obtiene la lista completa de todos los clientes. Útil para estadísticas generales.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_processes',
      description: 'Obtiene la lista completa de todos los trámites de importación. Útil para estadísticas.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_vehicles',
      description: 'Obtiene la lista completa de todos los vehículos registrados.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_invoices',
      description: 'Obtiene la lista completa de todas las facturas. Útil para análisis financiero.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_client_processes',
      description: 'Obtiene todos los trámites de importación de un cliente específico.',
      parameters: {
        type: 'object',
        properties: {
          clientId: {
            type: 'string',
            description: 'El ID interno del cliente (id de Firestore)'
          }
        },
        required: ['clientId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_client_invoices',
      description: 'Obtiene todas las facturas de un cliente específico.',
      parameters: {
        type: 'object',
        properties: {
          clientId: {
            type: 'string',
            description: 'El ID interno del cliente (id de Firestore)'
          }
        },
        required: ['clientId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_gestor_processes',
      description: 'Obtiene todos los trámites asignados a un gestor específico.',
      parameters: {
        type: 'object',
        properties: {
          gestorId: {
            type: 'string',
            description: 'El ID del gestor'
          }
        },
        required: ['gestorId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_processes_by_office',
      description: 'Obtiene todos los trámites de una oficina específica (Tijuana, Nogales, etc.).',
      parameters: {
        type: 'object',
        properties: {
          oficina: {
            type: 'string',
            description: 'El nombre de la oficina (ej: CINTHIA-TIJ, VICTORIA-NOG)'
          }
        },
        required: ['oficina']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate_import_quote',
      description: 'Calcula una cotización estimada para un trámite de importación vehicular.',
      parameters: {
        type: 'object',
        properties: {
          tipoPedimento: {
            type: 'string',
            enum: ['A1 - Importación definitiva', 'A2 - Importación temporal', 'F4 - Retorno de vehículo'],
            description: 'Tipo de pedimento de importación'
          },
          vehicleValue: {
            type: 'number',
            description: 'Valor aproximado del vehículo en USD'
          },
          vehicleYear: {
            type: 'number',
            description: 'Año del vehículo'
          },
          oficina: {
            type: 'string',
            description: 'Oficina donde se realizará el trámite'
          }
        },
        required: ['tipoPedimento', 'vehicleValue']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate_total_revenue',
      description: 'Calcula el ingreso total de facturas pagadas, pendientes o vencidas.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pagada', 'pendiente', 'vencida', 'all'],
            description: 'Filtrar por estatus de factura'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_process_statistics',
      description: 'Obtiene estadísticas de trámites de importación por estatus, oficina o gestor.',
      parameters: {
        type: 'object',
        properties: {
          groupBy: {
            type: 'string',
            enum: ['status', 'office', 'gestor', 'pedimento'],
            description: 'Agrupar estadísticas por estatus, oficina, gestor o tipo de pedimento'
          }
        },
        required: ['groupBy']
      }
    }
  }
]

// Tool execution functions
export async function executeTool(toolName: string, args: any) {
  switch (toolName) {
    case 'search_clients':
      return await searchClients(args.query)

    case 'search_processes':
      return await searchImportProcesses(args.query)

    case 'search_vehicles':
      return await searchVehicles(args.query)

    case 'get_process_by_folio':
      return await getProcessByFolio(args.folio)

    case 'get_process_by_vin':
      return await getProcessByVin(args.vin)

    case 'get_all_clients':
      return await getClients()

    case 'get_all_processes':
      return await getImportProcesses()

    case 'get_all_vehicles':
      return await getVehicles()

    case 'get_all_invoices':
      return await getInvoices()

    case 'get_client_processes':
      return await getClientProcesses(args.clientId)

    case 'get_client_invoices':
      return await getClientInvoices(args.clientId)

    case 'get_gestor_processes':
      return await getGestorProcesses(args.gestorId)

    case 'get_processes_by_office':
      return await getProcessesByOffice(args.oficina)

    case 'calculate_import_quote':
      return calculateImportQuote(args)

    case 'calculate_total_revenue':
      const invoices = await getInvoices()
      return calculateRevenue(invoices, args.status || 'all')

    case 'get_process_statistics':
      return await getProcessStatistics(args.groupBy)

    // Aliases for legacy code compatibility
    case 'search_shipments':
      return await searchImportProcesses(args.query)

    case 'get_all_shipments':
      return await getImportProcesses()

    case 'get_client_shipments':
      return await getClientProcesses(args.clientId)

    case 'get_shipment_statistics':
      return await getProcessStatistics(args.groupBy || 'status')

    default:
      throw new Error(`Tool ${toolName} not found`)
  }
}

// Helper function: Calculate import quote
function calculateImportQuote(params: {
  tipoPedimento: string
  vehicleValue: number
  vehicleYear?: number
  oficina?: string
}) {
  const { tipoPedimento, vehicleValue, vehicleYear, oficina } = params

  // Base fees for import process
  const baseFees = {
    'A1 - Importación definitiva': 800,
    'A2 - Importación temporal': 600,
    'F4 - Retorno de vehículo': 400,
  }

  const baseFee = baseFees[tipoPedimento as keyof typeof baseFees] || 700

  // Import duties (approximation based on vehicle value)
  // ISAN, IVA, IGI
  const importDuties = vehicleValue * 0.16 // 16% IVA aproximado
  const igi = vehicleValue * 0.10 // 10% Impuesto General de Importación
  const isan = vehicleYear && vehicleYear < 2015 ? 0 : vehicleValue * 0.03 // 3% ISAN para vehículos nuevos

  // Agency fee
  const agencyFee = baseFee

  // Validation and processing
  const validationFee = 150
  const processingFee = 100

  const subtotal = importDuties + igi + isan + agencyFee + validationFee + processingFee
  const total = subtotal

  return {
    breakdown: {
      iva: Math.round(importDuties * 100) / 100,
      igi: Math.round(igi * 100) / 100,
      isan: Math.round(isan * 100) / 100,
      agencyFee: Math.round(agencyFee * 100) / 100,
      validationFee: Math.round(validationFee * 100) / 100,
      processingFee: Math.round(processingFee * 100) / 100,
      total: Math.round(total * 100) / 100
    },
    details: {
      tipoPedimento,
      vehicleValue: `$${vehicleValue.toLocaleString()} USD`,
      vehicleYear: vehicleYear || 'No especificado',
      oficina: oficina || 'Por asignar',
      estimatedDays: '5-10 días hábiles',
      anticipo: Math.round(total * 0.5 * 100) / 100, // 50% anticipo sugerido
      saldo: Math.round(total * 0.5 * 100) / 100
    },
    disclaimer: 'Esta es una cotización estimada. El costo final puede variar según el valor exacto del vehículo, tipo específico y condiciones del trámite.'
  }
}

// Helper function: Calculate revenue
function calculateRevenue(invoices: any[], status: string) {
  let filtered = invoices

  if (status !== 'all') {
    filtered = invoices.filter(inv => inv.status === status)
  }

  const total = filtered.reduce((sum, inv) => sum + inv.total, 0)
  const count = filtered.length

  return {
    total: Math.round(total * 100) / 100,
    count,
    average: count > 0 ? Math.round((total / count) * 100) / 100 : 0,
    status: status === 'all' ? 'todas' : status
  }
}

// Helper function: Process statistics
async function getProcessStatistics(groupBy: string) {
  const stats = await getProcessStats()
  const processes = await getImportProcesses({}, 1000)

  if (groupBy === 'status') {
    return {
      total: stats.total,
      byStatus: stats.byStatus,
      summary: {
        pending: stats.pending,
        inProgress: stats.inProgress,
        completed: stats.completed,
        cancelled: stats.cancelled
      },
      groupedBy: 'status'
    }
  }

  if (groupBy === 'office') {
    return {
      total: stats.total,
      byOffice: stats.byOffice,
      groupedBy: 'office'
    }
  }

  if (groupBy === 'gestor') {
    const gestorCount: Record<string, number> = {}
    processes.forEach(proc => {
      const gestor = proc.gestorName || 'Sin asignar'
      gestorCount[gestor] = (gestorCount[gestor] || 0) + 1
    })

    const topGestores = Object.entries(gestorCount)
      .sort(([, a], [, b]) => b - a)
      .map(([gestor, count]) => ({ gestor, processes: count }))

    return {
      total: stats.total,
      byGestor: gestorCount,
      topGestores,
      groupedBy: 'gestor'
    }
  }

  if (groupBy === 'pedimento') {
    const pedimentoCount: Record<string, number> = {}
    processes.forEach(proc => {
      const tipo = proc.tipoPedimento || 'No especificado'
      pedimentoCount[tipo] = (pedimentoCount[tipo] || 0) + 1
    })

    return {
      total: stats.total,
      byPedimento: pedimentoCount,
      groupedBy: 'pedimento'
    }
  }

  return { error: 'Invalid groupBy parameter' }
}

// Legacy aliases for backward compatibility
export const searchShipments = searchImportProcesses
export const getClientShipments = getClientProcesses
