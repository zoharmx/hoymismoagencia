'use client'

import { useState } from 'react'
import { X, FileText, DollarSign, Calendar, Download, CreditCard, Printer } from 'lucide-react'
import { markInvoiceAsPaid, deleteInvoice } from '@/lib/firestore'
import { generateInvoicePDF } from '@/lib/pdf-templates'
import type { Invoice } from '@/types/crm'

interface InvoiceDetailsModalProps {
  invoice: Invoice
  onClose: () => void
  onSuccess: () => void
}

export default function InvoiceDetailsModal({ invoice, onClose, onSuccess }: InvoiceDetailsModalProps) {
  const [marking, setMarking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleMarkAsPaid = async () => {
    if (!confirm('¿Marcar esta factura como pagada?')) return

    setMarking(true)
    try {
      await markInvoiceAsPaid(invoice.id, 'tarjeta', 'REF-' + Date.now())
      onSuccess()
      alert('Factura marcada como pagada')
      onClose()
    } catch (error) {
      console.error('Error al marcar factura como pagada:', error)
      alert('Error al marcar factura como pagada')
    } finally {
      setMarking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta factura? Esta acción no se puede deshacer.')) return

    setDeleting(true)
    try {
      await deleteInvoice(invoice.id)
      onSuccess()
      alert('Factura eliminada')
      onClose()
    } catch (error) {
      console.error('Error al eliminar factura:', error)
      alert('Error al eliminar factura')
    } finally {
      setDeleting(false)
    }
  }

  const handleGeneratePDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generateInvoicePDF(invoice))
      printWindow.document.close()
    }
  }

  const statusColors = {
    pendiente: 'bg-yellow-500/20 text-yellow-400',
    pagada: 'bg-green-500/20 text-green-400',
    vencida: 'bg-red-500/20 text-red-400',
    cancelada: 'bg-slate-500/20 text-slate-400',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Detalles de Factura</h2>
            <p className="text-slate-400 text-sm font-mono">{invoice.invoiceId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Acciones rápidas */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Generar PDF
            </button>
            {invoice.status === 'pendiente' && (
              <button
                onClick={handleMarkAsPaid}
                disabled={marking}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {marking ? 'Procesando...' : 'Marcar como Pagada'}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar Factura'}
            </button>
          </div>

          {/* Estado */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Estado</p>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[invoice.status]}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">
                  ${invoice.total.toFixed(2)} {invoice.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Cliente</h3>
            <p className="text-slate-300">{invoice.clientName}</p>
          </div>

          {/* Fechas */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Fecha de Emisión</p>
              <p className="text-white font-semibold">
                {invoice.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Fecha de Vencimiento</p>
              <p className="text-white font-semibold">
                {invoice.dueDate.toDate().toLocaleDateString()}
              </p>
            </div>
            {invoice.paidDate && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Fecha de Pago</p>
                <p className="text-white font-semibold">
                  {invoice.paidDate.toDate().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Detalles</h3>
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                  <div>
                    <p className="text-white">{item.description}</p>
                    <p className="text-sm text-slate-400">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-white font-semibold">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Impuestos</span>
                <span className="text-white">${invoice.tax.toFixed(2)}</span>
              </div>
              {invoice.discount && invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Descuento</span>
                  <span className="text-green-400">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                <span className="text-white">Total</span>
                <span className="text-white">${invoice.total.toFixed(2)} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Información de pago */}
          {invoice.paidDate && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Información de Pago</h3>
              {invoice.paymentMethod && (
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Método:</span> {invoice.paymentMethod}
                </p>
              )}
              {invoice.paymentReference && (
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Referencia:</span> {invoice.paymentReference}
                </p>
              )}
            </div>
          )}

          {/* Notas */}
          {invoice.notes && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Notas</h3>
              <p className="text-slate-300">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
