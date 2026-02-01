import { NextResponse } from 'next/server';

// Configurar CORS para permitir peticiones desde Hostinger
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: Request) {
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400, headers }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAyG63QKPfEo4-Np3heSfz_gPkwDWZHbJM';
    const prompt = `Eres el asistente de HoyMismo Paquetería. El paquete está en estado: '${status}'. Responde JSON: {"title": "Título corto y amigable", "explanation": "Explicación breve para el cliente en tono profesional pero cálido.", "icon": "fa-solid fa-check"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned non-OK status:', response.status);
      // Fallback: retornar mensaje predefinido según el estado
      return NextResponse.json(getFallbackMessage(status), { headers });
    }

    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);

    return NextResponse.json(data, { headers });

  } catch (error) {
    console.error('Error en AI summary:', error);
    // En caso de error, retornar mensaje fallback
    const { status } = await request.json().catch(() => ({ status: 'desconocido' }));
    return NextResponse.json(getFallbackMessage(status), { headers });
  }
}

// Mensajes fallback cuando Gemini no está disponible
function getFallbackMessage(status: string): { title: string; explanation: string; icon: string } {
  const messages: Record<string, any> = {
    'pendiente': {
      title: 'Tu paquete está registrado',
      explanation: 'Hemos recibido tu envío en nuestro sistema. Pronto será procesado y comenzará su viaje hacia su destino.',
      icon: 'fa-solid fa-box'
    },
    'en-transito': {
      title: 'En camino a su destino',
      explanation: 'Tu paquete está viajando actualmente. Nuestro equipo lo está transportando de forma segura hacia la ciudad de destino.',
      icon: 'fa-solid fa-truck-fast'
    },
    'en-distribucion': {
      title: 'En centro de distribución',
      explanation: 'Tu paquete ha llegado a nuestro centro de distribución. Está siendo preparado para la entrega final.',
      icon: 'fa-solid fa-warehouse'
    },
    'en-aduana': {
      title: 'En proceso aduanal',
      explanation: 'Tu paquete está pasando por los trámites aduanales requeridos. Este es un proceso normal para envíos internacionales.',
      icon: 'fa-solid fa-passport'
    },
    'entregado': {
      title: '¡Paquete entregado!',
      explanation: 'Tu envío ha sido entregado exitosamente en la dirección de destino. ¡Gracias por confiar en HoyMismo!',
      icon: 'fa-solid fa-check-circle'
    }
  };

  const normalizedStatus = status.toLowerCase();
  return messages[normalizedStatus] || {
    title: 'Estado del paquete',
    explanation: `Tu paquete está actualmente en estado: ${status}. Nuestro equipo está trabajando para completar la entrega.`,
    icon: 'fa-solid fa-info-circle'
  };
}

// Agregar soporte para OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
