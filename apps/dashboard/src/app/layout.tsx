import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pathways2Care - Admin Dashboard',
  description: 'AI Customer Support Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
