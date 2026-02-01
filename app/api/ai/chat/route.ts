import { NextRequest, NextResponse } from 'next/server'
import { getMistralClient } from '@/lib/ai/mistral'
import { getDeepSeekClient } from '@/lib/ai/deepseek'
import { tools, executeTool } from '@/lib/ai/tools'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    // Get API keys from environment variables
    const mistralApiKey = process.env.MISTRAL_API_KEY
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY

    // System prompt for the AI assistant
    const systemPrompt = {
      role: 'system' as const,
      content: `Eres un asistente inteligente para HoyMismo Paquetería, un sistema CRM de gestión de envíos y logística.

Tu función es ayudar a los usuarios con:
- Búsqueda de clientes, envíos y facturas
- Generación de cotizaciones de envío
- Cálculos de costos y tarifas
- Estadísticas y reportes
- Rastreo de paquetes

IMPORTANTE:
- Responde SIEMPRE en español de México
- Sé conciso y profesional
- Cuando uses herramientas, explica los resultados de forma clara
- Si no tienes suficiente información, pide más detalles al usuario
- Para búsquedas, usa las herramientas disponibles
- Formatea los números de moneda como "$X,XXX.XX MXN"
- Las fechas deben estar en formato "día de mes de año"

Herramientas disponibles:
- search_clients: Busca clientes por nombre, email o ID
- search_shipments: Busca envíos por tracking number o ID
- get_all_clients: Lista todos los clientes
- get_all_shipments: Lista todos los envíos
- get_all_invoices: Lista todas las facturas
- calculate_shipping_quote: Calcula cotizaciones de envío
- calculate_total_revenue: Calcula ingresos totales
- get_shipment_statistics: Obtiene estadísticas de envíos

Usa las herramientas cuando sea necesario para responder con datos precisos.`
    }

    const conversationMessages = [systemPrompt, ...messages]

    let response: string
    let usedTools: any[] = []

    // Try Mistral first
    if (mistralApiKey) {
      try {
        const mistralClient = getMistralClient(mistralApiKey)
        response = await mistralClient.chatWithFunctionCalling(
          conversationMessages,
          tools,
          async (name: string, args: any) => {
            usedTools.push({ name, arguments: args })
            return await executeTool(name, args)
          }
        )

        return NextResponse.json({
          response,
          model: 'mistral',
          toolCalls: usedTools
        })
      } catch (mistralError: any) {
        console.error('Mistral error, falling back to DeepSeek:', mistralError)
        // Fall through to DeepSeek
      }
    }

    // Try DeepSeek as fallback
    if (deepseekApiKey) {
      try {
        const deepseekClient = getDeepSeekClient(deepseekApiKey)
        response = await deepseekClient.chatWithFunctionCalling(
          conversationMessages,
          tools,
          async (name: string, args: any) => {
            usedTools.push({ name, arguments: args })
            return await executeTool(name, args)
          }
        )

        return NextResponse.json({
          response,
          model: 'deepseek',
          toolCalls: usedTools
        })
      } catch (deepseekError: any) {
        console.error('DeepSeek error:', deepseekError)
        throw deepseekError
      }
    }

    // No API keys configured
    return NextResponse.json(
      {
        error: 'No AI API keys configured',
        response: 'Lo siento, el asistente de IA no está configurado. Por favor contacta al administrador para configurar las API keys de Mistral o DeepSeek en la sección de Configuración.'
      },
      { status: 503 }
    )

  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        response: 'Lo siento, ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.'
      },
      { status: 500 }
    )
  }
}
