export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface DeepSeekToolCall {
  name: string
  arguments: any
}

export class DeepSeekClient {
  private apiKey: string | null = null
  private baseURL = 'https://api.deepseek.com/v1'

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(
    messages: DeepSeekMessage[],
    tools?: any[],
    model: string = 'deepseek-chat'
  ): Promise<{
    content: string
    toolCalls?: DeepSeekToolCall[]
  }> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured')
    }

    try {
      const requestBody: any = {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2000
      }

      if (tools && tools.length > 0) {
        requestBody.tools = tools
        requestBody.tool_choice = 'auto'
      }

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`DeepSeek API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const choice = data.choices?.[0]

      if (!choice) {
        throw new Error('No response from DeepSeek')
      }

      const message = choice.message

      // Check if there are tool calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        return {
          content: message.content || '',
          toolCalls: message.tool_calls.map((tc: any) => ({
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments)
          }))
        }
      }

      return {
        content: message.content || 'Lo siento, no pude generar una respuesta.'
      }
    } catch (error: any) {
      console.error('DeepSeek API error:', error)
      throw new Error(`Error de DeepSeek: ${error.message || 'Unknown error'}`)
    }
  }

  async chatWithFunctionCalling(
    messages: DeepSeekMessage[],
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
let deepseekInstance: DeepSeekClient | null = null

export function getDeepSeekClient(apiKey?: string): DeepSeekClient {
  if (!deepseekInstance) {
    deepseekInstance = new DeepSeekClient(apiKey)
  } else if (apiKey) {
    deepseekInstance.setApiKey(apiKey)
  }
  return deepseekInstance
}
