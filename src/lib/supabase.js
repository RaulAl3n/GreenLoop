import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadToPinata(data) {
  try {
    const { data: result, error } = await supabase.functions.invoke('pinata-ipfs', {
      body: data,
    })

    if (error) {
      throw new Error(error.message || 'Erro ao chamar Edge Function')
    }

    return result
  } catch (error) {
    if (error.message?.includes('405') || error.message?.includes('Method Not Allowed')) {
      console.warn('Erro 405 (OPTIONS) - pode ser ignorado se o POST funcionou')
    }
    throw error
  }
}