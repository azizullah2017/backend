"use client";

import { useEffect, useState } from "react";
import ContainerPortStatusForm from "./ContainerPortStatusForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StaffTableActions from "@/components/StaffTableActions";
import { BASE_URL } from "@/lib/constants";

const ContainerStatus = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const router = useRouter();
    const { userData } = useAuth();
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
        const fetchData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/port?page=${page}&limit=${pageSize}`,
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

                setData(tableData.ports);
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
                    <ContainerPortStatusForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
            </div>
            <div className="mt-5 w-[80vw]">
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

export default ContainerStatus;
