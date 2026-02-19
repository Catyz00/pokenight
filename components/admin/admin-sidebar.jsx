"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Trophy,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Tv,
  TicketIcon,
  Map,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    href: "/admin/tickets",
    icon: TicketIcon,
  },
  {
    title: "Torneios",
    href: "/admin/torneios",
    icon: Trophy,
  },
  {
    title: "Mapas",
    href: "/admin/mapas",
    icon: Map,
  },
  {
    title: "Noticias",
    href: "/admin/noticias",
    icon: Newspaper,
  },
  {
    title: "Eventos",
    href: "/admin/eventos",
    icon: Calendar,
  },
  {
    title: "Rankings",
    href: "/admin/rankings",
    icon: TrendingUp,
  },
  {
    title: "Jogadores",
    href: "/admin/jogadores",
    icon: Users,
  },
  {
    title: "Parceiros",
    href: "/admin/parceiros",
    icon: Tv,
  },
  {
    title: "Configuracoes",
    href: "/admin/configuracoes",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg bg-card p-2 shadow-lg lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setCollapsed(true)}
          onKeyDown={(e) => e.key === "Escape" && setCollapsed(true)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">P</span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">Admin</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setCollapsed(true)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                Administrador
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                admin@pokeworld.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}
