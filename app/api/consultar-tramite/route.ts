import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

// Configurar CORS para permitir peticiones desde el sitio web oficial
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Mapeo de estatus internos a estatus amigables para el usuario
const STATUS_LABELS: Record<string, string> = {
  'contacto-creado': 'Contacto Registrado',
  'documentacion-inicial': 'En Revisión',
  'vehiculo-validado': 'Validación',
  'anticipo-recibido': 'En Proceso',
  'tramite-en-proceso': 'En Proceso',
  'pedimento-generado': 'En Proceso',
  'liquidacion': 'Etapa Final',
  'tramite-finalizado': 'Liberado',
  'cancelado': 'Cancelado',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email')?.toLowerCase().trim();
  const folio = searchParams.get('folio')?.toUpperCase().trim();
  const vin = searchParams.get('vin')?.toUpperCase().trim();

  if (!email && !folio && !vin) {
    return NextResponse.json(
      { error: 'Debe proporcionar email, folio o VIN para consultar' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const db = getAdminDb();

    // 1. Si hay folio, buscar directamente en import_processes
    if (folio) {
      const snapshot = await db
        .collection('import_processes')
        .where('folio', '==', folio)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return NextResponse.json(
          { error: `No se encontró ningún trámite con folio: ${folio}` },
          { status: 404, headers: corsHeaders }
        );
      }

      const processData = snapshot.docs[0].data();
      return NextResponse.json(formatProcessResponse(processData), { headers: corsHeaders });
    }

    // 2. Si hay VIN, buscar por VIN
    if (vin) {
      const snapshot = await db
        .collection('import_processes')
        .where('vehicleVin', '==', vin)
        .limit(5)
        .get();

      if (snapshot.empty) {
        return NextResponse.json(
          { error: `No se encontró ningún trámite para el vehículo con VIN: ${vin}` },
          { status: 404, headers: corsHeaders }
        );
      }

      // Obtener el más reciente ordenando manualmente
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      return NextResponse.json(formatProcessResponse(docs[0]), { headers: corsHeaders });
    }

    // 3. Buscar por email - primero encontrar el cliente
    const clientSnapshot = await db
      .collection('clients')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (clientSnapshot.empty) {
      return NextResponse.json(
        { error: `No se encontró ningún cliente con el correo: ${email}` },
        { status: 404, headers: corsHeaders }
      );
    }

    const clientDoc = clientSnapshot.docs[0];
    const clientId = clientDoc.id;
    const clientData = clientDoc.data();

    // 4. Buscar trámites del cliente
    const processSnapshot = await db
      .collection('import_processes')
      .where('clientId', '==', clientId)
      .limit(10)
      .get();

    if (processSnapshot.empty) {
      return NextResponse.json(
        { error: `No hay trámites activos para: ${email}` },
        { status: 404, headers: corsHeaders }
      );
    }

    // Obtener el más reciente ordenando manualmente
    const processDocs = processSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    processDocs.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const processData = processDocs[0];

    // Combinar datos del proceso con datos del cliente
    const response = formatProcessResponse({
      ...processData,
      clientEmail: clientData.email,
      clientPhone: clientData.phone || clientData.whatsapp,
    });

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Error en consulta de trámite:', error);

    // Manejar errores específicos de Firestore
    if (error?.code === 'permission-denied') {
      return NextResponse.json(
        { error: 'Error de permisos en la base de datos. Contacte al administrador.' },
        { status: 403, headers: corsHeaders }
      );
    }

    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      return NextResponse.json(
        { error: 'La base de datos requiere configuración adicional. Contacte al administrador.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor. Por favor intente más tarde.',
        debug: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

function formatProcessResponse(data: any) {
  // Formatear fechas - Firebase Admin usa Timestamp diferente
  let fechaInicio = null;
  if (data.fechaInicio) {
    fechaInicio = typeof data.fechaInicio.toDate === 'function'
      ? data.fechaInicio.toDate().toISOString().split('T')[0]
      : data.fechaInicio;
  } else if (data.createdAt) {
    fechaInicio = typeof data.createdAt.toDate === 'function'
      ? data.createdAt.toDate().toISOString().split('T')[0]
      : data.createdAt;
  }

  // Mapear historial de eventos
  const historial = (data.processHistory || []).map((event: any) => {
    let timestamp = event.date || event.timestamp;
    if (timestamp && typeof timestamp.toDate === 'function') {
      timestamp = timestamp.toDate().toISOString();
    }
    return {
      status: STATUS_LABELS[event.status] || event.status,
      timestamp,
      description: event.description || '',
      user: event.userName || 'Sistema',
    };
  });

  return {
    // Datos principales
    folio: data.folio,
    estatus_actual: STATUS_LABELS[data.status] || data.status,
    estatus_interno: data.status,

    // Datos del cliente
    nombre: data.clientName || 'Cliente',
    email: data.clientEmail || '',
    telefono: data.clientPhone || '',

    // Datos del vehículo
    vin: data.vehicleVin,
    marca: data.vehicleBrand,
    modelo: data.vehicleModel,
    color_vehiculo: data.vehicleColor || '',

    // Datos del trámite
    tipo_pedimento: data.tipoPedimento,
    oficina: data.oficina,
    fecha_inicio: fechaInicio,

    // Pagos
    anticipo: data.anticipo || 0,
    liquidacion: data.liquidacion || 0,
    total: data.totalCost || 0,
    currency: data.currency || 'USD',

    // Historial de eventos
    historial,

    // Notas (si las hay y son públicas)
    notas: data.publicNotes || null,
  };
}

// Soporte para preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
