"use client";

import { Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
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
import { useEffect, useState } from "react";
import { useStaffInformation } from "@/context/StaffInformationContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/Combobox";

const ShipmentStatusForm = ({
    isShowing,
    setIsShowing,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
}) => {
    const [containerCount, setContainerCount] = useState(1);
    const [containerInput, setContainerInput] = useState([]);
    const { staffInfo, setStaffInfo } = useStaffInformation();
    const [file, setFile] = useState<string>();
    const [bookingNumbers, setBookingNumbers] = useState([]);
    const [currentBookingNumber, setCurrentBookingNumber] = useState("");
    const router = useRouter();
    const { userData } = useAuth();

    const form = useForm();

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const myFile = e.target.files?.[0];

        const reader = new FileReader();
        reader.readAsDataURL(myFile as File);
        reader.onload = () => {
            if (reader.readyState === 2) {
                setFile(reader.result as string);
            }
        };
    };

    const onSubmit = async (data) => {
        let containersList = [];
        let containers = "";

        if (containerCount > 1) {
            containersList.push(data.container_id_1);
            containerInput.map((container) => {
                if (data[container.name] !== "") {
                    containersList.push(data[container.name]);
                }
            });
            containers = containersList.join(",");
        } else {
            containers = data.container_id_1;
        }

        const updatedData = {
            bl: data.bl,
            book_no: currentBookingNumber,
            containers,
            docs: data.docs,
            eta_arrival: data.eta_arrival,
            eta_departure: data.eta_departure,
            no_container: data.no_container,
            port: data.port,
            status: data.status,
            surrender: data.surrender,
            attachment: file,
        };

        const res = await fetch(`${BASE_URL}/api/shipment`, {
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

            const responseData = await res.json();

            setStaffInfo((prevValue: Object) => ({
                ...prevValue,
                blNumber: responseData.bl,
                containers: responseData.containers,
            }));
            router.push("/dashboard/container-status");
        }
    };

    useEffect(() => {
        if (containerCount > 1) {
            const inputObject = {
                name: `container_id_${containerCount}`,
                label: `Container ID ${containerCount}`,
            };

            setContainerInput((prevValue) => [...prevValue, inputObject]);
        }
    }, [containerCount]);

    useEffect(() => {
        if (!isShowing) {
            setContainerCount(1);
            setContainerInput([]);
        }
    }, [isShowing]);

    useEffect(() => {
        const fetchBookingNumbers = async () => {
            const res = await fetch(
                `${BASE_URL}/api/shipment?query=booking_list`,
                {
                    headers: {
                        Authorization: `Token ${userData?.token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Something went wrong");
            } else {
                const { booking_list } = await res.json();

                setBookingNumbers(booking_list);
            }
        };

        fetchBookingNumbers();
    }, []);

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
                                        Booking Number
                                    </Label>
                                    <div className="mt-2">
                                        <Combobox
                                            currentItem={currentBookingNumber}
                                            itemsArray={bookingNumbers}
                                            itemNotSelectedMessage="Select Booking #..."
                                            commandEmptyMessage="No booking # found!"
                                            setCurrentItem={
                                                setCurrentBookingNumber
                                            }
                                            btnWidth="w-full"
                                        />
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="bl"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>{`BL (Bill of Lading No.)`}</FormLabel>
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
                                    name="no_container"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>{`Volumne (No. of Containers)`}</FormLabel>
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
                                    name="eta_departure"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                ETD / Departure
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
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <FormField
                                    control={form.control}
                                    name="eta_arrival"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>ETA / Arrival</FormLabel>
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
                                    name="port"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Port</FormLabel>
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
                                    name="docs"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Docs</FormLabel>
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
                                    name="surrender"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>Surrender</FormLabel>
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
                            <div className="flex flex-wrap items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="container_id_1"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:flex-1">
                                            <FormLabel>
                                                Container ID 1
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
                                <div className="lg:mt-5">
                                    <Button
                                        onClick={() =>
                                            setContainerCount(
                                                (prevValue) => prevValue + 1
                                            )
                                        }
                                        type="button"
                                    >
                                        Add Container
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {containerInput.map((container, index) => (
                                    <FormField
                                        control={form.control}
                                        name={container.name}
                                        key={index}
                                        render={({ field }) => (
                                            <FormItem className="w-full lg:flex-1">
                                                <FormLabel>
                                                    {container.label}
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
                                ))}
                            </div>
                            <FormField
                                control={form.control}
                                name="attachment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Attachment of booking
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                placeholder=""
                                                {...field}
                                                onChange={(e) => {
                                                    fileChangeHandler(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Attach .pdf document
                                        </FormDescription>
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

export default ShipmentStatusForm;
