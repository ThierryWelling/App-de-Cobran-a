'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, FileText, Settings, LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Database } from '@/lib/database.types'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
  { icon: FileText, label: 'Cobranças', href: '/dashboard/cobrancas' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Sistema de Cobrança</h1>
        </div>

        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  )
} 