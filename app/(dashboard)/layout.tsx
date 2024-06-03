"use client";

import SideBar from "./dashboard/Sidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import Navbar from "./dashboard/Navbar";
import { useEffect, useState } from "react";
import useGetWindowWidth from "@/hooks/GetWindowSize";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const windowWidth = useGetWindowWidth();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner width="w-10" height="h-10" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

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
