"use client";

import Link from "next/link";
import { menuItemsType } from "./Sidebar";
import { usePathname } from "next/navigation";
import useGetWindowWidth from "@/hooks/GetWindowSize";

const MenuLink = ({
    item,
    setShowSidebar,
    expanded = true,
}: {
    item: menuItemsType;
    setShowSidebar?: (arg: boolean) => void;
    expanded?: boolean;
}) => {
    const pathname = usePathname();
    const windowWidth = useGetWindowWidth();

    return (
        <Link
            href={item.path}
            className={`${
                expanded ? "p-5" : "p-4"
            } flex items-center gap-2 hover:bg-[#f4f7fe] rounded-md ${
                pathname === item.path && "bg-[#f4f7fe]"
            } `}
            onClick={() =>
                setShowSidebar && setShowSidebar((prevValue) => !prevValue)
            }
        >
            <div
                className={`${pathname === item.path && "text-[#422AFB]"} ${
                    !expanded && windowWidth >= 1024 && "w-full"
                }`}
            >
                {item.icon}
            </div>
            <div
                className={`w-full overflow-hidden transition-all duration-200 ${
                    expanded ? "w-full" : "hidden"
                }`}
            >
                {item.title}
            </div>
            {pathname === item.path && (
                <div className="w-1 h-9 bg-[#422AFB] rounded-sm"></div>
            )}
        </Link>
    );
};

export default MenuLink;
