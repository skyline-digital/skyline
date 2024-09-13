"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { File, ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tables } from "@/database.types";
import { Badge } from "../ui/badge";
import { getFormattedDate } from "@/utils/utils";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";

export default function LeadTable({
  leads,
}: {
  leads: Tables<"leads">[] | null;
}) {
  const leadStatuses = [
    {
      value: "open",
      title: "Open Leads",
      description: "Open leads that require your attention",
    },
    {
      value: "closed",
      title: "Closed Leads",
      description: "Leads that have been closed",
    },
    {
      value: "lost",
      title: "Lost Leads",
      description: "Leads that have been lost",
    },
  ];

  // Function to filter leads based on their status
  const filterLeads = (status: string): Tables<"leads">[] => {
    return (
      leads?.filter(
        (lead) =>
          lead.status === status || (status === "open" && lead.status === "new")
      ) || []
    );
  };

  return (
    <Tabs defaultValue='open'>
      <div className='flex items-center'>
        <TabsList>
          {leadStatuses.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.value.charAt(0).toUpperCase() + tab.value.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-7 gap-1 text-sm'>
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only'>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Fulfilled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' variant='outline' className='h-7 gap-1 text-sm'>
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only'>Export</span>
          </Button>
        </div>
      </div>

      {leadStatuses.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card x-chunk='dashboard-05-chunk-3'>
            <CardHeader className='px-7'>
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <LeadsTable leads={filterLeads(tab.value)} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Reusable Table component
function LeadsTable({ leads }: { leads: Tables<"leads">[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log(searchParams);

  return leads.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead className='hidden sm:table-cell'>Contact</TableHead>
          <TableHead className='hidden sm:table-cell'>Source</TableHead>
          <TableHead className='hidden md:table-cell'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow
            key={lead.id}
            onClick={(e) => {
              router.replace(`/dashboard/leads?q=${lead.id}`);
              e.stopPropagation();
            }}
            className={cn(
              "cursor-pointer",
              searchParams.get("q") === lead.id ? "bg-accent" : ""
            )}
          >
            <TableCell>
              <div className='font-medium'>{lead.name}</div>
              <div className='hidden text-sm text-muted-foreground md:inline'>
                {getFormattedDate(lead.created_at)}
              </div>
            </TableCell>
            <TableCell className='hidden sm:table-cell'>{lead.email}</TableCell>
            <TableCell className='hidden sm:table-cell'>
              {lead.source}
            </TableCell>
            <TableCell className='hidden sm:table-cell'>
              <Badge className='text-xs' variant='secondary'>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className='text-center text-muted-foreground text-sm'>
      No leads to show
    </div>
  );
}
