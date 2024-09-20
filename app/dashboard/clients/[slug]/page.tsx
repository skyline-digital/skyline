import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMetrics } from "@/utils/metrics";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Leads from "@/components/leads/leads";
import LeadItem from "@/components/leads/lead-item";
import Image from "next/image";

export default async function ClientPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: client } = await supabase
    .from("clients")
    .select()
    .eq("slug", params.slug)
    .single();

  if (!client) {
    console.log("here");
    return null;
  }

  return (
    <main className='grid flex-1 items-start gap-4 md:gap-8 grid-cols-1'>
      <Card className='overflow-hidden'>
        <Image
          className='w-full h-60 object-cover'
          src={client.cover || ""}
          alt={client.company_name}
          width={1180}
          height={394}
        />
      </Card>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8'>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4'>
          <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
            <CardHeader>
              <CardTitle>{client.company_name}</CardTitle>
              <CardDescription className='max-w-lg text-balance leading-relaxed'>
                {client.name} - {client.email}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href='/dashboard/client/new'>Message Client</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {client.projects?.map((project, index) => (
            <Card key={index} className='overflow-hidden'>
              <CardHeader>
                <CardTitle>{project}</CardTitle>
                <CardDescription className='max-w-lg text-balance leading-relaxed'>
                  {project}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href='/dashboard/client/new'>View More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
