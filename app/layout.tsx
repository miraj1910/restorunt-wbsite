import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import ClientInit from '@/components/ClientInit'
import Footer from '@/components/Footer'
import Background from '@/components/Background'

export const metadata: Metadata = {
  title: 'Bistro Aurelia',
  description: 'Bistro Aurelia is a luxury immersive 3D dining destination.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Background />
        <div className="grain-overlay" />
        <div className="scene-root">
          <Navigation />
          <ClientInit>
            <main>{children}</main>
          </ClientInit>
          <Footer />
        </div>
      </body>
    </html>
  )
}
