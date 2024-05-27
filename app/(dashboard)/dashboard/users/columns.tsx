"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DataTableRowActions from "../_components/DataTableRowActions";
import DataTableRowStatus from "../_components/DataTableRowStatus";

export type User = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

type UserColumnsPropsType = {
    onEdit: (data) => void;
    onDelete: (data) => void;
};

export const userColumns = ({
    onEdit,
    onDelete,
}: UserColumnsPropsType): ColumnDef<User>[] => [
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "mobile_no",
        header: "Mobile Number",
    },
    {
        accessorKey: "company_name",
        header: "Company Name",
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
