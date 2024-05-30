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
import { Textarea } from "@/components/ui/textarea";
import useLogout from "@/hooks/Logout";

const defaultValues = {
    bl_1: "",
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
    shipment_comment: "",
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
    const [formReset, setFormReset] = useState(false);
    const [blCount, setBlCount] = useState(1);
    const [blInput, setBlInput] = useState([]);
    const router = useRouter();
    const { userData } = useAuth();
    const logout = useLogout(true);

    const editing = Object.keys(clr).length !== 0;

    const form = useForm({
        defaultValues,
    });

    const onSubmit = async (data: { [key: string]: string }) => {
        let blList = [];
        let bls = "";
        let res;

        if (blCount > 1) {
            blList.push(data.bl_1);
            blInput.map((bl) => {
                if (data[bl.name] !== "") {
                    blList.push(data[bl.name]);
                }
            });
            bls = blList.join(",");
        } else {
            bls = data.bl_1;
        }

        const updatedData = {
            shipper_reference: data.shipper_reference,
            shipper: data.shipper,
            consignee: data.consignee,
            book_no: data.book_no,
            no_container: data.no_container,
            size: data.size,
            product: data.product,
            port_of_loading: data.port_of_loading,
            port_of_departure: data.port_of_departure,
            final_port_of_destination: data.final_port_of_destination,
            etd: data.etd,
            vessel: data.vessel,
            status: data.status,
            eta_karachi: data.eta_karachi,
            shipment_comment: data?.shipment_comment,
            bls,
        };

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/clr`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${userData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });
        } else {
            const dataWithUID = {
                ...updatedData,
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
            if (res.status === 401) return logout();
            toast({
                title: "Alert",
                description: "Something went wrong!",
                className: "bg-red-200 border-none",
            });
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

            const bls = clr.bls?.split(",");

            if (bls) {
                form.setValue("bl_1", bls[0]);
                setBlCount(bls.length);
            }
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

            setBlCount(1);
            setBlInput([]);
            setFormReset(true);
        }
    }, [isShowing]);

    useEffect(() => {
        if (blCount > 1 && !editing) {
            const inputObject = {
                name: `bl_${blCount}`,
                label: `BL ${blCount}`,
            };

            setBlInput((prevValue) => [...prevValue, inputObject]);
        } else if (blCount > 1 && editing) {
            const bl = clr.bls?.split(",");
            if (bl && bl.length === blCount) {
                for (let i = 2; i <= blCount; i++) {
                    const inputObject = {
                        name: `bl_${i}`,
                        label: `BL ${i}`,
                    };
                    setBlInput((prevValue) => [...prevValue, inputObject]);
                    form.setValue(inputObject.name, bl[i - 1]);
                }
            } else {
                const inputObject = {
                    name: `bl_${blCount}`,
                    label: `BL ${blCount}`,
                };

                setBlInput((prevValue) => [...prevValue, inputObject]);
            }
        }
    }, [blCount]);

    return (
        <FormTransition isShowing={isShowing} setIsShowing={setIsShowing}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 p-7">
                        <div className="flex flex-wrap items-center gap-4">
                            <FormField
                                control={form.control}
                                name="bl_1"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>BL 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="lg:mt-5">
                                <Button
                                    onClick={() =>
                                        setBlCount((prevValue) => prevValue + 1)
                                    }
                                    type="button"
                                >
                                    Add BL
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {blInput.map((bl, index) => (
                                <FormField
                                    control={form.control}
                                    name={bl.name}
                                    key={index}
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>{bl.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
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
                        <div className="flex flex-wrap items-center gap-4">
                            <FormField
                                control={form.control}
                                name="shipment_comment"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Comments</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=""
                                                className="resize-none"
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
