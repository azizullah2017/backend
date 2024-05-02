"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

export type CLRInformation = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

const setNewParams = () => {
    const timeout = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);

        console.log(window.location.search);

        if (!params.has("orderBy")) {
            params.set("orderBy", "bookingNo");
        }
        if (params.has("page")) params.set("page", "1");
        if (params.has("search"))
            params.set("search", params.get("search") as string);

        const newUrl = `${window.location.origin}${
            window.location.pathname
        }?${params.toString()}`;

        console.log(newUrl);

        return <Link href={newUrl}></Link>;

        // alert(params.toString());
    }, 1000);

    // window.location.href = newUrl;
};

export const columns: ColumnDef<CLRInformation>[] = [
    {
        accessorKey: "book_no",
        header: () => {
            {
                return (
                    <div className="cursor-pointer" onClick={setNewParams}>
                        Booking No.
                    </div>
                );
            }
        },
    },
    {
        accessorKey: "shipper",
        header: "Shipper",
    },
    {
        accessorKey: "consignee",
        header: "Consignee",
    },
    {
        accessorKey: "no_container",
        header: "Count",
    },
    {
        accessorKey: "product",
        header: "Product",
    },
    {
        accessorKey: "port_of_loading",
        header: "POL",
    },
    {
        accessorKey: "port_of_departure",
        header: "POD",
    },
    {
        accessorKey: "final_port_of_destination",
        header: "FPOD",
    },
    {
        accessorKey: "vessel",
        header: "Vessel",
    },
    {
        accessorKey: "eta_karachi",
        header: "ETA Karachi",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const badgeColor: Record<string, string> = {
                pending: "bg-red-600",
                "In Progress": "bg-blue-600",
                Closed: "bg-green-600",
            };

            return <Badge className={badgeColor[status]}>{status}</Badge>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const clrInformation = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert("hello world!")}>
                            <TbEdit className="w-[20px] h-[20px] mr-2" />
                            Update
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => alert("Deleted! Not actually ;)")}
                        >
                            <TbTrash className="w-[20px] h-[20px] mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
