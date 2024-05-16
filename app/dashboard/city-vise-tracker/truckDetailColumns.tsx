"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DataTableRowActions from "../_components/DataTableRowActions";

export type CityViseTrackerType = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

type TruckDetailsColumnsPropsType = {
    onEdit: (data) => void;
    onDelete: (data) => void;
};

export const truckDetailColumns = ({
    onEdit,
    onDelete,
}: TruckDetailsColumnsPropsType): ColumnDef<CityViseTrackerType>[] => [
    {
        accessorKey: "curent_location",
        header: "Location",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DataTableRowActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    },
];
