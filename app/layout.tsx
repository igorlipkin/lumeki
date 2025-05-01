import './globals.css'
import { Metadata } from 'next'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'Lumeki | AI Integration Made Simple',
  description: 'Learn how to integrate AI into your daily life and work in simple terms.',
  keywords: ['AI', 'artificial intelligence', 'productivity', 'technology'],
  openGraph: {
    title: 'Lumeki | AI Integration Made Simple',
    description: 'Learn how to integrate AI into your daily life and work in simple terms.',
    url: 'https://lumeki.online',
    siteName: 'Lumeki',
    locale: 'en-US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-white text-black font-sans antialiased">
        <Header />
        <main className="flex-grow mt-20 mb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
