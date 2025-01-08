import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AppProvider } from '@/context/useContext'
import { LoadingProvider } from '@/providers/LoadingProvider'
import RootLayoutClient from '@/components/RootLayoutClient'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate and customize QR codes easily with this tool.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-32x32.png"
          sizes="32x32"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-100 min-h-screen`}>
        <RootLayoutClient>
          <AppProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </AppProvider>
        </RootLayoutClient>
      </body>
    </html>
  )
}
