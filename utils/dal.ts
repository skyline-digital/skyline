'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'

export async function deleteLead(leadId: string) {
  const supabase = createClient()
  await supabase.from('leads').delete().match({ id: leadId })

  revalidatePath('/dashboard/leads')
}
