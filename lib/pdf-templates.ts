import type { Shipment, Invoice, Client } from '@/types/crm'

// Generar etiqueta de envío profesional
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
                <img src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/logo-hoy-mismo-YD0Bz1op0eizKk6L.png" alt="HoyMismo" class="logo">
                <div class="company-info">
                    <div class="company-name">HoyMismo Paquetería</div>
                    <div class="company-subtitle">¡Donde envías hoy... Y recibes hoy!</div>
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
        <img src="https://assets.zyrosite.com/m6Lj5RMGlLT19eqJ/logo-hoy-mismo-YD0Bz1op0eizKk6L.png" alt="HoyMismo" class="logo">
        <div class="company">
            <div class="company-name">HoyMismo Paquetería</div>
            <div class="company-tagline">Sistema de gestión de paquetería</div>
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
        <strong>HoyMismo Paquetería</strong><br>
        info@hoymismo.com | +1 (346) 555-0100<br>
        ¡Donde envías hoy... Y recibes hoy!
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
