import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/firestore/seed'

export async function POST() {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Seed solo disponible en modo desarrollo' },
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
    development: process.env.NODE_ENV === 'development',
  })
}
