import type { Shipment, Invoice, Client, ImportProcess } from '@/types/crm'

// Logo URL para HoyMismo Agencia Aduanal
const LOGO_URL = 'https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/logo-legalizaciones-AR0M55ebNos5VLzR.png'

// Generar etiqueta de envío profesional (legacy - para compatibilidad)
export function generateShippingLabel(shipment: Shipment, client: Client): string {
  const fecha = shipment.createdAt.toDate().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Etiqueta de Envío - ${shipment.shipmentId}</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .poster-container {
            width: 720px;
            min-height: 960px;
            background-color: #ffffff;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        .label-container {
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }
        .logo {
            height: 60px;
        }
        .company-info {
            text-align: left;
        }
        .company-name {
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #4F46E5;
            margin-bottom: 5px;
        }
        .company-subtitle {
            font-size: 18px;
            color: #818CF8;
        }
        .tracking-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .tracking-number {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
        }
        .tracking-details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .tracking-ref, .tracking-date {
            font-size: 16px;
            color: #ffffff;
        }
        .address-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .address-box {
            width: 48%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
        }
        .address-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 10px;
            color: #424242;
            display: flex;
            align-items: center;
        }
        .address-title .material-icons {
            margin-right: 8px;
            color: #4F46E5;
        }
        .address-content {
            font-size: 16px;
            line-height: 1.5;
        }
        .package-info {
            display: flex;
            margin-bottom: 20px;
        }
        .package-details {
            flex: 1;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 6px;
        }
        .package-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 10px;
            color: #424242;
            display: flex;
            align-items: center;
        }
        .package-title .material-icons {
            margin-right: 8px;
            color: #4F46E5;
        }
        .package-content {
            display: flex;
            flex-wrap: wrap;
        }
        .package-item {
            width: 50%;
            margin-bottom: 8px;
            font-size: 16px;
        }
        .package-item-label {
            font-weight: 500;
            color: #616161;
        }
        .package-item-value {
            color: #212121;
        }
        .barcode-section {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 6px;
        }
        .barcode {
            height: 80px;
            background: repeating-linear-gradient(
                to right,
                #000,
                #000 3px,
                #fff 3px,
                #fff 6px
            );
            margin: 10px auto;
            width: 90%;
        }
        .barcode-number {
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 18px;
            letter-spacing: 2px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-top: 10px;
        }
        .status-entregado { background: #dcfce7; color: #166534; }
        .status-en-transito { background: #dbeafe; color: #1e40af; }
        .status-pendiente { background: #fef3c7; color: #854d0e; }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 20px;
        }
        .signature-box {
            width: 48%;
            border-bottom: 2px solid #9e9e9e;
            padding-bottom: 5px;
            font-size: 14px;
            color: #616161;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(79, 70, 229, 0.05);
            font-weight: 700;
            pointer-events: none;
            z-index: 1;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .poster-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="poster-container">
        <div class="watermark">${shipment.shipmentId}</div>
        <div class="label-container">
            <div class="header">
                <img src="${LOGO_URL}" alt="HoyMismo Agencia Aduanal" class="logo">
                <div class="company-info">
                    <div class="company-name">HoyMismo Agencia Aduanal</div>
                    <div class="company-subtitle">Importación de Vehículos USA-México</div>
                </div>
            </div>

            <div class="tracking-section">
                <div class="tracking-number">${shipment.shipmentId}</div>
                <div class="tracking-details">
                    ${shipment.trackingNumber ? `<div class="tracking-ref">Tracking: ${shipment.trackingNumber}</div>` : ''}
                    <div class="tracking-date">Fecha: ${fecha}</div>
                </div>
            </div>

            <div class="address-section">
                <div class="address-box">
                    <div class="address-title">
                        <i class="material-icons">person</i>
                        Remitente
                    </div>
                    <div class="address-content">
                        ${client.name}<br>
                        ${client.address.street}<br>
                        ${client.address.city}, ${client.address.state} ${client.address.zipCode}<br>
                        ${client.address.country}<br>
                        Teléfono: ${client.phone}<br>
                        Email: ${client.email}
                    </div>
                </div>

                <div class="address-box">
                    <div class="address-title">
                        <i class="material-icons">location_on</i>
                        Destinatario
                    </div>
                    <div class="address-content">
                        Cliente: ${shipment.clientName}<br>
                        ${shipment.destination.street}<br>
                        ${shipment.destination.city}, ${shipment.destination.state} ${shipment.destination.zipCode}<br>
                        ${shipment.destination.country}
                        ${shipment.destination.reference ? `<br><strong>Ref:</strong> ${shipment.destination.reference}` : ''}
                    </div>
                </div>
            </div>

            <div class="package-info">
                <div class="package-details">
                    <div class="package-title">
                        <i class="material-icons">inventory_2</i>
                        Información del Paquete
                    </div>
                    <div class="package-content">
                        ${shipment.dimensions ? `
                        <div class="package-item">
                            <span class="package-item-label">Dimensiones:</span>
                            <span class="package-item-value"> ${shipment.dimensions.length} x ${shipment.dimensions.width} x ${shipment.dimensions.height} ${shipment.dimensions.unit}</span>
                        </div>
                        ` : ''}
                        <div class="package-item">
                            <span class="package-item-label">Peso:</span>
                            <span class="package-item-value"> ${shipment.weight} kg</span>
                        </div>
                        <div class="package-item">
                            <span class="package-item-label">Tipo:</span>
                            <span class="package-item-value"> ${shipment.packageType}</span>
                        </div>
                        <div class="package-item">
                            <span class="package-item-label">Valor Declarado:</span>
                            <span class="package-item-value"> $${shipment.declaredValue.toFixed(2)} ${shipment.currency}</span>
                        </div>
                        <div class="package-item">
                            <span class="package-item-label">Descripción:</span>
                            <span class="package-item-value"> ${shipment.description}</span>
                        </div>
                        <div class="package-item">
                            <span class="package-item-label">Costo Total:</span>
                            <span class="package-item-value"> $${shipment.totalCost.toFixed(2)} ${shipment.currency}</span>
                        </div>
                    </div>
                    <div class="status-badge status-${shipment.status}">${shipment.status.toUpperCase().replace('-', ' ')}</div>
                </div>
            </div>

            <div class="barcode-section">
                <div class="barcode"></div>
                <div class="barcode-number">${shipment.shipmentId}</div>
            </div>

            ${shipment.specialInstructions || shipment.notes ? `
            <div style="padding: 15px; background: #fff3cd; border-radius: 6px; margin-bottom: 20px;">
                <strong>Instrucciones Especiales:</strong><br>
                ${shipment.specialInstructions || shipment.notes}
            </div>
            ` : ''}

            <div class="signature-section">
                <div class="signature-box">Firma del remitente</div>
                <div class="signature-box">Firma del destinatario</div>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Generar factura profesional con logo
export function generateInvoicePDF(invoice: Invoice): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura ${invoice.invoiceId}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Roboto', sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #4F46E5;
            margin-bottom: 30px;
        }
        .logo {
            height: 70px;
        }
        .company {
            text-align: right;
        }
        .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #4F46E5;
            margin-bottom: 5px;
        }
        .company-tagline {
            color: #64748b;
            font-size: 14px;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-number {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
        }
        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            margin-top: 10px;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #854d0e; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .section { margin: 20px 0; }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1e293b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
        }
        th {
            background: #f1f5f9;
            font-weight: 700;
        }
        .total-row {
            background: #f8fafc;
            font-weight: 700;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${LOGO_URL}" alt="HoyMismo Agencia Aduanal" class="logo">
        <div class="company">
            <div class="company-name">HoyMismo Agencia Aduanal</div>
            <div class="company-tagline">Importación de Vehículos USA-México</div>
        </div>
    </div>

    <div class="invoice-info">
        <div>
            <strong>Factura: ${invoice.invoiceId}</strong><br>
            Fecha: ${invoice.createdAt.toDate().toLocaleDateString('es-MX')}<br>
            Vencimiento: ${invoice.dueDate.toDate().toLocaleDateString('es-MX')}
        </div>
        <div class="invoice-details">
            <div class="invoice-number">FACTURA</div>
            <span class="status status-${invoice.status === 'pagada' ? 'paid' : invoice.status === 'pendiente' ? 'pending' : 'overdue'}">
                ${invoice.status.toUpperCase()}
            </span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Cliente</div>
        <strong>${invoice.clientName}</strong>
    </div>

    <div class="section">
        <div class="section-title">Detalles de la Factura</div>
        <table>
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td style="text-align: center;">${item.quantity}</td>
                        <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                        <td style="text-align: right;">$${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="text-align: right;">$${invoice.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Impuestos:</strong></td>
                    <td style="text-align: right;">$${invoice.tax.toFixed(2)}</td>
                </tr>
                ${invoice.discount ? `
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Descuento:</strong></td>
                    <td style="text-align: right;">-$${invoice.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>TOTAL:</strong></td>
                    <td style="text-align: right; font-size: 18px;">$${invoice.total.toFixed(2)} ${invoice.currency}</td>
                </tr>
            </tbody>
        </table>
    </div>

    ${invoice.paidDate ? `
    <div class="section">
        <div class="section-title">Información de Pago</div>
        <strong>Fecha de pago:</strong> ${invoice.paidDate.toDate().toLocaleDateString('es-MX')}<br>
        ${invoice.paymentMethod ? `<strong>Método:</strong> ${invoice.paymentMethod}<br>` : ''}
        ${invoice.paymentReference ? `<strong>Referencia:</strong> ${invoice.paymentReference}` : ''}
    </div>
    ` : ''}

    ${invoice.notes ? `
    <div class="section">
        <div class="section-title">Notas</div>
        ${invoice.notes}
    </div>
    ` : ''}

    <div class="footer">
        <strong>HoyMismo Agencia Aduanal</strong><br>
        info@hoymismoagencia.com | +1 (346) 580-1238<br>
        Importación de Vehículos USA-México
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
            Imprimir / Guardar PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6B7280; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Cerrar
        </button>
    </div>
</body>
</html>
  `.trim()
}

// Generar reporte de trámite de importación
export function generateImportProcessReport(process: ImportProcess, client: Client): string {
  const fecha = process.createdAt.toDate().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const statusLabels: Record<string, string> = {
    'contacto-creado': 'Contacto Registrado',
    'documentacion-inicial': 'Documentación Inicial',
    'vehiculo-validado': 'Vehículo Validado',
    'anticipo-recibido': 'Anticipo Recibido',
    'tramite-en-proceso': 'Trámite en Proceso',
    'pedimento-generado': 'Pedimento Generado',
    'liquidacion': 'En Liquidación',
    'tramite-finalizado': 'Trámite Finalizado',
    'cancelado': 'Cancelado'
  }

  const statusColors: Record<string, string> = {
    'contacto-creado': '#6B7280',
    'documentacion-inicial': '#F59E0B',
    'vehiculo-validado': '#3B82F6',
    'anticipo-recibido': '#10B981',
    'tramite-en-proceso': '#8B5CF6',
    'pedimento-generado': '#EC4899',
    'liquidacion': '#F97316',
    'tramite-finalizado': '#22C55E',
    'cancelado': '#EF4444'
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Trámite ${process.folio}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Roboto', sans-serif;
            padding: 30px;
            max-width: 850px;
            margin: 0 auto;
            background: white;
            color: #1e293b;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 25px;
            border-bottom: 3px solid #4F46E5;
            margin-bottom: 30px;
        }
        .logo { height: 70px; }
        .company { text-align: right; }
        .company-name { font-size: 26px; font-weight: 700; color: #4F46E5; }
        .company-tagline { color: #64748b; font-size: 14px; }
        .folio-box {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .folio-number { font-size: 28px; font-weight: 700; }
        .folio-date { font-size: 14px; opacity: 0.9; }
        .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 700;
            font-size: 14px;
            color: white;
            background: ${statusColors[process.status] || '#6B7280'};
        }
        .section { margin-bottom: 25px; }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #4F46E5;
        }
        .info-label { color: #64748b; font-size: 13px; margin-bottom: 5px; }
        .info-value { font-size: 16px; font-weight: 500; color: #1e293b; }
        .vehicle-card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
        }
        .vehicle-title { font-size: 22px; font-weight: 700; margin-bottom: 15px; }
        .vehicle-vin { font-family: monospace; font-size: 16px; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 6px; }
        .payment-summary {
            background: #f0fdf4;
            border: 2px solid #22c55e;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
        }
        .payment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
        .payment-item-label { color: #64748b; font-size: 13px; }
        .payment-item-value { font-size: 24px; font-weight: 700; color: #166534; }
        .history-item {
            display: flex;
            align-items: flex-start;
            padding: 15px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .history-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4F46E5;
            margin-right: 15px;
            margin-top: 5px;
        }
        .history-content { flex: 1; }
        .history-status { font-weight: 600; color: #1e293b; }
        .history-desc { color: #64748b; font-size: 14px; margin-top: 3px; }
        .history-date { color: #94a3b8; font-size: 12px; margin-top: 5px; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
        }
        .no-print { margin-top: 20px; text-align: center; }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin: 0 5px;
        }
        .btn-primary { background: #4F46E5; color: white; }
        .btn-secondary { background: #6B7280; color: white; }
        @media print { .no-print { display: none; } body { padding: 15px; } }
    </style>
</head>
<body>
    <div class="header">
        <img src="${LOGO_URL}" alt="HoyMismo Agencia Aduanal" class="logo">
        <div class="company">
            <div class="company-name">HoyMismo Agencia Aduanal</div>
            <div class="company-tagline">Importación de Vehículos USA-México</div>
        </div>
    </div>

    <div class="folio-box">
        <div>
            <div class="folio-number">Folio: ${process.folio}</div>
            <div class="folio-date">Fecha de inicio: ${fecha}</div>
        </div>
        <span class="status-badge">${statusLabels[process.status] || process.status}</span>
    </div>

    <div class="section">
        <div class="section-title">Información del Cliente</div>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Nombre Completo</div>
                <div class="info-value">${client.name} ${client.lastName}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Correo Electrónico</div>
                <div class="info-value">${client.email}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Teléfono</div>
                <div class="info-value">${client.phone || 'N/A'}</div>
            </div>
            <div class="info-card">
                <div class="info-label">WhatsApp</div>
                <div class="info-value">${client.whatsapp || client.phone || 'N/A'}</div>
            </div>
        </div>
    </div>

    <div class="vehicle-card">
        <div class="vehicle-title">${process.vehicleBrand} ${process.vehicleModel}</div>
        <div class="vehicle-vin">VIN: ${process.vehicleVin}</div>
    </div>

    <div class="section">
        <div class="section-title">Detalles del Trámite</div>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Tipo de Pedimento</div>
                <div class="info-value">${process.tipoPedimento || 'Por definir'}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Oficina / Aduana</div>
                <div class="info-value">${process.oficina || 'Por asignar'}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Gestor Asignado</div>
                <div class="info-value">${process.gestorName || 'Por asignar'}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Moneda</div>
                <div class="info-value">${process.currency || 'USD'}</div>
            </div>
        </div>
    </div>

    <div class="payment-summary">
        <div class="section-title" style="border-color: #22c55e;">Resumen de Pagos</div>
        <div class="payment-grid">
            <div>
                <div class="payment-item-label">Anticipo</div>
                <div class="payment-item-value">$${(process.anticipo || 0).toFixed(2)}</div>
            </div>
            <div>
                <div class="payment-item-label">Liquidación</div>
                <div class="payment-item-value">$${(process.liquidacion || 0).toFixed(2)}</div>
            </div>
            <div>
                <div class="payment-item-label">Total</div>
                <div class="payment-item-value">$${(process.totalCost || (process.anticipo || 0) + (process.liquidacion || 0)).toFixed(2)}</div>
            </div>
        </div>
    </div>

    ${process.processHistory && process.processHistory.length > 0 ? `
    <div class="section">
        <div class="section-title">Historial del Trámite</div>
        ${process.processHistory.map(event => `
            <div class="history-item">
                <div class="history-dot"></div>
                <div class="history-content">
                    <div class="history-status">${statusLabels[event.status] || event.status}</div>
                    <div class="history-desc">${event.description}</div>
                    <div class="history-date">${event.date?.toDate ? event.date.toDate().toLocaleDateString('es-MX') : 'N/A'} - ${event.location}</div>
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${process.notes ? `
    <div class="section">
        <div class="section-title">Notas</div>
        <p style="color: #64748b; line-height: 1.6;">${process.notes}</p>
    </div>
    ` : ''}

    <div class="footer">
        <strong>HoyMismo Agencia Aduanal</strong><br>
        info@hoymismoagencia.com | +1 (346) 580-1238<br>
        Importación de Vehículos USA-México
    </div>

    <div class="no-print">
        <button class="btn btn-primary" onclick="window.print()">Imprimir / Guardar PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">Cerrar</button>
    </div>
</body>
</html>
  `.trim()
}
