import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesa · Redacción deportiva con IA",
  description: "Analiza una señal, arma una mesa editorial y redacta una nota con control de hechos y títulos."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>;
}
