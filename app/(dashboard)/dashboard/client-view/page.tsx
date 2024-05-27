"use client";

import StaffTableActions from "@/components/StaffTableActions";
import { DataTable } from "@/components/ui/data-tables";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { VisibilityState } from "@tanstack/react-table";
import useGetWindowWidth from "@/hooks/GetWindowSize";

const ClientView = ({
    searchParams,
}: {
    searchParams: { page: string; search?: string };
}) => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = 10;
    const router = useRouter();
    const { userData } = useAuth();
    const windowWidth = useGetWindowWidth();
    const isAuthenticated = userData?.role !== "";

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            let queryString = "";
            if (searchQuery !== "") {
                queryString = `search=${searchQuery}&page=${page}&limit=${pageSize}`;
            } else {
                queryString = `page=${page}&limit=${pageSize}`;
            }
            const res = await fetch(
                `${BASE_URL}/api/client?${queryString}&company_name=${userData?.companyName}`,
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
    }, [page, searchQuery]);

    useEffect(() => {
        if (windowWidth < 768) {
            setColumnVisibility(() => ({
                shipper: false,
                shipper_reference: false,
                containers: false,
                port_of_loading: false,
                port_of_departure: false,
                final_port_of_destination: false,
                docs: false,
                no_container: false,
                surrender: false,
                etd: false,
                eta_karachi: false,
            }));
        } else {
            setColumnVisibility(() => ({
                shipper: true,
                shipper_reference: true,
                containers: true,
                port_of_loading: true,
                port_of_departure: true,
                final_port_of_destination: true,
                docs: true,
                no_container: true,
                surrender: true,
                etd: true,
                eta_karachi: true,
            }));
        }
    }, [windowWidth]);

    return (
        <>
            {isAuthenticated && (
                <div className="flex flex-col">
                    <StaffTableActions setData={setData} />
                    <div className="mt-5">
                        <DataTable
                            columns={columns}
                            data={data}
                            pageSize={pageSize}
                            currentPage={page}
                            totalRows={totalRows}
                            columnVisibility={columnVisibility}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientView;
