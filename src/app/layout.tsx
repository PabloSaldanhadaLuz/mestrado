import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha avaliativa MM",
  description: "Formulario elaborado para desenvolvimento de uma avaliação de prática de Modelagem Matemática",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
