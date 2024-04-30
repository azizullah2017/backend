"use client";

import { useEffect, useState } from "react";
import CLRForm from "./CLRForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import CLRActions from "./CLRActions";
import StaffTableActions from "@/components/StaffTableActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const tableData = [
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
];

const CLRInformation = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [data, setData] = useState(tableData);
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 1;
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData.role !== "";
    const isAuthorized = userData.role !== "" && userData.role === "staff";

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
        if (!isAuthorized) return router.push(`/dashboard/${userData.role}`);
    }, []);

    return (
        <>
            <div className="flex flex-col">
                <StaffTableActions
                    setIsShowing={setIsShowing}
                    setData={setData}
                />
                <div className="z-10">
                    <CLRForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
                <div className="mt-5">
                    <DataTable
                        columns={columns}
                        data={data}
                        pageSize={pageSize}
                        currentPage={page}
                    />
                </div>
            </div>
        </>
    );
};

export default CLRInformation;
