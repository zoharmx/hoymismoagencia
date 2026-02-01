import { Suspense } from 'react'

export default function RastreoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      {children}
    </Suspense>
  )
}
