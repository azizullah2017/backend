"use client";

import { IconType } from "react-icons";
import { GiDigitalTrace, GiProgression } from "react-icons/gi";
import { HiInformationCircle } from "react-icons/hi";
import { ImHome } from "react-icons/im";
import { RiShipFill } from "react-icons/ri";
import { FaCity, FaTruck, FaUser } from "react-icons/fa";
import MenuLink from "./MenuLink";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { IoLogOut } from "react-icons/io5";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { CgTrack } from "react-icons/cg";
import {
    TbChevronCompactRight,
    TbCircleChevronLeft,
    TbCircleChevronRight,
} from "react-icons/tb";
import { useState } from "react";

export type menuItemsType = {
    title: string;
    path: string;
    icon: React.ReactElement;
    role: string[];
};

export const menuItems: menuItemsType[] = [
    {
        title: "Dashboard",
        path: "/",
        icon: <ImHome className="w-5 h-5" />,
        role: ["admin", "staff", "customer"],
    },
    {
        title: "Users",
        path: "/dashboard/users",
        icon: <FaUser className="w-5 h-5" />,
        role: ["admin"],
    },
    {
        title: "CLR Information",
        path: "/dashboard/clr-information",
        icon: <HiInformationCircle className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "CLR View",
        path: "/dashboard/clr-view",
        icon: <HiInformationCircle className="w-5 h-5" />,
        role: ["admin", "customer"],
    },
    {
        title: "Shipment Status",
        path: "/dashboard/shipment-status",
        icon: <RiShipFill className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "Container Port Status",
        path: "/dashboard/container-status",
        icon: <FaTruck className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "City Vise Tracker",
        path: "/dashboard/city-vise-tracker",
        icon: <FaCity className="w-5 h-5" />,
        role: ["staff", "admin"],
    },
    {
        title: "Client View",
        path: "/dashboard/client-view",
        icon: <GiDigitalTrace className="w-5 h-5" />,
        role: ["customer", "admin", "customer"],
    },
    {
        title: "Tracker",
        path: "/dashboard/tracker",
        icon: <CgTrack className="w-5 h-5" />,
        role: ["customer", "admin", "staff"],
    },
];

const SideBar = () => {
    const [expanded, setExpanded] = useState(true);
    const { userData, setUserData } = useAuth();
    const router = useRouter();

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm overflow-auto">
                <div className="p-4 pb-2 flex justify-center items-center">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={250}
                        height={250}
                        className={`overflow-hidden transition-all ${
                            expanded ? "w-[250px]" : "w-0 h-0"
                        }`}
                    />
                    {expanded ? (
                        <TbCircleChevronLeft
                            className="w-7 h-7 transition-transform ease-out transform hover:scale-125 duration-300"
                            onClick={() =>
                                setExpanded((prevValue) => !prevValue)
                            }
                        />
                    ) : (
                        <TbCircleChevronRight
                            className="w-7 h-7 transition-transform ease-out transform hover:scale-125 duration-300"
                            onClick={() =>
                                setExpanded((prevValue) => !prevValue)
                            }
                        />
                    )}
                </div>
                <hr />
                <ul className="list-none mt-2 flex-1 px-3">
                    {menuItems
                        .filter((item) => item.role.includes(userData?.role))
                        .map((item) => (
                            <li key={item.title} className="mt-2">
                                {
                                    <MenuLink
                                        item={item}
                                        key={item.title}
                                        expanded={expanded}
                                    />
                                }
                            </li>
                        ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SideBar;
