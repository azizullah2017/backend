"use client";

import SideBar from "./dashboard/Sidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import Navbar from "./dashboard/Navbar";
import { useEffect, useState } from "react";
import useGetWindowWidth from "@/hooks/GetWindowSize";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const windowWidth = useGetWindowWidth();

    return (
        <div className="flex">
            {windowWidth >= 1024 ? (
                <SideBar />
            ) : (
                <MobileSidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
            )}
            <div className="w-full p-5 static bg-[#f6f8fb] h-screen overflow-auto">
                <Navbar setShowSidebar={setShowSidebar} />
                <main>{children}</main>
            </div>
        </div>
    );
};

export default Layout;
