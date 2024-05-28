"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { menuItems } from "./Sidebar";
import MenuLink from "./MenuLink";

const MobileSidebar = ({
    showSidebar,
    setShowSidebar,
}: {
    showSidebar: boolean;
    setShowSidebar: (arg: boolean) => void;
}) => {
    const { userData } = useAuth();

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
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MobileSidebar;
