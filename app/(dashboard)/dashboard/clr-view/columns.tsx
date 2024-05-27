"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import DataTableRowActions from "../_components/DataTableRowActions";
import DataTableRowStatus from "../_components/DataTableRowStatus";

export type CLRInformation = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const clrColumns: ColumnDef<CLRInformation>[] = [
    {
        accessorKey: "book_no",
        header: () => {
            {
                return <div className="cursor-pointer">Booking No.</div>;
            }
        },
    },
    {
        accessorKey: "shipper_reference",
        header: "Shipper Ref",
    },
    {
        accessorKey: "shipper",
        header: "Shipper",
    },
    {
        accessorKey: "consignee",
        header: "Consignee",
    },
    {
        accessorKey: "no_container",
        header: "Count",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "product",
        header: "Product",
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
        accessorKey: "vessel",
        header: "Vessel",
    },
    {
        accessorKey: "etd",
        header: "ETD",
    },
    {
        accessorKey: "eta_karachi",
        header: "ETA Karachi",
    },
    {
        accessorKey: "comment",
        header: "Comments",
    },
];
