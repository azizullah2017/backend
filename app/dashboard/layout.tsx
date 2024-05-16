"use client";

import Navbar from "./Navbar";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import SideBar from "./Sidebar";
import useGetWindowWidth from "@/hooks/GetWindowSize";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const windowWidth = useGetWindowWidth();

    return (
        <div className="flex">
            {windowWidth >= 1024 ? (
                <div className="flex w-[400px] max-w-[400px] bg-white p-5">
                    <SideBar />
                </div>
            ) : (
                <MobileSidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
            )}
            <div className="w-full p-5 static bg-[#f6f8fb] h-screen overflow-auto">
                <Navbar setShowSidebar={setShowSidebar} />
                {children}
            </div>
        </div>
    );
};

export default Layout;
