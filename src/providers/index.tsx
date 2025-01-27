'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types'
import type { User } from '@supabase/supabase-js'

type SupabaseContext = {
  user: User | null
  loading: boolean
}

const Context = createContext<SupabaseContext>({
  user: null,
  loading: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ user, loading }}>
      {children}
    </Context.Provider>
  )
}

export const useUser = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider.')
  }
  return context
} 