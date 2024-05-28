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
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = TABLE_ROW_SIZE;
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData?.role !== "";
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
        const res = await fetch(`${BASE_URL}/api/clr/update/${clr.uid}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${userData.token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            toast({
                title: "Success",
                description: "Deleted Successfully!",
                className: "bg-red-200",
            });
            setRevalidate(true);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
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
                const res = await fetch(`${BASE_URL}/api/clr?${queryString}`, {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Something went wrong");
                } else {
                    const tableData = await res.json();

                    setData(tableData.clrs);
                    setTotalRows(tableData.total_count);
                    setRevalidate(false);
                }
            };

            fetchData();
        }
    }, [page, revalidate, searchQuery]);

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
                    />
                </div>
                <DeleteAlert
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    deleteRow={deleteRow}
                />
            </div>
        </>
    );
};

export default CLRInformation;
