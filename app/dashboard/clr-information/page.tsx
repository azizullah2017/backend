"use client";

import { useEffect, useState } from "react";
import CLRForm from "./CLRForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import StaffTableActions from "@/components/StaffTableActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";

const CLRInformation = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;
    const router = useRouter();
    const { userData } = useAuth();
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
                `${BASE_URL}/api/clr?page=${page}&limit=${pageSize}`,
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

                setData(tableData.clrs);
                setTotalRows(tableData.total_count);
            }
        };

        fetchData();
    }, [page]);

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
                        totalRows={totalRows}
                    />
                </div>
            </div>
        </>
    );
};

export default CLRInformation;
