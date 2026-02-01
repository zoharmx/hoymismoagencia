import { Mistral as MistralSDK } from '@mistralai/mistralai'

export interface MistralMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface MistralToolCall {
  name: string
  arguments: any
}

// Helper function to convert content to string
function contentToString(content: string | any[] | null | undefined): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(chunk => {
      if (typeof chunk === 'string') return chunk
      if (chunk.text) return chunk.text
      return JSON.stringify(chunk)
    }).join('')
  }
  return String(content)
}

export class MistralClient {
  private client: MistralSDK | null = null
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey
      this.client = new MistralSDK({ apiKey })
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    this.client = new MistralSDK({ apiKey })
  }

  async chat(
    messages: MistralMessage[],
    tools?: any[],
    model: string = 'mistral-large-latest'
  ): Promise<{
    content: string
    toolCalls?: MistralToolCall[]
  }> {
    if (!this.client || !this.apiKey) {
      throw new Error('Mistral API key not configured')
    }

    try {
      const response = await this.client.chat.complete({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        tools,
        toolChoice: tools && tools.length > 0 ? 'auto' : undefined,
        temperature: 0.7,
        maxTokens: 2000
      })

      const choice = response.choices?.[0]
      if (!choice) {
        throw new Error('No response from Mistral')
      }

      const message = choice.message

      // Check if there are tool calls
      if (message.toolCalls && message.toolCalls.length > 0) {
        return {
          content: contentToString(message.content),
          toolCalls: message.toolCalls.map((tc: any) => ({
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments)
          }))
        }
      }

      return {
        content: contentToString(message.content) || 'Lo siento, no pude generar una respuesta.'
      }
    } catch (error: any) {
      console.error('Mistral API error:', error)
      throw new Error(`Error de Mistral: ${error.message || 'Unknown error'}`)
    }
  }

  async chatWithFunctionCalling(
    messages: MistralMessage[],
    tools: any[],
    executeToolFn: (name: string, args: any) => Promise<any>,
    maxIterations: number = 5
  ): Promise<string> {
    let currentMessages = [...messages]
    let iterations = 0

    while (iterations < maxIterations) {
      iterations++

      const response = await this.chat(currentMessages, tools)

      // If no tool calls, return the response
      if (!response.toolCalls || response.toolCalls.length === 0) {
        return response.content
      }

      // Execute tool calls
      const toolResults = await Promise.all(
        response.toolCalls.map(async (toolCall) => {
          try {
            const result = await executeToolFn(toolCall.name, toolCall.arguments)
            return {
              name: toolCall.name,
              result
            }
          } catch (error: any) {
            return {
              name: toolCall.name,
              error: error.message
            }
          }
        })
      )

      // Add assistant message with tool calls
      currentMessages.push({
        role: 'assistant',
        content: response.content || 'Ejecutando herramientas...'
      })

      // Add tool results as user message
      const toolResultsText = toolResults
        .map(tr => {
          if (tr.error) {
            return `Error en ${tr.name}: ${tr.error}`
          }
          return `Resultado de ${tr.name}: ${JSON.stringify(tr.result, null, 2)}`
        })
        .join('\n\n')

      currentMessages.push({
        role: 'user',
        content: `Resultados de las herramientas:\n${toolResultsText}\n\nCon base en estos resultados, proporciona una respuesta clara y útil al usuario en español.`
      })
    }

    return 'Se alcanzó el límite de iteraciones. Por favor intenta reformular tu pregunta.'
  }
}

// Singleton instance
let mistralInstance: MistralClient | null = null

export function getMistralClient(apiKey?: string): MistralClient {
  if (!mistralInstance) {
    mistralInstance = new MistralClient(apiKey)
  } else if (apiKey) {
    mistralInstance.setApiKey(apiKey)
  }
  return mistralInstance
}
