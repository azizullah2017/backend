"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import CLRForm from "./CLRForm";
import { DataTable } from "@/components/ui/data-tables";
import { columns } from "./columns";
import Pagination from "@/components/Pagination";

const data = [
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

const CLRInformation = ({
    searchParams,
}: {
    searchParams: { page: string };
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 1;

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
                <DataTable columns={columns} data={data} />
                <Pagination
                    itemCount={data.length}
                    pageSize={pageSize}
                    currentPage={page}
                />
            </div>
        </>
    );
};

export default CLRInformation;
