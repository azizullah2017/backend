"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LocationColumns = {
    truck_no: string;
    location: number;
    date: string;
};

export const locationColumns: ColumnDef<LocationColumns>[] = [
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
];
