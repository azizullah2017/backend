"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import DataTableRowStatus from "../_components/DataTableRowStatus";

export type CityViseTrackerType = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const columns: ColumnDef<CityViseTrackerType>[] = [
    {
        accessorKey: "bl",
        header: "BL",
    },
    {
        accessorKey: "shipper",
        header: "Shipper",
    },
    {
        accessorKey: "shipper_reference",
        header: "Shipper Ref",
    },
    {
        accessorKey: "consignee",
        header: "Consignee",
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
        accessorKey: "port_of_loading",
        header: "POF",
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
        accessorKey: "eta",
        header: "Delivery ETA",
    },
    {
        accessorKey: "curent_location",
        header: "Current Location",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <DataTableRowStatus status={row.original.status} />,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const clientView = row.original;

            return (
                <Button
                    variant="outline"
                    onClick={() => console.log("hello world")}
                >
                    <Link href={`/dashboard/tracker?bl=${clientView.bl}`}>
                        Details
                    </Link>
                </Button>
            );
        },
    },
];
