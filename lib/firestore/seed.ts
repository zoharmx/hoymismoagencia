/**
 * Script de seed para poblar Firestore con datos de ejemplo
 *
 * IMPORTANTE: Solo ejecutar en desarrollo
 * Este script crea datos de ejemplo para testing
 */

import { Timestamp } from 'firebase/firestore'
import { createClient } from './clients'
import { createShipment } from './shipments'
import { createInvoice } from './invoices'
import { createActivity } from './crm-activities'
import { createUser } from './users'
import { initializeDefaultSettings } from './settings'
import type { Address } from '@/types/crm'

export async function seedDatabase() {
  console.log('🌱 Iniciando seed de la base de datos...')

  try {
    // Inicializar configuraciones por defecto
    console.log('⚙️ Inicializando configuraciones...')
    await initializeDefaultSettings()

    // Crear usuarios de ejemplo
    console.log('👤 Creando usuarios...')

    await createUser({
      uid: 'admin-001',
      email: 'admin@hoymismo.com',
      displayName: 'Administrador Principal',
      role: 'admin',
      phone: '+1 (346) 555-0100',
      department: 'Administración',
      isActive: true,
    })
    console.log('✓ Usuario Admin creado')

    await createUser({
      uid: 'manager-001',
      email: 'manager@hoymismo.com',
      displayName: 'Carlos Manager',
      role: 'manager',
      phone: '+1 (346) 555-0101',
      department: 'Operaciones',
      isActive: true,
    })
    console.log('✓ Usuario Manager creado')

    await createUser({
      uid: 'operator-001',
      email: 'operator@hoymismo.com',
      displayName: 'Ana Operador',
      role: 'operator',
      phone: '+1 (346) 555-0102',
      department: 'Logística',
      isActive: true,
    })
    console.log('✓ Usuario Operador creado')

    // Crear clientes de ejemplo
    console.log('👥 Creando clientes...')

    const client1 = await createClient({
      name: 'María González',
      email: 'maria.g@ejemplo.com',
      phone: '+1 (346) 555-0123',
      type: 'individual',
      address: {
        street: '1234 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
      },
      totalShipments: 0,
      totalSpent: 0,
      isActive: true,
      tags: ['frecuente', 'vip'],
    })
    console.log('✓ Cliente creado:', client1.clientId)

    const client2 = await createClient({
      name: 'Carlos Ramírez',
      email: 'carlos.r@ejemplo.com',
      phone: '+1 (346) 555-0124',
      type: 'empresa',
      company: 'Importadora del Norte SA',
      rfc: 'IDN920312ABC',
      address: {
        street: '5678 Commerce Ave',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        country: 'US',
      },
      totalShipments: 0,
      totalSpent: 0,
      isActive: true,
      tags: ['corporativo'],
    })
    console.log('✓ Cliente creado:', client2.clientId)

    const client3 = await createClient({
      name: 'Ana López',
      email: 'ana.l@ejemplo.com',
      phone: '+1 (346) 555-0125',
      type: 'individual',
      address: {
        street: '9012 Park Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        country: 'US',
      },
      totalShipments: 0,
      totalSpent: 0,
      isActive: true,
    })
    console.log('✓ Cliente creado:', client3.clientId)

    // Crear envíos de ejemplo
    console.log('📦 Creando envíos...')

    const shipment1 = await createShipment({
      clientId: client1.id,
      clientName: client1.name,
      origin: {
        street: '1234 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
      },
      destination: {
        street: 'Av. Constitución 200',
        city: 'Monterrey',
        state: 'Nuevo León',
        zipCode: '64000',
        country: 'MX',
      },
      weight: 5.5,
      packageType: 'caja',
      description: 'Ropa y accesorios',
      declaredValue: 200,
      status: 'en-transito',
      shippingCost: 125.0,
      insuranceCost: 15.0,
      totalCost: 140.0,
      currency: 'USD',
      requiresSignature: true,
      trackingNumber: 'TRK-' + Date.now(),
    })
    console.log('✓ Envío creado:', shipment1.shipmentId)

    const shipment2 = await createShipment({
      clientId: client2.id,
      clientName: client2.name,
      origin: {
        street: '5678 Commerce Ave',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        country: 'US',
      },
      destination: {
        street: 'Av. Insurgentes 500',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06600',
        country: 'MX',
      },
      weight: 12.0,
      packageType: 'pallet',
      description: 'Mercancía general para tienda',
      declaredValue: 1500,
      status: 'en-aduana',
      shippingCost: 350.0,
      insuranceCost: 50.0,
      totalCost: 400.0,
      currency: 'USD',
      requiresSignature: true,
      trackingNumber: 'TRK-' + (Date.now() + 1),
      specialInstructions: 'Manejar con cuidado - productos frágiles',
    })
    console.log('✓ Envío creado:', shipment2.shipmentId)

    const shipment3 = await createShipment({
      clientId: client3.id,
      clientName: client3.name,
      origin: {
        street: '9012 Park Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        country: 'US',
      },
      destination: {
        street: 'Av. Chapultepec 100',
        city: 'Guadalajara',
        state: 'Jalisco',
        zipCode: '44100',
        country: 'MX',
      },
      weight: 3.2,
      packageType: 'caja',
      description: 'Documentos y libros',
      declaredValue: 100,
      status: 'entregado',
      shippingCost: 98.0,
      totalCost: 98.0,
      currency: 'USD',
      requiresSignature: false,
      trackingNumber: 'TRK-' + (Date.now() + 2),
      actualDelivery: Timestamp.now(),
    })
    console.log('✓ Envío creado:', shipment3.shipmentId)

    const shipment4 = await createShipment({
      clientId: client1.id,
      clientName: client1.name,
      origin: {
        street: '1234 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
      },
      destination: {
        street: 'Blvd. Agua Caliente 1000',
        city: 'Tijuana',
        state: 'Baja California',
        zipCode: '22000',
        country: 'MX',
      },
      weight: 8.0,
      packageType: 'caja',
      description: 'Electrónicos',
      declaredValue: 800,
      status: 'pendiente',
      shippingCost: 180.0,
      insuranceCost: 30.0,
      totalCost: 210.0,
      currency: 'USD',
      requiresSignature: true,
      notes: 'Cliente solicita entrega antes del viernes',
    })
    console.log('✓ Envío creado:', shipment4.shipmentId)

    // Crear facturas de ejemplo
    console.log('💰 Creando facturas...')

    const invoice1 = await createInvoice({
      clientId: client1.id,
      clientName: client1.name,
      items: [
        {
          description: `Envío ${shipment1.shipmentId}`,
          quantity: 1,
          unitPrice: 140.0,
          total: 140.0,
          shipmentId: shipment1.id,
        },
      ],
      subtotal: 140.0,
      tax: 11.2,
      total: 151.2,
      status: 'pagada',
      currency: 'USD',
      dueDate: Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      paidDate: Timestamp.now(),
      paymentMethod: 'tarjeta',
      paymentReference: 'PAY-' + Date.now(),
    })
    console.log('✓ Factura creada:', invoice1.invoiceId)

    const invoice2 = await createInvoice({
      clientId: client2.id,
      clientName: client2.name,
      items: [
        {
          description: `Envío ${shipment2.shipmentId}`,
          quantity: 1,
          unitPrice: 400.0,
          total: 400.0,
          shipmentId: shipment2.id,
        },
      ],
      subtotal: 400.0,
      tax: 32.0,
      total: 432.0,
      status: 'pendiente',
      currency: 'USD',
      dueDate: Timestamp.fromDate(
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      ),
    })
    console.log('✓ Factura creada:', invoice2.invoiceId)

    const invoice3 = await createInvoice({
      clientId: client1.id,
      clientName: client1.name,
      items: [
        {
          description: `Envío ${shipment4.shipmentId}`,
          quantity: 1,
          unitPrice: 210.0,
          total: 210.0,
          shipmentId: shipment4.id,
        },
      ],
      subtotal: 210.0,
      tax: 16.8,
      total: 226.8,
      status: 'pendiente',
      currency: 'USD',
      dueDate: Timestamp.fromDate(
        new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      ),
    })
    console.log('✓ Factura creada:', invoice3.invoiceId)

    // Crear actividades del CRM
    console.log('📝 Creando actividades del CRM...')

    await createActivity({
      clientId: client1.id,
      type: 'llamada',
      title: 'Seguimiento de envío en tránsito',
      description: 'Cliente llamó para preguntar sobre el estado de su envío HM-2024-10045',
      priority: 'media',
      createdBy: 'admin',
      relatedShipmentId: shipment1.id,
    })

    await createActivity({
      clientId: client2.id,
      type: 'email',
      title: 'Cotización para envío de pallet',
      description: 'Cliente solicitó cotización para envío de mercancía pesada',
      priority: 'alta',
      createdBy: 'admin',
      dueDate: Timestamp.fromDate(
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      ),
    })

    await createActivity({
      clientId: client3.id,
      type: 'nota',
      title: 'Cliente satisfecho con el servicio',
      description: 'El cliente expresó su satisfacción con la rapidez de la entrega',
      priority: 'baja',
      createdBy: 'admin',
      completedAt: Timestamp.now(),
    })

    await createActivity({
      clientId: client2.id,
      type: 'seguimiento',
      title: 'Verificar documentos de aduana',
      description: 'Envío detenido en aduana, necesita revisión de documentación',
      priority: 'alta',
      createdBy: 'admin',
      relatedShipmentId: shipment2.id,
      dueDate: Timestamp.fromDate(
        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      ),
    })

    console.log('✅ Seed completado exitosamente!')
    console.log('')
    console.log('Resumen:')
    console.log('- Configuraciones inicializadas')
    console.log('- 3 usuarios creados')
    console.log('- 3 clientes creados')
    console.log('- 4 envíos creados')
    console.log('- 3 facturas creadas')
    console.log('- 4 actividades CRM creadas')
    console.log('')
    console.log('Puedes ver los datos en Firebase Console o en el dashboard.')
    console.log('Dashboard: http://localhost:3000/dashboard')
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  }
}

// Función para limpiar todos los datos (usar con precaución)
export async function clearDatabase() {
  console.warn('⚠️ Esta función eliminará TODOS los datos de Firestore')
  console.warn('Implementa la lógica de limpieza con cuidado')
  // Implementar si es necesario
}
