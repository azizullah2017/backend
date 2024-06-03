"use client";

import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrackerDetails from "./TrackerDetails";
import TrackerList from "./TrackerList";
import TrackerActions from "./TrackerActions";
import Spinner from "@/components/ui/Spinner";
import { toast } from "@/components/ui/use-toast";
import useLogout from "@/hooks/Logout";

const Tracker = ({
    searchParams,
}: {
    searchParams: {
        bl: string;
    };
}) => {
    const [trackerId, setTrackerId] = useState("");
    const [data, setData] = useState<Object | string>({});
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useAuth();
    const router = useRouter();
    const logout = useLogout();

    const bl = searchParams.bl !== undefined ? searchParams.bl : "";

    useEffect(() => {
        if (Object.keys(data).length !== 0) {
            console.log(data, "data");
        }
    }, [data]);

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
                    if (res.status === 401) return logout();
                    if (res.status === 404) {
                        setData("");
                    } else {
                        toast({
                            title: "Alert",
                            description: "Something went wrong!",
                            className: "bg-red-200 border-none",
                        });
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
            setIsLoading(true);
            const res = await fetch(
                `${BASE_URL}/api/track?search=${trackerId}&company_name=${userData?.companyName}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 401) return logout();
                if (res.status === 404) {
                    setData("");
                } else {
                    toast({
                        title: "Alert",
                        description: "Something went wrong!",
                        className: "bg-red-200 border-none",
                    });
                }
            } else {
                const { track } = await res.json();

                setData(track);
            }
            setIsLoading(false);
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
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            ) : Object.keys(data).length !== 0 ? (
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
