"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import CityViseTrackerForm from "./CityViseTrackerForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const data = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        truckNo: "Silver Globe",
        driver: "6",
        contactDetails: "Coconut Oil",
        containers: ["PGU", "Test2", "Test3"],
        transporter: "KHI",
        delivery: "TASH",
        currentPosition: "test",
        eta: "11-04-2024",
        status: "pending",
    },
];

const CityViseTracker = () => {
    const [isShowing, setIsShowing] = useState(false);
    const { userData } = useAuth();
    const router = useRouter();

    if (userData.role === "") return router.push("/login");
    if (userData.role !== "" && userData.role !== "staff")
        return router.push(`/dashboard/${userData.role}`);

    return (
        <>
            <div className="flex">
                <div className="flex justify-end w-full">
                    <Button
                        className="bg-[#11047A] hover:bg-[#422AFB]"
                        onClick={() => setIsShowing((isShowing) => !isShowing)}
                    >
                        Add Record
                    </Button>
                </div>
                <div className="z-[9999]">
                    <CityViseTrackerForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
            </div>
            <div className="mt-10">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    );
};

export default CityViseTracker;
