"use client";

import { useAuth } from "@/context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { CgClose } from "react-icons/cg";
import { Fragment } from "react";
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
        <Transition.Root show={showSidebar} as={Fragment}>
            <Dialog className="relative z-10" onClose={setShowSidebar}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md lg:max-w-[700px]">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute right-0 top-0 -mr-9 flex pr-2 pt-4 sm:-mr-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() =>
                                                    setShowSidebar(false)
                                                }
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">
                                                    Close panel
                                                </span>
                                                <CgClose
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-0 shadow-xl lg:w-full">
                                        <div className="relative mt-6 flex-1 px-4">
                                            <ul className="list-none mt-3">
                                                {menuItems
                                                    .filter((item) =>
                                                        item.role.includes(
                                                            userData?.role
                                                        )
                                                    )
                                                    .map((item) => (
                                                        <li
                                                            key={item.title}
                                                            className="mt-2"
                                                        >
                                                            {
                                                                <MenuLink
                                                                    item={item}
                                                                    key={
                                                                        item.title
                                                                    }
                                                                    setShowSidebar={
                                                                        setShowSidebar
                                                                    }
                                                                />
                                                            }
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default MobileSidebar;