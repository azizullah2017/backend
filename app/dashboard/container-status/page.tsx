"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContainerPortStatusForm from "./ContainerPortStatusForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";

const data = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        delivery: "Silver Globe",
        gdNo: "6",
        clearingAgent: "Coconut Oil",
        truckNo: "PGU",
        driver: "KHI",
        contactDetails: "TASH",
        containers: ["test", "test2", "test3"],
        transporter: "TASH",
        truckPlacement: "TASH",
        truckOut: "TASH",
        status: "pending",
    },
];

const ContainerStatus = () => {
    const [isShowing, setIsShowing] = useState(false);

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
                <div className="z-10">
                    <ContainerPortStatusForm
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

export default ContainerStatus;
