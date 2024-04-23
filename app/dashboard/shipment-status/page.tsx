"use client";

import { Button } from "@/components/ui/button";
import ShipmentStatusForm from "./ShipmentStatusForm";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";

const data = [
    {
        bookingNo: "123",
        bl: "MOI FOODS",
        vol: "Silver Globe",
        etaAr: "6",
        etaDe: "Coconut Oil",
        port: "PGU",
        docs: "KHI",
        surrender: "TASH",
        containers: ["test", "test2", "test3"],
        status: "pending",
    },
];

const ShipmentStatus = () => {
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
                    <ShipmentStatusForm
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

export default ShipmentStatus;
