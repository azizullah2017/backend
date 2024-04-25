"use client";

import { Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
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
import { useStaffInformation } from "@/context/StaffInformationContext";
import { useRouter } from "next/navigation";

const CLRForm = ({
    isShowing,
    setIsShowing,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
}) => {
    const { staffInfo, setStaffInfo } = useStaffInformation();
    const router = useRouter();

    const form = useForm();

    const onSubmit = async (data: { [key: string]: string }) => {
        const res = await fetch("http://localhost:8000/api/clr/create", {
            method: "POST",
            headers: {
                Authorization: "Token 44642ff29cfadaa8605d83abacdc2cb09172b5ee",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            toast({
                title: "Success",
                description: "CLR Added Successfully!",
                className: "bg-green-200",
            });

            const responseData = await res.json();

            setStaffInfo();
            setStaffInfo({ bookingNo: responseData.book_no });
            router.push("/dashboard/shipment-status");
        }
    };

    return (
        <Transition
            show={isShowing}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="h-screen w-full md:w-1/3 bg-[#F4F7FE] absolute top-0 right-0 overflow-y-auto">
                <div className="flex justify-end mt-4 mr-4">
                    <CgClose
                        className="w-7 h-7 cursor-pointer"
                        onClick={() => setIsShowing((prevState) => !prevState)}
                    />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4 p-7">
                            <div className="flex flex-wrap gap-4">
                                <FormField
                                    control={form.control}
                                    name="shipper_reference"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Shipper Reference
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
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
                                                <Input
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
                                    name="consignee"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Consignee</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="book_no"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Booking Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
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
                                    name="no_container"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Container Count
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Container Size
                                            </FormLabel>
                                            <FormControl>
                                                <Input
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
                                    name="product"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Product</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
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
                                                <Input
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
                                    name="port_of_departure"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Departure Port
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
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
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="eta"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>ETA</FormLabel>
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
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                />
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
            </div>
        </Transition>
    );
};

export default CLRForm;
