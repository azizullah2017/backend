"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CityViseTrackerForm from "./CityViseTrackerForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StaffTableActions from "@/components/StaffTableActions";
import { BASE_URL } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { truckDetailColumns } from "./truckDetailColumns";
import DeleteAlert from "../_components/DeleteAlert";

const CityViseTracker = ({
    searchParams,
}: {
    searchParams: { page: string; search: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [revalidate, setRevalidate] = useState(false);
    const [tracker, setTracker] = useState({});
    const [cityDialog, setCityDialog] = useState(false);
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const { userData } = useAuth();
    const router = useRouter();
    const isAuthenticated = userData?.role !== "";
    const isAuthorized =
        userData?.role !== "" &&
        (userData?.role === "staff" || userData?.role === "admin");
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = 10;

    const onEdit = useCallback((data) => {
        setTracker(data);
        setCityDialog(true);
    }, []);

    const onDelete = useCallback((data) => {
        setTracker(data);
        setDeleteDialogIsOpen(true);
    }, []);

    const detailColumns = useMemo(
        () => truckDetailColumns({ onEdit, onDelete }),
        []
    );

    const deleteRow = async () => {
        const res = await fetch(
            `${BASE_URL}/api/tracker/update/${tracker?.uid}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${userData.token}`,
                    "Content-Type": "application/json",
                },
            }
        );

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
                const res = await fetch(
                    `${BASE_URL}/api/tracker?${queryString}`,
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
    }, [page, revalidate, searchQuery]);

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
                        revalidate={revalidate}
                        cityDialog={cityDialog}
                        setCityDialog={setCityDialog}
                        truckDetailsColumn={detailColumns}
                        tracker={tracker}
                        setTracker={setTracker}
                    />
                </div>
            </div>
            <div className="mt-5 mb-5">
                <DataTable
                    columns={columns}
                    data={data}
                    pageSize={pageSize}
                    currentPage={page}
                    totalRows={totalRows}
                />
            </div>
            <DeleteAlert
                dialogIsOpen={deleteDialogIsOpen}
                setDialogIsOpen={setDeleteDialogIsOpen}
                deleteRow={deleteRow}
            />
        </>
    );
};

export default CityViseTracker;
