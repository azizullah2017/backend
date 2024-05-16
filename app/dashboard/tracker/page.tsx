"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-tables";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { locationColumns } from "./LocationColumns";

const Tracker = ({
    searchParams,
}: {
    searchParams: {
        bl: string;
    };
}) => {
    const [trackerId, setTrackerId] = useState("");
    const [data, setData] = useState<Object | string>({});
    const { userData } = useAuth();
    const router = useRouter();

    const isAuthenticated = userData?.role !== "";
    const bl = searchParams.bl !== undefined ? searchParams.bl : "";

    useEffect(() => {
        if (Object.keys(data).length !== 0) {
            console.log(data, "data");
        }
    }, [data]);

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
    }, []);

    useEffect(() => {
        if (bl !== "") {
            const fetchData = async () => {
                const res = await fetch(`${BASE_URL}/api/track?search=${bl}`, {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        setData("");
                    } else {
                        throw new Error("Something went wrong");
                    }
                } else {
                    const { track } = await res.json();

                    setData(track);
                }
            };

            fetchData();
        }
    }, [bl]);

    const onSubmit = () => {
        const fetchData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/track?search=${trackerId}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 404) {
                    setData("");
                } else {
                    throw new Error("Something went wrong");
                }
            } else {
                const { track } = await res.json();

                setData(track);
            }
        };

        fetchData();
    };

    return (
        <>
            <div className="flex justify-end gap-3 mb-4">
                <Input
                    onChange={(e) => setTrackerId(e.target.value)}
                    value={trackerId}
                    className="w-[400px]"
                    placeholder="Tracking ID..."
                />
                <Button
                    type="button"
                    onClick={onSubmit}
                    className="w-[100px] bg-[#4b99b7] hover:bg-[#58A7C6] border-2 border-[#367c97] shadow-lg"
                >
                    Track
                </Button>
            </div>
            {Object.keys(data).length !== 0 ? (
                <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex flex-col gap-3 w-[500px]">
                        <p>
                            <span className="font-semibold">BL: </span>
                            {data.bl}
                        </p>
                        <p>
                            <span className="font-semibold">Book No.: </span>
                            {data.book_no}
                        </p>
                        <p>
                            <span className="font-semibold">Consignee: </span>
                            {data.consignee}
                        </p>
                        <p>
                            <span className="font-semibold">Docs: </span>
                            {data.docs}
                        </p>
                        <p>
                            <span className="font-semibold">FPOD: </span>
                            {data.final_port_of_destination}
                        </p>
                        <p>
                            <span className="font-semibold">
                                No. of Containers:{" "}
                            </span>
                            {data.no_container}
                        </p>
                        <p>
                            <span className="font-semibold">POD: </span>
                            {data.port_of_departure}
                        </p>
                        <p>
                            <span className="font-semibold">POL: </span>
                            {data.port_of_loading}
                        </p>
                        <p>
                            <span className="font-semibold">Product: </span>
                            {data.product}
                        </p>
                        <p>
                            <span className="font-semibold">Shipper: </span>
                            {data.shipper}
                        </p>
                        <p>
                            <span className="font-semibold">Surrender: </span>
                            {data.surrender}
                        </p>
                        <p>
                            <span className="font-semibold">Vessel : </span>
                            {data.vessel}
                        </p>
                    </div>
                    {data.containers.map((con, index) => {
                        return (
                            <div className="flex flex-col w-full" key={index}>
                                <div className="flex gap-5 mb-2">
                                    <div>
                                        <h2 className="font-semibold">
                                            Truck No.
                                        </h2>
                                        <p>{con.truck_no}</p>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">
                                            Containers
                                        </h2>
                                        <p>
                                            {con.bl_containers
                                                .split(",")
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <Card className="w-full lg:mb-5 shadow-md last:mb-5">
                                    <CardContent className="p-5 flex flex-col gap-5">
                                        <div className="h-full">
                                            <DataTable
                                                data={con.location}
                                                columns={locationColumns}
                                                pagination={false}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                data === "" && (
                    <p className="text-2xl">
                        No data for the given tracker id found!
                    </p>
                )
            )}
        </>
    );
};

export default Tracker;
