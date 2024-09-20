import { Tables } from "@/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { File, ListFilter } from "lucide-react";
import { columns, DataTable } from "./lead-table";

export interface TabItemProps {
  value: string;
  title: string;
  description: string;
}

export default function Leads({ leads }: { leads: Tables<"leads">[] | null }) {
  const tabItems: TabItemProps[] = [
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
          {tabItems.map((tab) => (
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

      {tabItems.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <DataTable
            columns={columns}
            tab={tab}
            data={filterLeads(tab.value)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
