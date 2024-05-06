"use client";

import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function formatString(input: string) {
    const parts = input.split("-");

    const formattedParts = parts.map((part) => capitalizeFirstLetter(part));

    const formattedString = formattedParts.join(" ");

    return formattedString;
}

const Navbar = () => {
    const pathname = usePathname();
    const currentPath = pathname.split("/").pop() as string;
    const [isClient, setIsClient] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="flex justify-between items-center py-3 mb-8">
            <div className="text-4xl font-bold mt-4">
                {pathname === "/" ? "Dashboard" : formatString(currentPath)}
            </div>
            <div className="bg-[#11047A] rounded-full flex items-center p-4 cursor-pointer text-white">
                {isClient ? userData?.username : "User"}
            </div>
        </div>
    );
};

export default Navbar;
