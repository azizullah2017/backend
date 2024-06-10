"use client";

import TableFilter from "@/components/TableFilter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import Spinner from "./ui/Spinner";
import Link from "next/link";
import useLogout from "@/hooks/Logout";

const StaffTableActions = ({
    setIsShowing,
    setData,
    exportButton = false,
}: {
    setIsShowing?: () => void;
    setData: () => void;
    exportButton?: boolean;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useAuth();
    const logout = useLogout(true);

    const exportData = async () => {
        setIsLoading(true);

        const res = await fetch(
            `${BASE_URL}/api/client?export=data&company_name=${userData?.companyName}`,
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
            const blob = await res.blob();
            const objectURL = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = objectURL;
            link.download = "Tracker Info";

            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(objectURL);
            document.body.removeChild(link);

            toast({
                title: "Success",
                className: "bg-green-200",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="flex justify-between w-full">
            <TableFilter setData={setData} />
            {setIsShowing && (
                <Button
                    className="bg-[#4b99b7] hover:bg-[#58A7C6]"
                    onClick={() => setIsShowing((isShowing) => !isShowing)}
                >
                    Add Record
                </Button>
            )}
            {exportButton && (
                <Button
                    className="bg-[#4b99b7] hover:bg-[#58A7C6] w-24"
                    onClick={exportData}
                    disabled={isLoading ? true : false}
                >
                    {isLoading ? <Spinner /> : "Export"}
                </Button>
            )}
        </div>
    );
};

export default StaffTableActions;
