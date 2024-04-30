"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CityViseTrackerForm from "./CityViseTrackerForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StaffTableActions from "@/components/StaffTableActions";

const tableData = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        truckNo: "Silver Globe",
        driver: "6",
        contactDetails: "Coconut Oil",
        containers: ["PGU", "Test2", "Test3"],
        transporter: "KHI",
        delivery: "TASH",
        currentPosition: "test",
        eta: "11-04-2024",
        status: "pending",
    },
];

const CityViseTracker = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState(tableData);
    const { userData } = useAuth();
    const router = useRouter();
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
                    <CityViseTrackerForm
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

export default CityViseTracker;
