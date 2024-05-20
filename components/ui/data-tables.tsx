"use client";

import {
    ColumnDef,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "../Pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    currentPage?: number;
    totalRows?: number;
    pagination?: boolean;
    tableHeight?: string;
    columnVisibility?: VisibilityState;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize,
    currentPage,
    totalRows,
    pagination = true,
    tableHeight = "h-full",
    columnVisibility,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            columnVisibility,
        },
    });

    return (
        <>
            <div className="rounded-xl border border-[#ebeaea] shadow-lg">
                <div
                    className={`${tableHeight} relative overflow-auto rounded-xl`}
                >
                    <Table className="text-xs md:text-sm">
                        <TableHeader className="bg-[#58A7C6]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`text-white w-[${header.getSize()}px]`}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
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
                                            row.getIsSelected() && "selected"
                                        }
                                        className="bg-white"
                                    >
                                        {row.getVisibleCells().map((cell) => (
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
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {pagination && (
                <Pagination
                    itemCount={totalRows}
                    pageSize={pageSize}
                    currentPage={currentPage}
                />
            )}
        </>
    );
}
