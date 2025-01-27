export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type StatusParcela = 'pendente' | 'paga' | 'atrasada'

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          created_at: string
          nome: string
          email: string
          telefone: string
          cpf_cnpj: string
          endereco: string
          foto_url: string | null
          data_cobranca: string
          data_vencimento: string
          total_parcelas: number
          valor_total: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          nome: string
          email: string
          telefone: string
          cpf_cnpj: string
          endereco: string
          foto_url?: string | null
          data_cobranca: string
          data_vencimento: string
          total_parcelas: number
          valor_total: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          nome?: string
          email?: string
          telefone?: string
          cpf_cnpj?: string
          endereco?: string
          foto_url?: string | null
          data_cobranca?: string
          data_vencimento?: string
          total_parcelas?: number
          valor_total?: number
          user_id?: string
        }
      }
      parcelas: {
        Row: {
          id: string
          created_at: string
          cliente_id: string
          numero_parcela: number
          valor: number
          data_vencimento: string
          status: StatusParcela
          data_pagamento: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          cliente_id: string
          numero_parcela: number
          valor: number
          data_vencimento: string
          status?: StatusParcela
          data_pagamento?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          cliente_id?: string
          numero_parcela?: number
          valor?: number
          data_vencimento?: string
          status?: StatusParcela
          data_pagamento?: string | null
        }
      }
    }
  }
} 