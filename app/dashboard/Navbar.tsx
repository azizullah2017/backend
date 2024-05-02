"use client";

import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";

function formatString(input: string) {
    const parts = input.split("-");

    const formattedParts = parts.map((part) => capitalizeFirstLetter(part));

    const formattedString = formattedParts.join(" ");

    return formattedString;
}

const Navbar = () => {
    const pathname = usePathname();
    const currentPath = pathname.split("/").pop() as string;
    const { userData } = useAuth();

    return (
        <div className="flex justify-between items-center py-3 mb-8">
            <div className="text-4xl font-bold mt-4">
                {formatString(currentPath)}
            </div>
            <div className="bg-[#11047A] rounded-full flex items-center p-4 cursor-pointer text-white">
                {userData?.username}
            </div>
        </div>
    );
};

export default Navbar;
