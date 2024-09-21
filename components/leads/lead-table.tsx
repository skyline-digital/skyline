'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Tables } from '@/database.types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import LocalDate from '@/components/local-date'
import LeadStatusBadge from './lead-status-badge'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Input } from '../ui/input'
import { Identifiable } from '@/utils/definitions'
import { TabItemProps } from './leads'
import { getTitleCase } from '@/utils/utils'
import React, { Suspense } from 'react'
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
} from '../ui/alert-dialog'
import { deleteLead } from '@/utils/dal'

export const columns: ColumnDef<Tables<'leads'>>[] = [
  {
    accessorKey: 'name',
    header: 'Lead name',
    cell: ({ row }) => {
      const lead = row.original

      return (
        <>
          <div className="font-medium">{lead.name}</div>
          <div className="text-sm text-muted-foreground">
            <LocalDate timestamp={lead.created_at} />
          </div>
        </>
      )
    },
  },
  {
    accessorKey: 'company_name',
    header: 'Company name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => {
      const lead = row.original

      return getTitleCase(lead.source || '')
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const lead = row.original

      return <LeadStatusBadge status={lead.status} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const lead = row.original

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(lead.id)}
              >
                Copy lead ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View messages</DropdownMenuItem>
              <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                <DropdownMenuItem className="text-red-500">
                  Trash
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent asChild>
            <form action={() => deleteLead(lead.id)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" type="submit" asChild>
                  <AlertDialogAction>Delete</AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]

interface LeadTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  tab: TabItemProps
}

export function DataTable<TData extends Identifiable, TValue>({
  columns,
  data,
  tab,
}: LeadTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    state: {
      columnFilters,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        id: false,
        email: false,
      },
    },
  })

  return (
    <Suspense>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7 flex flex-row justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>{tab.title}</CardTitle>
            <CardDescription>{tab.description}</CardDescription>
          </div>
          <Input
            placeholder="Search emails..."
            value={table.getColumn('email')?.getFilterValue() as string}
            onChange={(event) =>
              table.getColumn('email')?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          <div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={
                          (row.getIsSelected() ||
                            searchParams.get('q') === row.id) &&
                          'selected'
                        }
                        onClick={() => {
                          row.toggleSelected()
                          if (row.getIsSelected()) {
                            router.push(pathname, { scroll: false })
                          } else {
                            router.push(`${pathname}?q=${row.id}`, {
                              scroll: false,
                            })
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div
              className={cn(
                'flex items-center justify-end space-x-2 py-4',
                table.getPageCount() < 2 && 'hidden',
              )}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Suspense>
  )
}
