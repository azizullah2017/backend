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
import { useStaffInformation } from "@/context/StaffInformationContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ContainerPortStatusForm = ({
    isShowing,
    setIsShowing,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
}) => {
    const { staffInfo, setStaffInfo } = useStaffInformation();
    const [files, setFiles] = useState<File[]>();
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            bl: staffInfo.bl,
            bl_containers: staffInfo.containers,
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append("attachment", files);
        formData.append("book_no", data.book_no);
        formData.append("bl", data.bl);
        formData.append("delivery_at", data.delivery_at);
        formData.append("gd_no", data.gd_no);
        formData.append("clearing_agent", data.clearing_agent);
        formData.append("transporter", data.transporter);
        formData.append("truck_no", data.truck_no);
        formData.append("driver_name", data.driver_name);
        formData.append("driver_mobile_no", data.driver_mobile_no);
        formData.append("truck_placement_date", data.truck_placement_date);
        formData.append("truck_out_date", data.truck_out_date);
        formData.append("bl_containers", data.bl_containers);
        formData.append("status", data.status);

        setStaffInfo((prevValue) => ({ ...prevValue, truckNo: data.truck_no }));
        router.push("/dashboard/city-vise-tracker");
    };

    return (
        <Transition
            show={isShowing}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-350"
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
                                    name="bl"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>BL Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                    disabled
                                                />
                                            </FormControl>
                                            {/* <FormMessage /> */}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bl_containers"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Containers</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder=""
                                                    {...field}
                                                    disabled
                                                />
                                            </FormControl>
                                            {/* <FormMessage /> */}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="delivery_at"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Deliver At</FormLabel>
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
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <FormField
                                    control={form.control}
                                    name="gd_no"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>GD No.</FormLabel>
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
                                    name="clearing_agent"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Clearing Agent
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
                                    name="transporter"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Transporter</FormLabel>
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
                                    name="truck_no"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Truck No.</FormLabel>
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
                                    name="driver_name"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Driver Name</FormLabel>
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
                                    name="driver_mobile_no"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Mobile No.</FormLabel>
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
                                    name="truck_placement_date"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Truck Placement Date
                                            </FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="truck_out_date"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Truck Out Date
                                            </FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Current Status
                                            </FormLabel>
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
                            </div>
                            <FormField
                                control={form.control}
                                name="attachment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Attachment of deal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                placeholder=""
                                                {...field}
                                                multiple
                                                onChange={(e) => {
                                                    setFiles(e.target.files);
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
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

export default ContainerPortStatusForm;
