"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type CityViseTrackerType = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const truckDetailColumns: ColumnDef<CityViseTrackerType>[] = [
    {
        accessorKey: "curent_location",
        header: "Location",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
];
