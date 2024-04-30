"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ContainerPortStatusForm from "./ContainerPortStatusForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StaffTableActions from "@/components/StaffTableActions";

const tableData = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        delivery: "Silver Globe",
        gdNo: "6",
        clearingAgent: "Coconut Oil",
        truckNo: "PGU",
        driver: "KHI",
        contactDetails: "TASH",
        containers: ["test", "test2", "test3"],
        transporter: "TASH",
        truckPlacement: "TASH",
        truckOut: "TASH",
        status: "pending",
    },
];

const ContainerStatus = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState(tableData);
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData.role !== "";
    const isAuthorized = userData.role !== "" && userData.role === "staff";
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 1;

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
                    <ContainerPortStatusForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
            </div>
            <div className="mt-5">
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

export default ContainerStatus;
