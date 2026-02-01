// Helpers para integración con APIs de IA (DeepSeek y Mistral)

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  message: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Llama a la API de DeepSeek
 */
export async function callDeepSeekAPI(
  messages: AIMessage[]
): Promise<AIResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error('DeepSeek API key not configured')
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      message: data.choices[0].message.content,
      model: 'deepseek-chat',
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    }
  } catch (error) {
    console.error('DeepSeek API error:', error)
    throw error
  }
}

/**
 * Llama a la API de Mistral
 */
export async function callMistralAPI(
  messages: AIMessage[]
): Promise<AIResponse> {
  const apiKey = process.env.MISTRAL_API_KEY

  if (!apiKey) {
    throw new Error('Mistral API key not configured')
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      message: data.choices[0].message.content,
      model: 'mistral-small-latest',
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    }
  } catch (error) {
    console.error('Mistral API error:', error)
    throw error
  }
}

/**
 * Función principal que puede usar cualquiera de las dos APIs
 */
export async function callAIAssistant(
  userMessage: string,
  context?: string,
  provider: 'deepseek' | 'mistral' = 'deepseek'
): Promise<AIResponse> {
  const messages: AIMessage[] = []

  if (context) {
    messages.push({
      role: 'system',
      content: context,
    })
  }

  messages.push({
    role: 'user',
    content: userMessage,
  })

  if (provider === 'deepseek') {
    return callDeepSeekAPI(messages)
  } else {
    return callMistralAPI(messages)
  }
}

/**
 * Context específico para el asistente de HoyMismo Paquetería
 */
export const HOYMISMO_AI_CONTEXT = `
Eres un asistente virtual de HoyMismo Paquetería, una empresa de envíos internacionales
entre Estados Unidos, México y Centroamérica.

Información clave sobre HoyMismo:
- Ofrecemos envíos sin límite de peso
- Rastreo en tiempo real de todos los paquetes
- Flexibilidad en opciones de empaque
- Más de 1500 clientes satisfechos
- Cobertura: Estados Unidos → México y Centroamérica
- Contacto: +1 346-580-1238
- Email: ventas@hoymismopaqueteria.com

Debes ser amable, profesional y ayudar a los usuarios con:
- Información sobre servicios
- Estado de envíos (cuando proporcionen número de rastreo)
- Cotizaciones aproximadas
- Preguntas frecuentes sobre paquetería
- Guía en el proceso de envío

Responde siempre en español de manera clara y concisa.
`
