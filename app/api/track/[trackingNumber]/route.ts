import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { trackingNumber: string } }
) {
  const trackingNumber = params.trackingNumber;

  // Configurar CORS para permitir peticiones desde Hostinger
  const headers = {
    'Access-Control-Allow-Origin': '*', // O específicamente: 'https://hoymismopaqueteria.com'
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // 1. Buscamos en la colección de envíos usando shipmentId
    const shipmentsRef = collection(db, 'shipments');
    const q = query(shipmentsRef, where('shipmentId', '==', trackingNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { detail: 'Guía no encontrada' },
        { status: 404, headers }
      );
    }

    // 2. Formateamos los datos para que coincidan con lo que espera el HTML
    const docData = querySnapshot.docs[0].data();
    
    // Mapear el trackingHistory al formato que espera el frontend
    const historialMapeado = (docData.trackingHistory || []).map((event: any) => {
      // Convertir timestamp a ISO string para que el frontend lo procese
      let timestampValue = event.date || event.timestamp;
      if (timestampValue && typeof timestampValue.toDate === 'function') {
        timestampValue = timestampValue.toDate().toISOString();
      }

      return {
        status: event.status || event.description || 'Actualización',
        timestamp: timestampValue,
        location: event.location || '',
        notes: event.description || event.notes || ''
      };
    });

    // Mapeo de datos de Firestore al formato que espera tu HTML
    const responseData = {
      numero_de_guia: docData.shipmentId || docData.trackingNumber, // Usando shipmentId
      estatus_actual: docData.status, // Asegúrate de que los valores coincidan (En Tránsito, etc.)
      direccion_de_entrega: `${docData.destination.street}, ${docData.destination.city}`,
      remitente: {
        firstname: docData.clientName || 'Cliente',
        lastname: '',
        phone: docData.clientPhone || ''
      },
      destinatario: {
        nombre_de_receptor: docData.recipient?.name || '',
        peso__kg_: docData.weight || 0,
        fecha_de_recoleccion: docData.createdAt?.toDate().toISOString().split('T')[0],
        destino: docData.destination.city // Solo el nombre de la ciudad
      },
      // Campo plano para compatibilidad con el HTML
      destino: docData.destination.city,
      // Datos adicionales para features premium (con nombres diferentes)
      origen_detallado: {
        ciudad: docData.origin?.city || 'Houston',
        direccion: docData.origin?.street || '',
        coordenadas: docData.origin?.coordinates || null
      },
      destino_detallado: {
        ciudad: docData.destination.city,
        direccion: `${docData.destination.street}, ${docData.destination.city}, ${docData.destination.state}`,
        coordenadas: docData.destination?.coordinates || null
      },
      historial: historialMapeado,
      fecha_estimada_entrega: docData.estimatedDelivery?.toDate ? docData.estimatedDelivery.toDate().toISOString().split('T')[0] : null,
      distancia_km: docData.distance || null
    };

    return NextResponse.json(responseData, { headers });

  } catch (error) {
    console.error('Error en API de rastreo:', error);
    return NextResponse.json(
      { detail: 'Error interno del servidor' },
      { status: 500, headers }
    );
  }
}

// Agregar soporte para OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}