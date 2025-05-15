'use client'

import { ReactNode } from 'react'
import Providers from './components/providers/providers'
import { Sidebar } from './components/sidebar/sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className="flex h-dvh">
        {/* Restore sidebar visibility - it contains workflow listings */}
        <div className="z-20">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </Providers>
  )
}
