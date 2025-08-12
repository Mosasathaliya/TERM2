import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Speed of Mastery',
  description: 'تعلم الإنجليزية بسرعة وذكاء',
}

export const runtime = 'edge';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-accent/10">
          {children}
        </div>
      </body>
    </html>
<<<<<<< Current (Your changes)
  );
=======
  )
>>>>>>> Incoming (Background Agent changes)
}
