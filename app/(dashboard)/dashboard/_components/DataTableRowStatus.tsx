import { Badge } from "@/components/ui/badge";

const DataTableRowStatus = (status: { [status: string]: string }) => {
    const badgeColor: Record<string, string> = {
        pending: "bg-red-600",
        inprogress: "bg-blue-600",
        done: "bg-green-600",
    };

    return <Badge className={badgeColor[status.status]}>{status.status}</Badge>;
};

export default DataTableRowStatus;
