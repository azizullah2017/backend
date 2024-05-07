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

export type CLRInformation = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const columns: ColumnDef<CLRInformation>[] = [
    {
        accessorKey: "book_no",
        header: "Booking No.",
    },
    {
        accessorKey: "bl",
        header: "BL",
    },
    {
        accessorKey: "no_container",
        header: "VOL",
    },
    {
        accessorKey: "eta_arrival",
        header: "ETA AR",
    },
    {
        accessorKey: "eta_departure",
        header: "ETA DE",
    },
    {
        accessorKey: "port",
        header: "PORT",
    },
    {
        accessorKey: "docs",
        header: "Docs",
    },
    {
        accessorKey: "surrender",
        header: "Surrender",
    },
    {
        accessorKey: "containers",
        header: "Containers",
        cell: ({ row }) => {
            const containers = row.original.containers.split(",");

            return containers.map((container, index) => (
                <p key={index}>{container}</p>
            ));
        },
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
            const shipmentStatus = row.original;

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
