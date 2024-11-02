import { ThemeSwitcher } from '@/components/theme-switcher'
import { TooltipProvider } from '@/components/ui/tooltip'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex min-h-screen flex-col items-center">
              <div className="flex w-full flex-1 flex-col items-center justify-between gap-20">
                {children}

                <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-4 text-center text-xs">
                  <p>
                    Powered by{' '}
                    <a
                      href="https://skylinedigital.co.nz"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Skyline Digital
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
