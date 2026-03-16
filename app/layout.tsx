import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Site Analyzer | Click Here Labs',
  description: 'Free website performance, SEO, and accessibility analysis powered by Google Lighthouse. Get instant scores and actionable recommendations.',
  openGraph: {
    title: 'Site Analyzer | Click Here Labs',
    description: 'Free website performance, SEO, and accessibility analysis powered by Google Lighthouse.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-chl-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
