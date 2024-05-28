"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-tables";
import { clrColumns } from "./columns";
import StaffTableActions from "@/components/StaffTableActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL, TABLE_ROW_SIZE } from "@/lib/constants";

const CLRView = ({
    searchParams,
}: {
    searchParams: { page: string; search?: string };
}) => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = TABLE_ROW_SIZE;
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData?.role !== "";

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
    }, []);

    useEffect(() => {
        if (page || searchQuery) {
            let queryString = "";
            if (searchQuery !== "") {
                queryString = `search=${searchQuery}&page=${page}&limit=${pageSize}`;
            } else {
                queryString = `page=${page}&limit=${pageSize}`;
            }
            const fetchData = async () => {
                setIsLoading(true);
                const res = await fetch(
                    `${BASE_URL}/api/clr?${queryString}&company_name=${userData?.companyName}`,
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
                setIsLoading(false);
            };

            fetchData();
        }
    }, [page, searchQuery]);

    return (
        <>
            <div className="flex flex-col">
                <StaffTableActions setData={setData} />
                <div className="mt-5">
                    <DataTable
                        columns={clrColumns}
                        data={data}
                        pageSize={pageSize}
                        currentPage={page}
                        totalRows={totalRows}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default CLRView;
