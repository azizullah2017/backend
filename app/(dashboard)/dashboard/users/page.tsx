"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-tables";
import { userColumns } from "./columns";
import StaffTableActions from "@/components/StaffTableActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL, TABLE_ROW_SIZE } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import DeleteAlert from "../_components/DeleteAlert";
import RegisterForm from "../_components/RegisterForm";
import FormTransition from "../_components/FormTransition";
import useLogout from "@/hooks/Logout";

const Users = ({
    searchParams,
}: {
    searchParams: { page: string; search?: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [user, setUser] = useState({});
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [revalidate, setRevalidate] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formReset, setFormReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const page = parseInt(searchParams.page) || 1;
    const searchQuery =
        searchParams.search !== undefined ? searchParams.search : "";
    const pageSize = TABLE_ROW_SIZE;
    const router = useRouter();
    const { userData } = useAuth();
    const logout = useLogout(true);

    const isAuthorized = userData?.role !== "" && userData?.role === "admin";

    const onEdit = useCallback((data) => {
        setEditing(true);
        setIsShowing(true);
        setUser(data);
    }, []);

    const onDelete = useCallback((data) => {
        setUser(data);
        setDialogIsOpen(true);
    }, []);

    const columns = useMemo(() => userColumns({ onEdit, onDelete }), []);

    const deleteRow = async () => {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/api/auth/update/${user?.uid}`, {
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
        if (!isAuthorized) {
            if (userData?.role === "staff")
                return router.push("/dashboard/clr-information");
            if (userData?.role === "customer")
                return router.push("/dashboard/client-view");
        }
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
                const res = await fetch(
                    `${BASE_URL}/api/users?${queryString}`,
                    {
                        headers: {
                            Authorization: `Token ${userData.token}`,
                        },
                    }
                );

                if (!res.ok) {
                    if (res.status === 401) return logout();
                    toast({
                        title: "Alert",
                        description: "Something went wrong!",
                        className: "bg-red-200 border-none",
                    });
                } else {
                    const tableData = await res.json();

                    setData(tableData.users);
                    setTotalRows(tableData.total_count);
                }
                setRevalidate(false);
                setIsLoading(false);
            };

            fetchData();
        }
    }, [page, revalidate, searchQuery]);

    useEffect(() => {
        if (!isShowing && editing) {
            setUser({});
            setEditing(false);
            setFormReset(true);
        }
    }, [isShowing]);

    return (
        <>
            <div className="flex flex-col">
                <StaffTableActions
                    setData={setData}
                    setIsShowing={setIsShowing}
                />
                <div className="z-10">
                    <FormTransition
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    >
                        <RegisterForm
                            user={
                                editing
                                    ? user
                                    : {
                                          username: "",
                                          email: "",
                                          role: "",
                                          mobile_no: "",
                                          company_name: "",
                                      }
                            }
                            editing={editing}
                            setFormReset={setFormReset}
                            formReset={formReset}
                            setIsShowing={setIsShowing}
                            setRevalidate={setRevalidate}
                        />
                    </FormTransition>
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
            </div>
            <DeleteAlert
                dialogIsOpen={dialogIsOpen}
                setDialogIsOpen={setDialogIsOpen}
                deleteRow={deleteRow}
                isLoading={isLoading}
            />
        </>
    );
};

export default Users;
