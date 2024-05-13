"use client";

import Link from "next/link";
import { menuItemsType } from "./Sidebar";
import { usePathname } from "next/navigation";

const MenuLink = ({
    item,
    setShowSidebar,
}: {
    item: menuItemsType;
    setShowSidebar?: (arg: boolean) => void;
}) => {
    const pathname = usePathname();

    return (
        <Link
            href={item.path}
            className={`p-5 flex items-center gap-2 hover:bg-[#f4f7fe] rounded-md ${
                pathname === item.path && "bg-[#f4f7fe]"
            } `}
            onClick={() =>
                setShowSidebar && setShowSidebar((prevValue) => !prevValue)
            }
        >
            <div className={`${pathname === item.path && "text-[#422AFB]"}`}>
                {item.icon}
            </div>
            <div className="w-full">{item.title}</div>
            {pathname === item.path && (
                <div className="w-1 h-9 bg-[#422AFB] rounded-sm"></div>
            )}
        </Link>
    );
};

export default MenuLink;
