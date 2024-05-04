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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizeFirstLetter } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z.object({
    username: z.string().min(1, "User is required"),
    email: z.string().min(1, "Email is required").email("Invalid Email"),
    password: z.string().min(1, "Password is required"),
    role: z.string().min(1, "Role is required"),
});

const Register = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    });
    const [error, setError] = useState<{ email?: string; username?: string }>(
        {}
    );
    // const { userData } = useAuth();
    // const pushToRoute = {
    //     staff: "/dashboard/clr-information",
    //     customer: "/dashboard/customer",
    // };

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        const res = await fetch(`${BASE_URL}/api/auth/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            if (res.status === 400) {
                const resp = await res.json();
                if (resp.email && resp.username) {
                    setError({
                        email: resp.email[0],
                        username: resp.username[0],
                    });
                } else if (resp.email) {
                    setError({ email: resp.email[0] });
                } else {
                    setError({ username: resp.username[0] });
                }
            } else {
                throw new Error("Something went wrong");
            }
        } else {
            router.push("/login?success=true");
        }
    };

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
                            src="/logo.jpg"
                            alt="logo"
                            width={180}
                            height={180}
                        />
                    </div>
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register Account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {(error.email || error.username) && (
                        <div className="p-7 bg-red-400 rounded-md mb-5">
                            <p className="text-white">
                                {error.email &&
                                    capitalizeFirstLetter(error.email)}
                            </p>
                            <p className="text-white">
                                {error.username &&
                                    capitalizeFirstLetter(error.username)}
                            </p>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
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
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="staff">
                                                    Staff
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value="customer">
                                                    Customer
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                </div>
            </div>
        </>
    );
};

export default Register;
