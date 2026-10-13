"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Contact } from "@/src/types/contacts-schema"
import { useContacts } from "@/src/hooks/useContacts"
import { formatPhone } from "@/src/lib/format-phone"
import CreateContactForm from "@/src/components/contacts-form"
import { getAriaSort } from "@/src/lib/aria"
import { ContactActions } from "@/src/components/contact-actions"

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        aria-sort={getAriaSort(column.getIsSorted())}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 text-gray-800 hover:text-purple-700"
      >
        Nome
        <ArrowUpDown
          className={
            column.getIsSorted()
              ? "text-purple-600"
              : "text-gray-400"
          }
        />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="capitalize text-gray-700">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        aria-sort={getAriaSort(column.getIsSorted())}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 text-gray-800 hover:text-purple-700"
      >
        Email
        <ArrowUpDown
          className={
            column.getIsSorted()
              ? "text-purple-600"
              : "text-gray-400"
          }
        />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        aria-sort={getAriaSort(column.getIsSorted())}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 text-gray-800 hover:text-purple-700"
      >
        Telefone
        <ArrowUpDown
          className={
            column.getIsSorted()
              ? "text-purple-600"
              : "text-gray-400"
          }
        />
      </Button>
    ),
    cell: ({ getValue }) => {
      const phone = getValue<string | null>()
      return (
        <span className="text-gray-700">
          {phone ? formatPhone(phone) : "-"}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-gray-800 font-medium">Ações</span>
    ),
    cell: ({ row }) => (
      <ContactActions contact={row.original} />
    )
  },
]

export default function ContactsPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")

  const deferredSearch = React.useDeferredValue(search)

  const sortBy = sorting[0]?.id ?? "name"
  const sortOrder = sorting[0]?.desc ? "desc" : "asc"

  const handleLimitChange = (value: string) => {
    setLimit(Number(value))
    setPage(1)
  }

  const { data, isLoading } = useContacts({
    page,
    limit,
    search: deferredSearch,
    sortBy,
    sortOrder,
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting, columnVisibility },
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <main className="flex w-full min-h-[91dvh] px-4 py-10 bg-neutral-100">
      <section className="w-full bg-white rounded-lg shadow-sm p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-8 w-72"
              placeholder="Buscar por nome…"
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
            />
          </div>

          <CreateContactForm />
        </div>

        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="bg-neutral-50 text-gray-800 font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    Carregando contatos...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {(data?.meta?.totalItems ?? 0) > 0 &&
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[5, 10, 15, 20].map(v => (
                    <SelectItem key={v} value={String(v)}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                disabled={page <= 1}
                aria-label="Página anterior"
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline">Anterior</span>
              </Button>

              <span className="text-gray-700">
                Página {page} de {data?.meta?.totalPages ?? 1}
              </span>

              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                disabled={page >= (data?.meta?.totalPages ?? 0)}
                aria-label="Próxima página"
                onClick={() => setPage(p => Math.min((data?.meta?.totalPages ?? 0), p + 1))}
              >
                <span className="hidden md:inline">Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      </section>
    </main>
  )
}
