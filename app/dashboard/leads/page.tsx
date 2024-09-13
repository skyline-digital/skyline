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
    <main className='grid flex-1 items-start space-x-4 md:space-x-8 lg:grid-cols-[2fr_1fr] lg:grid-rows-1'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 lg:row-span-1'>
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
        <div>
          <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
            <CardHeader className='flex flex-row items-start bg-muted/50'>
              <div className='grid gap-0.5'>
                <CardTitle className='group flex items-center gap-2 text-lg'>
                  {selectedLead.name}
                  {/* <Button
                    size='icon'
                    variant='outline'
                    className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
                  >
                    <Copy className='h-3 w-3' />
                    <span className='sr-only'>Copy Order ID</span>
                  </Button> */}
                </CardTitle>
                <CardDescription>
                  Created: {getFormattedDate(selectedLead.created_at)}
                </CardDescription>
              </div>
              <div className='ml-auto flex items-center gap-1'>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size='icon' variant='outline' className='h-8 w-8'>
                        <MoreVertical className='h-3.5 w-3.5' />
                        <span className='sr-only'>More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className='text-red-500'>
                          Trash
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <form>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant='destructive' asChild>
                          <AlertDialogAction>Delete</AlertDialogAction>
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className='p-6 text-sm'>
              {/* <div className='grid gap-3'>
                <div className='font-semibold'>Order Details</div>
                <ul className='grid gap-3'>
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>
                      Glimmer Lamps x <span>2</span>
                    </span>
                    <span>$250.00</span>
                  </li>
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>
                      Aqua Filters x <span>1</span>
                    </span>
                    <span>$49.00</span>
                  </li>
                </ul>
                <Separator className='my-2' />
                <ul className='grid gap-3'>
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span>$299.00</span>
                  </li>
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Shipping</span>
                    <span>$5.00</span>
                  </li>
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Tax</span>
                    <span>$25.00</span>
                  </li>
                  <li className='flex items-center justify-between font-semibold'>
                    <span className='text-muted-foreground'>Total</span>
                    <span>$329.00</span>
                  </li>
                </ul>
              </div>
              <Separator className='my-4' />
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-3'>
                  <div className='font-semibold'>Shipping Information</div>
                  <address className='grid gap-0.5 not-italic text-muted-foreground'>
                    <span>Liam Johnson</span>
                    <span>1234 Main St.</span>
                    <span>Anytown, CA 12345</span>
                  </address>
                </div>
                <div className='grid auto-rows-max gap-3'>
                  <div className='font-semibold'>Billing Information</div>
                  <div className='text-muted-foreground'>
                    Same as shipping address
                  </div>
                </div>
              </div>
              <Separator className='my-4' /> */}
              <div className='grid gap-3'>
                <div className='font-semibold'>Lead Information</div>
                <dl className='grid gap-3'>
                  <div className='flex items-center justify-between'>
                    <dt className='text-muted-foreground'>Lead Name</dt>
                    <dd>{selectedLead.name}</dd>
                  </div>
                  <div className='flex items-center justify-between'>
                    <dt className='text-muted-foreground'>Email</dt>
                    <dd>
                      <a href='mailto:'>{selectedLead.email}</a>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator className='my-4' />
              <div className='grid gap-3'>
                <div className='font-semibold'>Payment Information</div>
                <dl className='grid gap-3'>
                  <div className='flex items-center justify-between'>
                    <dt className='flex items-center gap-1 text-muted-foreground'>
                      <CreditCard className='h-4 w-4' />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
              <div className='text-xs text-muted-foreground'>
                Updated <time dateTime='2023-11-23'>November 23, 2023</time>
              </div>
              <Pagination className='ml-auto mr-0 w-auto'>
                <PaginationContent>
                  <PaginationItem>
                    <Button size='icon' variant='outline' className='h-6 w-6'>
                      <ChevronLeft className='h-3.5 w-3.5' />
                      <span className='sr-only'>Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size='icon' variant='outline' className='h-6 w-6'>
                      <ChevronRight className='h-3.5 w-3.5' />
                      <span className='sr-only'>Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
