'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, X, Calculator, Package, Users, FileText, Sparkles, Mic, MicOff } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCalls?: any[]
}

interface AIAssistantProps {
  onClose?: () => void
  isModal?: boolean
}

export default function AIAssistant({ onClose, isModal = true }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Hola, soy tu asistente inteligente de HoyMismo. Puedo ayudarte con consultas de clientes, envíos, facturas, cotizaciones y cálculos. ¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.lang = 'es-MX'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Error al comunicarse con el asistente')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        toolCalls: data.toolCalls
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: 'Buscar cliente', icon: Users, prompt: 'Busca información del cliente con ID CL-' },
    { label: 'Rastrear envío', icon: Package, prompt: 'Rastrea el envío con ID ' },
    { label: 'Generar cotización', icon: Calculator, prompt: 'Cotiza un envío de 5kg de Ciudad de México a Guadalajara' },
    { label: 'Ver facturas pendientes', icon: FileText, prompt: 'Muéstrame las facturas pendientes' }
  ]

  const containerClasses = isModal
    ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    : "h-full"

  const contentClasses = isModal
    ? "bg-slate-900 rounded-2xl w-full max-w-4xl h-[85vh] border border-white/10 flex flex-col"
    : "bg-slate-900 rounded-2xl h-full border border-white/10 flex flex-col"

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Asistente IA
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h2>
              <p className="text-sm text-slate-400">Powered by Mistral AI & DeepSeek</p>
            </div>
          </div>
          {isModal && onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-primary-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <Users className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : message.role === 'system'
                    ? 'bg-slate-800/50 text-slate-300 border border-slate-700'
                    : 'bg-slate-800 text-slate-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Tool calls visualization */}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                      {message.toolCalls.map((tool, idx) => (
                        <div key={idx} className="text-xs text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Usé: {tool.name}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 mb-3">Acciones rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInput(action.prompt)}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <action.icon className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-white">{action.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{action.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta algo... (ej: ¿Cuántos clientes activos tengo?)"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                  isListening
                    ? 'text-red-400 animate-pulse'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={isListening ? 'Detener grabación' : 'Usar voz'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2">
            El asistente puede buscar clientes, rastrear envíos, generar cotizaciones y más.
          </p>
        </div>
      </div>
    </div>
  )
}
