"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import CLRForm from "./CLRForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";

const payments = [
    {
        bookingNo: "123",
        shipper: "MOI FOODS",
        consignee: "Silver Globe",
        count: "6",
        product: "Coconut Oil",
        pol: "PGU",
        pod: "KHI",
        fpod: "TASH",
        vessel: "test",
        etaKarachi: "11-04-2024",
        status: "pending",
    },
];

const CLRInformation = () => {
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
                    <CLRForm
                        isShowing={isShowing}
                        setIsShowing={setIsShowing}
                    />
                </div>
            </div>
            <div className="mt-10">
                <DataTable columns={columns} data={payments} />
            </div>
        </>
    );
};

export default CLRInformation;
