import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HoyMismo - Paquetería y Agencia Internacional",
  description: "Envíos internacionales desde U.S.A. a México y toda Latinoamérica. Servicio profesional de paquetería con cobertura en México, Guatemala, Honduras, El Salvador, Nicaragua y Venezuela.",
  keywords: "paquetería internacional, envíos internacionales, HoyMismo, México, USA, Latinoamérica",
  authors: [{ name: "HoyMismo" }],
  openGraph: {
    title: "HoyMismo - Paquetería Internacional",
    description: "Envíos desde U.S.A. a toda Latinoamérica",
    images: ["/images/HoyMismo_Imagen_Social.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/HoyMismo_Favicon.png" />
      </head>
      <body>
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}
