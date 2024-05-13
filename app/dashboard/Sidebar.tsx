"use client";

import { IconType } from "react-icons";
import { GiDigitalTrace, GiProgression } from "react-icons/gi";
import { HiInformationCircle } from "react-icons/hi";
import { ImHome } from "react-icons/im";
import MenuLink from "./MenuLink";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { IoLogOut } from "react-icons/io5";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

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
        title: "Client View",
        path: "/dashboard/client-view",
        icon: <GiDigitalTrace className="w-5 h-5" />,
        role: ["customer", "admin"],
    },
];

const SideBar = () => {
    const { userData, setUserData } = useAuth();
    const router = useRouter();

    const logout = async () => {
        const res = await fetch(`${BASE_URL}/api/auth/logout/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${userData?.token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            setUserData({ token: "", username: "", role: "" });
            router.push("/login");
        }
    };

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

                <div
                    className="flex items-center w-full p-5 gap-1 cursor-pointer hover:text-gray-700"
                    onClick={logout}
                >
                    <IoLogOut className="w-7 h-7" />
                    Logout
                </div>
            </ul>
        </div>
    );
};

export default SideBar;
