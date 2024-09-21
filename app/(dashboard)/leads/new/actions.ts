'use server'

import { TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createNewLead(data: TablesInsert<'leads'>) {
  const supabase = createClient()

  const { error } = await supabase.from('leads').insert([data])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  redirect('/leads')

  return { success: true }
}
