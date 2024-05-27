"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { menuItems } from "./Sidebar";
import MenuLink from "./MenuLink";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/constants";
import { IoLogOut } from "react-icons/io5";

const MobileSidebar = ({
    showSidebar,
    setShowSidebar,
}: {
    showSidebar: boolean;
    setShowSidebar: (arg: boolean) => void;
}) => {
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
        <div className="relative">
            <Dialog
                open={showSidebar}
                onOpenChange={() => setShowSidebar((prevValue) => !prevValue)}
            >
                <DialogContent className="sm:max-w-[500px] absolute left-[0%] top-[0%] translate-x-[0%] translate-y-[0%] h-[calc(100vh)] flex flex-col justify-start data-[state=open]:slide-in-from-top-[0%] data-[state=closed]:slide-out-to-top-[0%]">
                    <ul className="list-none mt-3">
                        {menuItems
                            .filter((item) =>
                                item.role.includes(userData?.role)
                            )
                            .map((item) => (
                                <li key={item.title} className="mt-2">
                                    {
                                        <MenuLink
                                            item={item}
                                            key={item.title}
                                            setShowSidebar={setShowSidebar}
                                        />
                                    }
                                </li>
                            ))}
                    </ul>
                    <div
                        className="flex justify-start items-center w-full p-5 gap-1 cursor-pointer hover:text-gray-700"
                        onClick={logout}
                    >
                        <IoLogOut className="w-7 h-7" />
                        Logout
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MobileSidebar;
