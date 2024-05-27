"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTableRowStatus from "../_components/DataTableRowStatus";
import DataTableRowActions from "../_components/DataTableRowActions";

export type ShipmentInformation = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

type ShipmentColumnsPropsType = {
    onEdit: (data) => void;
    onDelete: (data) => void;
};

export const shipmentColumns = ({
    onEdit,
    onDelete,
}: ShipmentColumnsPropsType): ColumnDef<ShipmentInformation>[] => [
    {
        accessorKey: "book_no",
        header: "Booking No.",
        size: 100,
    },
    {
        accessorKey: "bl",
        header: "BL",
        size: 100,
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
        cell: ({ row }) => <DataTableRowStatus status={row.original.status} />,
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
