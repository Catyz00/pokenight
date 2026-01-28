"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }) {
  const [allowed, setAllowed] = useState(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) {
        setAllowed(false)
        router.push('/')
        return
      }

      const user = JSON.parse(raw)
      if (user && user.group_id === 6) {
        setAllowed(true)
      } else {
        setAllowed(false)
        router.push('/')
      }
    } catch (e) {
      setAllowed(false)
      router.push('/')
    }
  }, [router])

  if (allowed === null) return null
  if (!allowed) return null

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
