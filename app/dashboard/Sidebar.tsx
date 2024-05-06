"use client";

import { IconType } from "react-icons";
import { GiDigitalTrace, GiProgression } from "react-icons/gi";
import { HiInformationCircle } from "react-icons/hi";
import { ImHome } from "react-icons/im";
import MenuLink from "./MenuLink";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export type menuItemsType = {
    title: string;
    path: string;
    icon: React.ReactElement;
    role: string[];
};

const menuItems: menuItemsType[] = [
    {
        title: "Dashboard",
        path: "/",
        icon: <ImHome className="w-5 h-5" />,
        role: ["admin"],
    },
    {
        title: "CLR Information",
        path: "/dashboard/clr-information",
        icon: <HiInformationCircle className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "Shipment Status",
        path: "/dashboard/shipment-status",
        icon: <GiProgression className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "Container Port Status",
        path: "/dashboard/container-status",
        icon: <GiProgression className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "City Vise Tracker",
        path: "/dashboard/city-vise-tracker",
        icon: <GiDigitalTrace className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "Tracker",
        path: "/dashboard/tracker",
        icon: <GiDigitalTrace className="w-5 h-5" />,
        role: ["customer", "admin"],
    },
];

const SideBar = () => {
    const { userData } = useAuth();

    return (
        <div className="sticky">
            <div className="flex justify-center py-1">
                <Image src="/logo.jpg" alt="" width={250} height={250} />
            </div>
            <hr />
            <ul className="list-none mt-5">
                {menuItems
                    .filter((item) =>
                        item.role.map((role) => role === userData?.role)
                    )
                    .map((item) => (
                        <li key={item.title} className="mt-2">
                            {<MenuLink item={item} key={item.title} />}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default SideBar;
