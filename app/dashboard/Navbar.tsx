"use client";

import { usePathname } from "next/navigation";

function formatString(input: string) {
    const parts = input.split("-");

    const formattedParts = parts.map(
        (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );

    const formattedString = formattedParts.join(" ");

    return formattedString;
}

const Navbar = () => {
    const pathname = usePathname();
    const currentPath = pathname.split("/").pop() as string;

    return (
        <div className="flex justify-between items-center py-3 mb-8">
            <div className="text-4xl font-bold mt-4">
                {formatString(currentPath)}
            </div>
            <div className="bg-[#11047A] rounded-full flex items-center p-4 cursor-pointer text-white">
                Irfan
            </div>
        </div>
    );
};

export default Navbar;
