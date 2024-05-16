"use client";

import { DefaultValues, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import FormTransition from "../_components/FormTransition";

const defaultValues = {
    shipper_reference: "",
    shipper: "",
    consignee: "",
    book_no: "",
    no_container: "",
    size: "",
    product: "",
    port_of_loading: "",
    port_of_departure: "",
    final_port_of_destination: "",
    etd: "",
    vessel: "",
    status: "",
    eta_karachi: "",
};

type CLRFormPropsType = {
    isShowing: boolean;
    setIsShowing: (arg: boolean) => void;
    clr: { [key: string]: string };
    setClr: (arg: {}) => void;
    setRevalidate: (arg: boolean) => void;
};

const CLRForm = ({
    isShowing,
    setIsShowing,
    clr,
    setClr,
    setRevalidate,
}: CLRFormPropsType) => {
    const router = useRouter();
    const { userData } = useAuth();
    const [formReset, setFormReset] = useState(false);
    const editing = Object.keys(clr).length !== 0;

    const form = useForm({
        defaultValues,
    });

    const onSubmit = async (data: { [key: string]: string }) => {
        let res;

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/clr`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${userData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        } else {
            const dataWithUID = {
                ...data,
                uid: clr.uid,
            };
            res = await fetch(`${BASE_URL}/api/clr/update/${clr.uid}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${userData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataWithUID),
            });
        }

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            let description = "";
            if (editing) {
                description = "CLR Updated Successfully!";
            } else {
                description = "CLR Added Successfully!";
            }
            toast({
                title: "Success",
                description,
                className: "bg-green-200",
            });

            if (!editing) {
                router.push("/dashboard/shipment-status");
            } else {
                setIsShowing((prevState) => !prevState);
            }
        }
    };

    useEffect(() => {
        if (editing) {
            Object.entries(clr).map((clr) => {
                form.setValue(clr[0], clr[1]);
            });
        }
    }, [editing]);

    useEffect(() => {
        if (formReset) {
            setTimeout(() => {
                form.reset(defaultValues, {
                    keepValues: false,
                });
                setFormReset(false);
            }, 100);
        }
    }, [formReset]);

    useEffect(() => {
        if (!isShowing) {
            if (editing) {
                setClr({});
                setRevalidate(true);
            }

            setFormReset(true);
        }
    }, [isShowing]);

    return (
        <FormTransition isShowing={isShowing} setIsShowing={setIsShowing}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 p-7">
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="shipper_reference"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Shipper Reference</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shipper"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Shipper</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="consignee"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Consignee</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="book_no"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Booking Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="no_container"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Container Count</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Container Size</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Product</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="port_of_loading"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Loading Port</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="port_of_departure"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Departure Port</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="final_port_of_destination"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Final Port</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="etd"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>ETD</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="vessel"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Vessel</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="inprogress">
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    Done
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="eta_karachi"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>ETA KHI</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="ml-7 mb-5">
                        Submit
                    </Button>
                </form>
            </Form>
        </FormTransition>
    );
};

export default CLRForm;
