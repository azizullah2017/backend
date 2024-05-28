"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoReorderFourOutline } from "react-icons/io5";
import FormTransition from "./_components/FormTransition";
import RegisterForm from "./_components/RegisterForm";
import { BASE_URL } from "@/lib/constants";

function formatString(input: string) {
    const parts = input.split("-");

    const formattedParts = parts.map((part) => capitalizeFirstLetter(part));

    const formattedString = formattedParts.join(" ");

    return formattedString;
}

const Navbar = ({
    setShowSidebar,
}: {
    setShowSidebar: (arg: boolean) => void;
}) => {
    const pathname = usePathname();
    const currentPath = pathname.split("/").pop() as string;
    const [isClient, setIsClient] = useState(false);
    const [isShowing, setIsShowing] = useState(false);
    const [editing, setEditing] = useState(false);
    const { userData, setUserData } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const data = {
        username: userData?.username,
        company_name: userData?.companyName,
        mobile_no: userData?.mobileNumber,
        role: userData?.role,
        email: userData?.email,
        uid: userData?.uid,
    };

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
            setUserData({ token: "" });
            router.push("/login");
        }
    };

    return (
        <>
            <div className="flex justify-between items-end lg:items-center py-3 mb-8">
                <div className="text-3xl lg:text-4xl font-bold mt-4">
                    <div className="lg:hidden mb-3">
                        <IoReorderFourOutline
                            className="w-7 h-7"
                            onClick={() =>
                                setShowSidebar((prevValue) => !prevValue)
                            }
                        />
                    </div>
                    {pathname === "/" ? "Dashboard" : formatString(currentPath)}
                </div>
                <div className="rounded-full flex items-center lg:pr-4 cursor-pointer font-semibold text-2xl text-[#58A7C6]">
                    {isClient ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="active:border-none">
                                <div className="flex items-center gap-1">
                                    {userData?.username}
                                    <ArrowDown className="w-5 h-5" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mr-10">
                                <DropdownMenuItem
                                    className="px-3 py-2"
                                    onClick={() => {
                                        setIsShowing(true);
                                        setEditing(true);
                                    }}
                                >
                                    Update Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="px-3 py-2"
                                    onClick={logout}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        "User"
                    )}
                </div>
            </div>
            <div className="z-10">
                <FormTransition
                    isShowing={isShowing}
                    setIsShowing={setIsShowing}
                >
                    <RegisterForm
                        user={data}
                        editing={editing}
                        setIsShowing={setIsShowing}
                        userEdit={true}
                        setUserData={setUserData}
                    />
                </FormTransition>
            </div>
        </>
    );
};

export default Navbar;
