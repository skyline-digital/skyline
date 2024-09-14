import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import LeadTable from "@/components/leads/lead-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFormattedDate } from "@/utils/utils";
import { cn } from "@/lib/utils";
import LeadItem from "@/components/leads/lead-item";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: leads } = await supabase.from("leads").select();
  const { data: selectedLead } = await supabase
    .from("leads")
    .select()
    .eq("id", searchParams.q ?? "")
    .single();

  console.log(selectedLead);

  return (
    <main className={cn('grid flex-1 items-start gap-4 md:gap-8 grid-cols-1 grid-rows-2', selectedLead && 'lg:grid-cols-[2fr_1fr] lg:grid-rows-1')}>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8'>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
          <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
            <CardHeader className='pb-3'>
              <CardTitle>Your Leads</CardTitle>
              <CardDescription className='max-w-lg text-balance leading-relaxed'>
                Manage your leads and turn them into customers
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Lead</Button>
            </CardFooter>
          </Card>
          <Card x-chunk='dashboard-05-chunk-1'>
            <CardHeader className='pb-2'>
              <CardDescription>This Week</CardDescription>
              <CardTitle className='text-4xl'>$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label='25% increase' />
            </CardFooter>
          </Card>
          <Card x-chunk='dashboard-05-chunk-2'>
            <CardHeader className='pb-2'>
              <CardDescription>This Month</CardDescription>
              <CardTitle className='text-4xl'>$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label='12% increase' />
            </CardFooter>
          </Card>
        </div>
        <LeadTable leads={leads} />
      </div>
      {selectedLead && (
        <LeadItem lead={selectedLead} />
      )}
    </main>
  );
}
