import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from './provider'; 
import GameSync from '../components/game/GameSync';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Gamified DSA | Master Algorithms by Playing',
  description: 'Stop watching tutorials. Start solving puzzles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased transition-colors duration-300`}>
        <Providers>
          {/* 1. Global Level Listener - No UI footprint, just logic */}
          <GameSync />

          {/* Subtle Grid Background */}
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background"/>
          
          {children}
          
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}