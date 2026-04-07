import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { defaultThemeId } from '@/lib/themes'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://stochast.vercel.app'),
  title: {
    default: 'Stochast',
    template: '%s | Stochast',
  },
  description: 'A high-performance web application for exploring how local probability rules shape global distributions.',
  applicationName: 'Stochast',
  keywords: [
    'stochastic processes',
    'probability',
    'random walks',
    'distribution visualization',
    'simulation',
  ],
  openGraph: {
    title: 'Stochast',
    description: 'Visualize how microscopic probability rules produce macroscopic distributions.',
    siteName: 'Stochast',
    type: 'website',
    url: 'https://stochast.vercel.app',
  },
  twitter: {
    card: 'summary',
    title: 'Stochast',
    description: 'Visualize how microscopic probability rules produce macroscopic distributions.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={defaultThemeId}>
      <body className={`${ibmPlexMono.variable} ${ibmPlexSans.variable}`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
