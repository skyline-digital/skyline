import { sendSlackMessage } from "@/app/actions";
import { Database, Tables, TablesInsert } from "@/database.types";
import { getFormattedDate } from "@/utils/utils";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      message,
      source: "website",
    });

    const { data } = await supabase
      .from("leads")
      .select()
      .eq("email", email)
      .single();

    if (!data) {
      return new NextResponse("Error creating lead", { status: 500 });
    }

    const leadURL = `${req.nextUrl.origin}/dashboard/leads?q=${data.id}`;

    await sendSlackMessage(
      JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `You have a new form submission:\n*<http://localhost:3000/dashboard/leads?q=${data.id}|${name} - New lead added>*`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${data.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n<mailto:${data.email}|${data.email}>`,
              },
              {
                type: "mrkdwn",
                text: "*Source:*\nWebsite",
              },
              {
                type: "mrkdwn",
                text: `*Created:*\n${getFormattedDate(data.created_at)}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message*\n${data.message}`,
            },
          },
        ],
      })
    );

    if (error) {
      return new NextResponse(JSON.stringify(error), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ leadURL }), { status: 201 });
  } catch (error: any) {
    throw new Error(error);
  }
}
