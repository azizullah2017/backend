"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTableRowStatus from "../_components/DataTableRowStatus";
import DataTableRowActions from "../_components/DataTableRowActions";

export type ContainerPortStatusType = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

type containerPortColumnsPropsType = {
    onEdit: (data) => void;
    onDelete: (data) => void;
};

export const containerPortColumns = ({
    onEdit,
    onDelete,
}: containerPortColumnsPropsType): ColumnDef<ContainerPortStatusType>[] => [
    {
        accessorKey: "bl",
        header: "BL",
    },
    {
        accessorKey: "delivery_at",
        header: "Delivery",
    },
    {
        accessorKey: "gd_no",
        header: "GD No.",
    },
    {
        accessorKey: "clearing_agent",
        header: "Clearing Agent",
    },
    {
        accessorKey: "truck_no",
        header: "Truck No.",
    },
    {
        accessorKey: "driver_name",
        header: "Driver",
    },
    {
        accessorKey: "driver_mobile_no",
        header: "Contact Details",
    },
    {
        accessorKey: "bl_containers",
        header: "Containers",
        cell: ({ row }) => {
            const containers = row.original.bl_containers.split(",");

            return containers.map((container, index) => (
                <p key={index}>{container}</p>
            ));
        },
    },
    {
        accessorKey: "transporter",
        header: "Transporter",
    },
    {
        accessorKey: "truck_placement_date",
        header: "Truck Placement",
    },
    {
        accessorKey: "truck_out_date",
        header: "Truck Out",
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
