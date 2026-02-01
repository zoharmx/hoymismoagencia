import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/firestore/seed'

export async function POST(request: Request) {
  try {
    // Verificar secret key para permitir seed en producción
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get('key')
    const isProduction = process.env.NODE_ENV === 'production'

    // En producción, requerir clave secreta
    if (isProduction && secretKey !== 'hoymismo-seed-2025') {
      return NextResponse.json(
        { error: 'Clave de autorización requerida' },
        { status: 403 }
      )
    }

    await seedDatabase()

    return NextResponse.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
    })
  } catch (error) {
    console.error('Error en seed:', error)
    return NextResponse.json(
      {
        error: 'Error al poblar la base de datos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Usa POST para ejecutar el seed',
    example: 'curl -X POST /api/seed?key=hoymismo-seed-2025',
    development: process.env.NODE_ENV === 'development',
  })
}
