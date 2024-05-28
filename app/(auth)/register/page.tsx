"use client";

import { capitalizeFirstLetter } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import RegisterForm from "@/app/(dashboard)/dashboard/_components/RegisterForm";

const Register = () => {
    // const { userData } = useAuth();
    // const pushToRoute = {
    //     staff: "/dashboard/clr-information",
    //     customer: "/dashboard/customer",
    // };

    // useEffect(() => {
    //     if (userData?.token === "" && userData?.role !== "admin") {
    //         router.push(pushToRoute[userData?.role]);
    //     }
    // }, []);

    return (
        <>
            <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={250}
                            height={250}
                        />
                    </div>
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register Account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <RegisterForm />
                </div>
            </div>
        </>
    );
};

export default Register;
