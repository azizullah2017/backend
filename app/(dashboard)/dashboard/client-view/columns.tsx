"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
            const containers = row.original.containers?.split(",");

            return containers?.map((container, index) => (
                <p key={index}>{container}</p>
            ));
        },
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
        accessorKey: "eta_karachi",
        header: "ETA Karachi",
    },
    {
        accessorKey: "etd",
        header: "Delivery ETD",
    },
    {
        accessorKey: "surrender",
        header: "Surrender",
    },
    {
        accessorKey: "docs",
        header: "Docs",
    },
    {
        accessorKey: "no_container",
        header: "Volume",
    },
    {
        accessorKey: "curent_location",
        header: "Current Location",
    },
    {
        accessorKey: "comment",
        header: "Comments",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const clientView = row.original;

            return (
                <Button variant="outline">
                    <Link href={`/dashboard/tracker?bl=${clientView.bl}`}>
                        Details
                    </Link>
                </Button>
            );
        },
    },
];
