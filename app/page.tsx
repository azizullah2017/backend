"use client";

import Navbar from "./dashboard/Navbar";
import SideBar from "./dashboard/Sidebar";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/constants";
import Filter from "./Filter";
import { useAuth } from "@/context/AuthContext";
import LineChart from "./LineChart";
import MobileSidebar from "./dashboard/MobileSidebar";

export default function Home() {
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [filter, setFilter] = useState("monthly");
    const [showSidebar, setShowSidebar] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchBarChartData = async () => {
            const res = await fetch(
                `${BASE_URL}/api/chart?get=eachstatus&filter=${filter}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
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
                `${BASE_URL}/api/chart?get=month&filter=${filter}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
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

    return (
        <div className="flex">
            <div className="hidden lg:flex w-[400px] max-w-[400px] bg-white p-5">
                <SideBar />
            </div>
            <div className="lg:hidden">
                <MobileSidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
            </div>
            <div className="w-full p-5">
                <Navbar setShowSidebar={setShowSidebar} />
                <Filter setFilter={setFilter} />
                <div className="grid lg:grid-cols-2 gap-2 mt-2">
                    <BarChart
                        title="Status"
                        legendBottom=""
                        legendLeft=""
                        indexBy="module"
                        labelTextColor="#fff"
                        data={barData}
                    />
                    <LineChart data={lineData} />
                </div>
            </div>
        </div>
    );
}
