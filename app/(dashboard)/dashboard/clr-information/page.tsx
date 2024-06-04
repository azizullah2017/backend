"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CLRForm from "./CLRForm";
import { DataTable } from "@/components/ui/data-tables";
import { clrColumns } from "./columns";
import StaffTableActions from "@/components/StaffTableActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL, TABLE_ROW_SIZE } from "@/lib/constants";
import DeleteAlert from "../_components/DeleteAlert";
import { toast } from "@/components/ui/use-toast";
import useLogout from "@/hooks/Logout";
import Spinner from "@/components/ui/Spinner";

const CLRInformation = ({
    searchParams,
}: {
    searchParams: { page: string; search?: string };
}) => {
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [clr, setClr] = useState({});
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [revalidate, setRevalidate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = TABLE_ROW_SIZE;
    const router = useRouter();
    const { userData, isAuthenticated } = useAuth();
    const logout = useLogout(true);

    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "staff" || userData?.role === "admin");

    const onEdit = useCallback((data) => {
        setClr(data);
        setIsShowing(true);
    }, []);

    const onDelete = useCallback((data) => {
        setClr(data);
        setDialogIsOpen(true);
    }, []);

    const columns = useMemo(() => clrColumns({ onEdit, onDelete }), []);

    const deleteRow = async () => {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/api/clr/update/${clr.uid}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${userData.token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            if (res.status === 401) return logout();
            toast({
                title: "Alert",
                description: "Something went wrong!",
                className: "bg-red-200 border-none",
            });
        } else {
            toast({
                title: "Success",
                description: "Deleted Successfully!",
                className: "bg-red-200",
            });
            setRevalidate(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isAuthorized) return router.push(`/dashboard/client-view`);
    }, []);

    useEffect(() => {
        if (page || revalidate || searchQuery) {
            let queryString = "";
            if (searchQuery !== "") {
                queryString = `search=${searchQuery}&page=${page}&limit=${pageSize}`;
            } else {
                queryString = `page=${page}&limit=${pageSize}`;
            }
            const fetchData = async () => {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/api/clr?${queryString}`, {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) return logout();
                    toast({
                        title: "Alert",
                        description: "Something went wrong!",
                        className: "bg-red-200 border-none",
                    });
                } else {
                    const tableData = await res.json();

                    setData(tableData.clrs);
                    setTotalRows(tableData.total_count);
                    setRevalidate(false);
                }
                setIsLoading(false);
            };

            fetchData();
        }
    }, [page, revalidate, searchQuery]);

    return (
        <>
            {isAuthenticated === null || !isAuthenticated ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner width="w-10" height="h-10" />
                </div>
            ) : (
                <div className="flex flex-col">
                    <StaffTableActions
                        setIsShowing={setIsShowing}
                        setData={setData}
                    />
                    <div className="z-10">
                        <CLRForm
                            isShowing={isShowing}
                            setIsShowing={setIsShowing}
                            clr={clr}
                            setClr={setClr}
                            setRevalidate={setRevalidate}
                        />
                    </div>
                    <div className="mt-5">
                        <DataTable
                            columns={columns}
                            data={data}
                            pageSize={pageSize}
                            currentPage={page}
                            totalRows={totalRows}
                            isLoading={isLoading}
                        />
                    </div>
                    <DeleteAlert
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                        deleteRow={deleteRow}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </>
    );
};

export default CLRInformation;
