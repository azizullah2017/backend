"use client";

import SideBar from "./dashboard/Sidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import Navbar from "./dashboard/Navbar";
import { useState } from "react";
import useGetWindowWidth from "@/hooks/GetWindowSize";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const windowWidth = useGetWindowWidth();
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex">
            {isAuthenticated === null || !isAuthenticated ? null : (
                <>
                    {windowWidth >= 1024 ? (
                        <SideBar />
                    ) : (
                        <MobileSidebar
                            showSidebar={showSidebar}
                            setShowSidebar={setShowSidebar}
                        />
                    )}
                </>
            )}

            <div className="w-full p-5 static bg-[#f6f8fb] h-screen overflow-auto">
                {isAuthenticated === null || !isAuthenticated ? null : (
                    <Navbar setShowSidebar={setShowSidebar} />
                )}
                <main
                    className={`${
                        isAuthenticated === null || !isAuthenticated
                            ? "h-full"
                            : ""
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
