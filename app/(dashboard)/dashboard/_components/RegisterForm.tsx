"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { BASE_URL } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/lib/utils";

const registerSchema = z.object({
    username: z.string().min(1, "User is required"),
    email: z.string().min(1, "Email is required").email("Invalid Email"),
    mobile_no: z.string().min(1, "Mobile number is required"),
    company_name: z.string().optional(),
    password: z.string().min(1, "Password is required"),
    role: z.string().min(1, "Role is required"),
});

const defaultValues = {
    username: "",
    email: "",
    role: "",
    mobile_no: "",
    company_name: "",
};

const RegisterForm = ({
    user,
    formReset,
    setFormReset,
    editing,
    setIsShowing,
    setRevalidate,
}: {
    user?: { [key: string]: string };
    formReset?: boolean;
    setFormReset?: (arg: boolean) => void;
    setEditing?: (arg: boolean) => void;
    editing?: boolean;
    setIsShowing?: (arg: boolean) => void;
    setRevalidate?: (arg: boolean) => void;
}) => {
    const [isCustomer, setIsCustomer] = useState(false);
    const [error, setError] = useState<{ email?: string; username?: string }>(
        {}
    );
    const pathname = usePathname();
    const router = useRouter();
    const { userData } = useAuth();

    const form = useForm<z.infer<typeof registerSchema>>({
        defaultValues: user,
    });

    const watchRole = form.watch("role");

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        let res;
        let updatedData;
        let headers;

        if (data.role !== "customer") {
            updatedData = {
                username: data?.username,
                email: data?.email,
                mobile_no: data?.mobile_no,
                role: data?.role,
                password: data?.password,
            };
        } else {
            updatedData = {
                username: data?.username,
                email: data?.email,
                mobile_no: data?.mobile_no,
                role: data?.role,
                password: data?.password,
                company_name: data?.company_name,
            };
        }

        if (pathname === "/register") {
            headers = {
                "Content-Type": "application/json",
            };
        } else {
            headers = {
                Authorization: `Token ${userData.token}`,
                "Content-Type": "application/json",
            };
        }

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/auth/register/`, {
                method: "POST",
                headers,
                body: JSON.stringify(updatedData),
            });
        } else {
            const dataWithUID = {
                ...data,
            };

            res = await fetch(`${BASE_URL}/api/auth/update/${data?.uid}/`, {
                method: "PATCH",
                headers,
                body: JSON.stringify(dataWithUID),
            });
        }

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
            if (pathname === "/register") {
                router.push("/login?success=true");
            } else {
                if (!editing) {
                    toast({
                        title: "Success",
                        description: `User Added Successfully!`,
                        className: "bg-green-200",
                    });
                } else {
                    toast({
                        title: "Success",
                        description: `User Updated Successfully!`,
                        className: "bg-green-200",
                    });
                }
                setIsShowing && setIsShowing(false);
                setRevalidate && setRevalidate(true);
            }
        }
    };

    useEffect(() => {
        if (watchRole === "customer") {
            setIsCustomer(true);
        } else {
            setIsCustomer(false);
        }
    }, [watchRole]);

    useEffect(() => {
        if (editing && user) {
            Object.entries(user).map((usr) => {
                form.setValue(usr[0], usr[1]);
            });
        }
    }, [editing, user]);

    useEffect(() => {
        if (formReset && setFormReset) {
            setTimeout(() => {
                form.reset(defaultValues, {
                    keepValues: false,
                });
                setFormReset(false);
            }, 100);
        }
    }, [formReset]);

    return (
        <>
            <Form {...form}>
                <div>
                    {error && (error.email || error.username) && (
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
                </div>
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
                        name="mobile_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isCustomer && (
                        <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                {pathname !== "/register" && editing && (
                                    <FormDescription>
                                        {`Leave this field blank if you don't
                                            want to change password`}
                                    </FormDescription>
                                )}
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
                                    value={field.value}
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
        </>
    );
};

export default RegisterForm;
