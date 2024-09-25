'use server'

import { Database } from '@/database.types'
import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'

export async function deleteLead(leadId: string) {
  const supabase = createClient()
  await supabase.from('leads').delete().match({ id: leadId })

  revalidatePath('/dashboard/leads')
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: Database['public']['Enums']['leadStatus'],
) {
  const supabase = createClient()
  await supabase
    .from('leads')
    .update({ status: newStatus })
    .match({ id: leadId })

  revalidatePath('/dashboard/leads')
}
