import { NextResponse } from 'next/server'
import {
  testFirestoreConnection,
  checkEnvironmentVariables,
} from '@/lib/firestore/test-connection'

export async function GET() {
  try {
    // Verificar variables de entorno
    const envCheck = checkEnvironmentVariables()

    if (!envCheck.configured) {
      return NextResponse.json(
        {
          success: false,
          message: 'Variables de entorno no configuradas',
          missing: envCheck.missing,
        },
        { status: 500 }
      )
    }

    // Probar conexión a Firestore
    const result = await testFirestoreConnection()

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error) {
    console.error('Error en test de Firebase:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al ejecutar test',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
