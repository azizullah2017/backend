"use client";

import BarChart from "../BarChart";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/constants";
import Filter from "../Filter";
import { useAuth } from "@/context/AuthContext";
import LineChart from "../LineChart";
import useGetWindowWidth from "@/hooks/GetWindowSize";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useLogout from "@/hooks/Logout";

export default function Home() {
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [filter, setFilter] = useState("monthly");
    const { userData } = useAuth();
    const router = useRouter();
    const logout = useLogout(true);

    const isAuthenticated = userData?.role !== "";

    useEffect(() => {
        const fetchBarChartData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/chart?get=eachstatus&filter=${filter}&company_name=${userData?.companyName}`,
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
                const {
                    clrmodel,
                    shipmentstatus,
                    portstatus,
                    citywisetracker,
                } = await res.json();

                const updatedData = [
                    {
                        module: "clr",
                        pending: clrmodel[0],
                        inprogress: clrmodel[1],
                        done: clrmodel[2],
                    },
                    {
                        module: "shipment",
                        pending: shipmentstatus[0],
                        inprogress: shipmentstatus[1],
                        done: shipmentstatus[2],
                    },
                    {
                        module: "port",
                        pending: portstatus[0],
                        inprogress: portstatus[1],
                        done: portstatus[2],
                    },
                    {
                        module: "tracker",
                        pending: citywisetracker[0],
                        inprogress: citywisetracker[1],
                        done: citywisetracker[2],
                    },
                ];

                setBarData(updatedData);
            }
        };

        const fetchLineData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/chart?get=month&filter=${filter}&company_name=${userData?.companyName}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 401) return;
                toast({
                    title: "Alert",
                    description: "Something went wrong!",
                    className: "bg-red-200 border-none",
                });
            } else {
                const { monthly } = await res.json();

                const monthlyData = monthly.map((d) => ({
                    x: d.month,
                    y: d.count,
                }));

                const updatedData = {
                    id: "Counts",
                    color: "hsl(293, 70%, 50%)",
                    data: monthlyData,
                };

                setLineData([updatedData]);
            }
        };

        fetchBarChartData();
        fetchLineData();
    }, [filter]);

    useEffect(() => {
        if (!isAuthenticated) return router.push("/login");
    }, []);

    return (
        <>
            {isAuthenticated && (
                <div className="w-full p-5">
                    <Filter setFilter={setFilter} />
                    <div className="grid lg:grid-cols-2 gap-2 mt-2">
                        <BarChart
                            title="Pending Status Counts"
                            legendBottom=""
                            legendLeft=""
                            indexBy="module"
                            labelTextColor="#fff"
                            data={barData}
                            keys={["pending"]}
                            colors={["#DC2626"]}
                        />
                        <BarChart
                            title="Inprogress Status Counts"
                            legendBottom=""
                            legendLeft=""
                            indexBy="module"
                            labelTextColor="#fff"
                            data={barData}
                            keys={["inprogress"]}
                            colors={["#2563EB"]}
                        />
                        <BarChart
                            title="Done Status Counts"
                            legendBottom=""
                            legendLeft=""
                            indexBy="module"
                            labelTextColor="#fff"
                            data={barData}
                            keys={["done"]}
                            colors={["#16A34A"]}
                        />
                        <LineChart data={lineData} />
                    </div>
                </div>
            )}
        </>
    );
}
