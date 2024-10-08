import { cn } from '@/utils/cn'
import { getMetrics } from '@/utils/metrics'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import LeadItem from '@/components/leads/lead-item'
import Leads from '@/components/leads/leads'
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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: leads } = await supabase
    .from('leads')
    .select()
    .order('created_at', { ascending: false })

  const { data: selected } = await supabase
    .from('leads')
    .select()
    .eq('id', searchParams.q ?? '')
    .single()

  const metrics = {
    week: getMetrics(leads, 'week'),
    month: getMetrics(leads, 'month'),
  }

  return (
    <main
      className={cn(
        'grid auto-rows-max grid-cols-1 items-start gap-4 md:gap-8',
        selected && 'lg:grid-cols-[2fr_1fr] lg:grid-rows-1',
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader>
              <CardTitle>Your Leads</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Manage your leads and turn them into customers
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/leads/new">Create New Lead</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="col-span-1" x-chunk="dashboard-05-chunk-1">
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
          <Card className="col-span-1" x-chunk="dashboard-05-chunk-2">
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
        <Leads leads={leads} />
      </div>
      {selected && (
        <div className="sticky top-6">
          <LeadItem lead={selected} />
        </div>
      )}
    </main>
  )
}
