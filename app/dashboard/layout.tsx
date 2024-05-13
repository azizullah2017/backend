"use client";

import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false);

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
                {children}
            </div>
        </div>
    );
};

export default Layout;
