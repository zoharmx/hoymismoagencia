import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

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
    // 1. Si hay folio, buscar directamente en import_processes
    if (folio) {
      const processesRef = collection(db, 'import_processes');
      const q = query(processesRef, where('folio', '==', folio), limit(1));
      const snapshot = await getDocs(q);

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
      const processesRef = collection(db, 'import_processes');
      const q = query(processesRef, where('vehicleVin', '==', vin), orderBy('createdAt', 'desc'), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return NextResponse.json(
          { error: `No se encontró ningún trámite para el vehículo con VIN: ${vin}` },
          { status: 404, headers: corsHeaders }
        );
      }

      const processData = snapshot.docs[0].data();
      return NextResponse.json(formatProcessResponse(processData), { headers: corsHeaders });
    }

    // 3. Buscar por email - primero encontrar el cliente
    const clientsRef = collection(db, 'clients');
    const clientQuery = query(clientsRef, where('email', '==', email), limit(1));
    const clientSnapshot = await getDocs(clientQuery);

    if (clientSnapshot.empty) {
      return NextResponse.json(
        { error: `No se encontró ningún cliente con el correo: ${email}` },
        { status: 404, headers: corsHeaders }
      );
    }

    const clientDoc = clientSnapshot.docs[0];
    const clientId = clientDoc.id;
    const clientData = clientDoc.data();

    // 4. Buscar trámites del cliente (el más reciente)
    const processesRef = collection(db, 'import_processes');
    const processQuery = query(
      processesRef,
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const processSnapshot = await getDocs(processQuery);

    if (processSnapshot.empty) {
      return NextResponse.json(
        { error: `No hay trámites activos para: ${email}` },
        { status: 404, headers: corsHeaders }
      );
    }

    const processData = processSnapshot.docs[0].data();

    // Combinar datos del proceso con datos del cliente
    const response = formatProcessResponse({
      ...processData,
      clientEmail: clientData.email,
      clientPhone: clientData.phone || clientData.whatsapp,
    });

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error) {
    console.error('Error en consulta de trámite:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intente más tarde.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function formatProcessResponse(data: any) {
  // Formatear fechas
  const fechaInicio = data.fechaInicio?.toDate
    ? data.fechaInicio.toDate().toISOString().split('T')[0]
    : data.createdAt?.toDate
    ? data.createdAt.toDate().toISOString().split('T')[0]
    : null;

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
