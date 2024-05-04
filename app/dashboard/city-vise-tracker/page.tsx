"use client";

import { useEffect, useState } from "react";
import CityViseTrackerForm from "./CityViseTrackerForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StaffTableActions from "@/components/StaffTableActions";
import { BASE_URL } from "@/lib/constants";

const CityViseTracker = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [revalidate, setRevalidate] = useState(false);
    const { userData } = useAuth();
    const router = useRouter();
    const isAuthenticated = userData?.role !== "";
    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "staff" || userData?.role === "admin");
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
        if (!isAuthorized) return router.push(`/dashboard/${userData?.role}`);
    }, []);

    useEffect(() => {
        if ((page && revalidate) || page) {
            const fetchData = async () => {
                const res = await fetch(
                    `${BASE_URL}/api/tracker?page=${page}&limit=${pageSize}`,
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

                    setData(tableData.trackers);
                    setTotalRows(tableData.total_count);
                    setRevalidate(false);
                }
            };

            fetchData();
        }
    }, [page, revalidate]);

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
                        setRevalidate={setRevalidate}
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

export default CityViseTracker;
