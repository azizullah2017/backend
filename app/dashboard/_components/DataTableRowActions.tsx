import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { TbEdit, TbTrash } from "react-icons/tb";

type DataTableRowActionsType<TData> = {
    row: Row<TData>;
    onEdit: (value: TData) => void;
    onDelete: (value: TData) => void;
};

const DataTableRowActions = <TData,>({
    row,
    onEdit,
    onDelete,
}: DataTableRowActionsType<TData>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <TbEdit className="w-[20px] h-[20px] mr-2" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(row.original)}>
                    <TbTrash className="w-[20px] h-[20px] mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DataTableRowActions;
