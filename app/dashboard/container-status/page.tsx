"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ContainerPortStatusForm from "./ContainerPortStatusForm";
import { DataTable } from "@/components/ui/data-tables";
import { containerPortColumns } from "./columns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StaffTableActions from "@/components/StaffTableActions";
import { BASE_URL } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import DeleteAlert from "../_components/DeleteAlert";

const ContainerStatus = ({
    searchParams,
}: {
    searchParams: { page: string; search: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [port, setPort] = useState({});
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [revalidate, setRevalidate] = useState(false);
    const router = useRouter();
    const { userData } = useAuth();
    const isAuthenticated = userData?.role !== "";
    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "staff" || userData?.role === "admin");
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = 10;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onEdit = useCallback((data) => {
        setPort(data);
        setIsShowing(true);
    }, []);

    const onDelete = useCallback((data) => {
        setPort(data);
        setDialogIsOpen(true);
    }, []);

    const columns = useMemo(
        () => containerPortColumns({ onEdit, onDelete }),
        []
    );

    const deleteRow = async () => {
        const res = await fetch(`${BASE_URL}/api/port/update/${port?.uid}`, {
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
        if (!isAuthorized) return router.push(`/dashboard/${userData?.role}`);
    }, []);

    useEffect(() => {
        if (page || revalidate || searchQuery) {
            const fetchData = async () => {
                let queryString = "";
                if (searchQuery !== "") {
                    queryString = `search=${searchQuery}&page=${page}&limit=${pageSize}`;
                } else {
                    queryString = `page=${page}&limit=${pageSize}`;
                }
                const res = await fetch(`${BASE_URL}/api/port?${queryString}`, {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Something went wrong");
                } else {
                    const tableData = await res.json();

                    setData(tableData.ports);
                    setTotalRows(tableData.total_count);
                    setRevalidate(false);
                }
            };

            fetchData();
        }
    }, [page, revalidate, searchParams]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
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
                        port={port}
                        setPort={setPort}
                        setRevalidate={setRevalidate}
                    />
                </div>
            </div>
            <div
                className={`mt-5 w-full ${
                    windowWidth >= 1024 && windowWidth <= 1536 && "w-[1156px]"
                }`}
            >
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
        </>
    );
};

export default ContainerStatus;
