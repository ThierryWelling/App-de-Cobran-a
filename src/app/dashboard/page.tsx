'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

type DashboardStats = {
  totalClientes: number
  cobrancasPendentes: number
  cobrancasPagas: number
  valorTotal: number
}

type StatsAccumulator = {
  totalClientes: number
  cobrancasPendentes: number
  cobrancasPagas: number
  valorTotal: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    cobrancasPendentes: 0,
    cobrancasPagas: 0,
    valorTotal: 0,
  })

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function loadStats() {
      try {
        // Carregar total de clientes
        const { count: totalClientes } = await supabase
          .from('clientes')
          .select('*', { count: 'exact' })

        // Carregar cobranças
        const { data: cobrancas } = await supabase
          .from('cobrancas')
          .select('*')

        const stats = cobrancas?.reduce(
          (acc: StatsAccumulator, cobranca: Database['public']['Tables']['cobrancas']['Row']) => {
            if (cobranca.status === 'pendente') {
              acc.cobrancasPendentes++
            } else if (cobranca.status === 'pago') {
              acc.cobrancasPagas++
              acc.valorTotal += cobranca.valor
            }
            return acc
          },
          {
            totalClientes: totalClientes || 0,
            cobrancasPendentes: 0,
            cobrancasPagas: 0,
            valorTotal: 0,
          }
        )

        setStats(stats || {
          totalClientes: 0,
          cobrancasPendentes: 0,
          cobrancasPagas: 0,
          valorTotal: 0,
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    loadStats()
  }, [supabase])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Total de Clientes</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalClientes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">
            Cobranças Pendentes
          </h2>
          <p className="mt-2 text-3xl font-semibold text-orange-600">
            {stats.cobrancasPendentes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Cobranças Pagas</h2>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats.cobrancasPagas}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Valor Total Pago</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            R$ {stats.valorTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
} 