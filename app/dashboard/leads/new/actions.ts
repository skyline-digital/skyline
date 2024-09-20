"use server";

import { createLeadSchema } from "@/components/leads/create-lead";
import { Tables, TablesInsert } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createNewLead(data: TablesInsert<"leads">) {
  const supabase = createClient();

  const { error } = await supabase.from("leads").insert([data]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");

  return { success: true };
}
