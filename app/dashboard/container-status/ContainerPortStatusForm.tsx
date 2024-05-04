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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/Combobox";

const ContainerPortStatusForm = ({
    isShowing,
    setIsShowing,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
}) => {
    const { staffInfo } = useStaffInformation();
    const [files, setFiles] = useState<string[]>([]);
    const [currentBlNumber, setCurrentBlNumber] = useState("");
    const [currentContainer, setCurrentContainer] = useState("");
    const [containers, setContainers] = useState([]);
    const [blNumbers, setBlNumbers] = useState([]);
    const router = useRouter();
    const { userData } = useAuth();

    const form = useForm();

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInputs = e.target.files;
        const myFiles = Array.from(fileInputs);

        myFiles.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file as File);
            reader.onload = () => {
                if (reader.readyState === 2) {
                    // console.log(reader.result);
                    setFiles((prevValue) => [
                        ...prevValue,
                        reader.result as string,
                    ]);
                }
            };
        });
    };

    const onSubmit = async (data) => {
        const updatedData = {
            book_no: data.book_no,
            bl: currentBlNumber,
            delivery_at: data.delivery_at,
            gd_no: data.gd_no,
            clearing_agent: data.clearing_agent,
            transporter: data.transporter,
            truck_no: data.truck_no,
            driver_name: data.driver_name,
            driver_mobile_no: data.driver_mobile_no,
            truck_placement_date: data.truck_placement_date,
            truck_out_date: data.truck_out_date,
            bl_containers: currentContainer,
            status: data.status,
            attachment: files.length && files.join(","),
        };

        const res = await fetch(`${BASE_URL}/api/port`, {
            method: "POST",
            headers: {
                Authorization: `Token ${userData.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            toast({
                title: "Success",
                description: "Shipment Status Added Successfully!",
                className: "bg-green-200",
            });

            router.push("/dashboard/city-vise-tracker");
        }
    };

    useEffect(() => {
        const fetchBlNumbers = async () => {
            const res = await fetch(`${BASE_URL}/api/port?query=bl`, {
                headers: {
                    Authorization: `Token ${userData?.token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Something went wrong");
            } else {
                const { bl_list } = await res.json();

                setBlNumbers(bl_list);
            }
        };

        fetchBlNumbers();
    }, []);

    useEffect(() => {
        if (currentBlNumber) {
            const fetchContainers = async () => {
                const res = await fetch(
                    `${BASE_URL}/api/port?bl=${currentBlNumber}`,
                    {
                        headers: {
                            Authorization: `Token ${userData?.token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Something went wrong");
                } else {
                    const { containers } = await res.json();

                    setContainers(containers);
                }
            };

            fetchContainers();
        }
    }, [currentBlNumber]);

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
                                <div className="w-full lg:flex-1">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        BL Numbers
                                    </Label>
                                    <div className="mt-2">
                                        <Combobox
                                            currentItem={currentBlNumber}
                                            itemsArray={blNumbers}
                                            itemNotSelectedMessage="Select BL..."
                                            commandEmptyMessage="No BL # found!"
                                            setCurrentItem={setCurrentBlNumber}
                                            btnWidth="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:flex-1">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Containers
                                    </Label>
                                    <div className="mt-2">
                                        <Combobox
                                            currentItem={currentContainer}
                                            itemsArray={containers}
                                            itemNotSelectedMessage="Select Container..."
                                            commandEmptyMessage="No containers found!"
                                            setCurrentItem={setCurrentContainer}
                                            btnWidth="w-full"
                                        />
                                    </div>
                                </div>
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
                                                    fileChangeHandler(e);
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
