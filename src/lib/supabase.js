import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Faz upload dos dados de reciclagem para o IPFS via Edge Function do Supabase
 * @param {Object} data - Dados da transação de reciclagem
 * @returns {Promise<Object>} Resultado com CID do IPFS
 */
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
    throw error
  }
}