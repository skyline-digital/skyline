import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getMetrics } from '@/utils/metrics'
import { cn } from '@/utils/cn'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import SlackIcon from '@/components/svg/slack-icon'

export default async function ClientsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: clients } = await supabase
    .from('clients')
    .select()
    .order('created_at', { ascending: false })

  if (!clients) {
    return null
  }

  const metrics = {
    week: getMetrics(clients, 'week'),
    month: getMetrics(clients, 'month'),
  }

  return (
    <main className="grid flex-1 items-start gap-4 md:gap-8 grid-cols-1">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader>
              <CardTitle>Your Clients</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Manage your clients and their projects
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/client/new">Convert Lead to Client</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">
                {metrics.week.currentPeriod.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {metrics.week.percentageChange}% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={metrics.week.percentageChange}
                aria-label={`${metrics.week.percentageChange}% change`}
              />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">
                {metrics.month.currentPeriod.length ?? 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {metrics.month.percentageChange}% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={metrics.month.percentageChange}
                aria-label={`${metrics.month.percentageChange}% change`}
              />
            </CardFooter>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <Card key={index} className="overflow-hidden">
              <Image
                src={client.cover || ''}
                alt={client.company_name}
                width={1080}
                height={392}
              />
              <CardHeader>
                <CardTitle>{client.company_name}</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed flex flex-col">
                  {client.name}
                  <a className="w-fit" href={`mailto:${client.email}`}>
                    {client.email}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardFooter className="space-x-1.5">
                <Button variant="outline" size="icon" asChild>
                  <Link href={client?.slack || ''} target="_blank">
                    <SlackIcon />
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/clients/${client.slug}`}>
                    View More
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
