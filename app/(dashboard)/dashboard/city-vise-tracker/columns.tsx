"use client";

import { ColumnDef } from "@tanstack/react-table";
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
        accessorKey: "bl_containers",
        header: "Containers",
        cell: ({ row }) => {
            const containers = row.original.bl_containers?.split(",");

            return containers?.map((container, index) => (
                <p key={index}>{container}</p>
            ));
        },
    },
    {
        accessorKey: "truck_no",
        header: "Truck Number",
    },
    {
        accessorKey: "curent_location",
        header: "Current Location",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <DataTableRowStatus status={row.original.status} />,
    },
];
