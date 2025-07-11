import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Projetos e Soluções BI',
  description: 'Projetos, documentações, dashboards, pesquisas e ferramentas',
  generator: 'Thiago Almeida',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
