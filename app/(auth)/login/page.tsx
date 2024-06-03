"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

const Login = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });
    const [error, setError] = useState<string>("");
    const { userData, setUserData, setIsAuthenticated, isAuthenticated } =
        useAuth();

    const pushToRoute = {
        staff: "/dashboard/clr-information",
        admin: "/",
        customer: "/dashboard/client-view",
    };

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        const res = await fetch(`${BASE_URL}/api/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            if (res.status === 400) {
                const resp = await res.json();
                if (resp.non_field_errors) {
                    setError(resp.non_field_errors[0]);
                }
            } else {
                toast({
                    title: "Alert",
                    description: "Something went wrong!",
                    className: "bg-red-200 border-none",
                });
            }
        } else {
            const resp = await res.json();
            if (resp.token) {
                setUserData({
                    token: resp.token,
                    username: resp.username,
                    role: resp.role,
                    companyName: resp.company_name,
                    mobileNumber: resp.mobile_no,
                    email: resp.email,
                    uid: resp.uid,
                });
                setIsAuthenticated(true);
            }
            router.push(pushToRoute[resp?.role]);
        }
    };

    if (searchParams.size === 1) {
        toast({
            title: "Success",
            description: `Registration Successful!`,
            className: "bg-green-200",
        });
    }

    useEffect(() => {
        if (userData?.token !== "") {
            router.push(pushToRoute[userData?.role]);
        }
    }, [userData?.token]);

    return (
        <>
            {isAuthenticated || isAuthenticated === null ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner height="h-10" width="w-10" />
                </div>
            ) : (
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
                            Login
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        {error !== "" && (
                            <div className="p-7 bg-red-400 rounded-md mb-5">
                                <p className="text-white">{error}</p>
                            </div>
                        )}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-6">
                                    <Button className="w-full" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        {/* <div className="mt-3 text-right">
                        <Link
                            href="/register"
                            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Register
                        </Link>
                    </div> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
