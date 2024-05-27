"use client";

import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrackerDetails from "./TrackerDetails";
import TrackerList from "./TrackerList";
import TrackerActions from "./TrackerActions";

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
                const res = await fetch(
                    `${BASE_URL}/api/track?search=${bl}&company_name=${userData?.companyName}`,
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
        }
    }, [bl]);

    const onSubmit = () => {
        const fetchData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/track?search=${trackerId}&company_name=${userData?.companyName}`,
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
            <TrackerActions
                trackerId={trackerId}
                setTrackerId={setTrackerId}
                onSubmit={onSubmit}
            />
            {Object.keys(data).length !== 0 ? (
                <div className="flex flex-col justify-center gap-5">
                    <TrackerDetails data={data} />
                    <TrackerList containers={data.containers} />
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
