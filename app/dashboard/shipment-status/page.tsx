"use client";

import ShipmentStatusForm from "./ShipmentStatusForm";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StaffTableActions from "@/components/StaffTableActions";
import { BASE_URL } from "@/lib/constants";

const ShipmentStatus = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const router = useRouter();
    const { userData } = useAuth();
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;
    const isAuthenticated = userData?.role !== "";
    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "staff" || userData?.role === "admin");

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
        if (!isAuthorized) return router.push(`/dashboard/${userData?.role}`);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/shipment?page=${page}&limit=${pageSize}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
            } else {
                const tableData = await res.json();

                setData(tableData.shipments);
                setTotalRows(tableData.total_count);
            }
        };

        fetchData();
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
            <div className="mt-5">
                <DataTable
                    columns={columns}
                    data={data}
                    pageSize={pageSize}
                    currentPage={page}
                    totalRows={totalRows}
                />
            </div>
        </>
    );
};

export default ShipmentStatus;
