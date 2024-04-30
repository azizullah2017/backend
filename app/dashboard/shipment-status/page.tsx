"use client";

import { Button } from "@/components/ui/button";
import ShipmentStatusForm from "./ShipmentStatusForm";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StaffTableActions from "@/components/StaffTableActions";

const tableData = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        vol: "Silver Globe",
        etaAr: "6",
        etaDe: "Coconut Oil",
        port: "PGU",
        docs: "KHI",
        surrender: "TASH",
        containers: ["test", "test2", "test3"],
        status: "pending",
    },
];

const ShipmentStatus = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState(tableData);
    const router = useRouter();
    const { userData } = useAuth();
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 1;
    const isAuthenticated = userData.role !== "";
    const isAuthorized = userData.role !== "" && userData.role === "staff";

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
        if (!isAuthorized) return router.push(`/dashboard/${userData.role}`);
    }, []);

    return (
        <>
            <div className="flex">
                <StaffTableActions
                    setIsShowing={setIsShowing}
                    setData={setData}
                />
                <div className="z-10">
                    <ShipmentStatusForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
            </div>
            <div className="mt-10">
                <DataTable
                    columns={columns}
                    data={data}
                    pageSize={pageSize}
                    currentPage={page}
                />
            </div>
        </>
    );
};

export default ShipmentStatus;
