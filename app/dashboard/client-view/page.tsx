"use client";

import StaffTableActions from "@/components/StaffTableActions";
import { DataTable } from "@/components/ui/data-tables";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const ClientView = ({ searchParams }: { searchParams: { page: string } }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData?.role !== "";
    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "customer" || userData?.role === "admin");

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
        if (!isAuthorized) return router.push(`/dashboard/clr-information`);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/client?page=${page}&limit=${pageSize}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
            } else {
                const { trackers, total_count } = await res.json();

                setData(trackers);
                setTotalRows(total_count);
            }
        };

        fetchData();
    }, [page]);

    return (
        <>
            {isAuthorized && (
                <div className="flex flex-col">
                    <StaffTableActions setData={setData} />
                    <div className="mt-5">
                        <DataTable
                            columns={columns}
                            data={data}
                            pageSize={pageSize}
                            currentPage={page}
                            totalRows={totalRows}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientView;
