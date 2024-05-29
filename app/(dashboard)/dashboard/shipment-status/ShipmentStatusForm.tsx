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
import FormTransition from "../_components/FormTransition";

const defaultValues = {
    bl: "",
    no_container: "",
    eta_departure: "",
    eta_arrival: "",
    port: "",
    docs: "",
    surrender: "",
    status: "",
    container_id_1: "",
};

type ShipmentStatusFormPropsType = {
    isShowing: boolean;
    setIsShowing: () => void;
    shipment: { [key: string]: string };
    setShipment: (arg: {}) => void;
    setRevalidate: (arg: boolean) => void;
};

const ShipmentStatusForm = ({
    isShowing,
    setIsShowing,
    shipment,
    setShipment,
    setRevalidate,
}: ShipmentStatusFormPropsType) => {
    const [containerCount, setContainerCount] = useState(1);
    const [containerInput, setContainerInput] = useState([]);
    const [formReset, setFormReset] = useState(false);
    const [bookingNumbers, setBookingNumbers] = useState([]);
    const [currentBookingNumber, setCurrentBookingNumber] = useState("");
    const [file, setFile] = useState<string>();
    const router = useRouter();
    const { userData } = useAuth();

    const editing = Object.keys(shipment).length !== 0;

    const form = useForm({
        defaultValues,
    });

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
        let res;

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

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/shipment`, {
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
                uid: shipment.uid,
            };

            res = await fetch(
                `${BASE_URL}/api/shipment/update/${shipment.uid}/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Token ${userData.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataWithUID),
                }
            );
        }

        if (!res.ok) {
            toast({
                title: "Alert",
                description: "Something went wrong!",
                className: "bg-red-200 border-none",
            });
        } else {
            let description = "";
            if (editing) {
                description = "Shipment Updated Successfully!";
            } else {
                description = "Shipment Added Successfully!";
            }
            toast({
                title: "Success",
                description,
                className: "bg-green-200",
            });

            if (!editing) {
                router.push("/dashboard/container-status");
            } else {
                setIsShowing((prevState) => !prevState);
            }
        }
    };

    useEffect(() => {
        if (containerCount > 1 && !editing) {
            const inputObject = {
                name: `container_id_${containerCount}`,
                label: `Container ID ${containerCount}`,
            };

            setContainerInput((prevValue) => [...prevValue, inputObject]);
        } else if (containerCount > 1 && editing) {
            const cont = shipment.containers.split(",");
            if (cont && cont.length === containerCount) {
                for (let i = 2; i <= containerCount; i++) {
                    const inputObject = {
                        name: `container_id_${i}`,
                        label: `Container ID ${i}`,
                    };
                    setContainerInput((prevValue) => [
                        ...prevValue,
                        inputObject,
                    ]);
                    form.setValue(inputObject.name, cont[i - 1]);
                }
            } else {
                const inputObject = {
                    name: `container_id_${containerCount}`,
                    label: `Container ID ${containerCount}`,
                };

                setContainerInput((prevValue) => [...prevValue, inputObject]);
            }
        }
    }, [containerCount]);

    useEffect(() => {
        if (!isShowing) {
            if (editing) {
                setShipment({});
                setRevalidate(true);
            }
            setContainerCount(1);
            setContainerInput([]);
            setCurrentBookingNumber("");
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
                toast({
                    title: "Alert",
                    description: "Something went wrong!",
                    className: "bg-red-200 border-none",
                });
            } else {
                const { booking_list } = await res.json();

                setBookingNumbers(booking_list);
            }
        };

        fetchBookingNumbers();
    }, []);

    useEffect(() => {
        if (editing) {
            Object.entries(shipment).map((ship) => {
                if (ship[0] === "attachment") {
                    setFile(ship[1]);
                    return;
                }
                form.setValue(ship[0], ship[1]);
            });

            const cont = shipment.containers.split(",");

            setCurrentBookingNumber(shipment.book_no);
            form.setValue("container_id_1", cont[0]);
            setContainerCount(cont.length);
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

    return (
        <FormTransition isShowing={isShowing} setIsShowing={setIsShowing}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 p-7">
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full lg:flex-1">
                                <Label htmlFor="name" className="text-right">
                                    Booking Number
                                </Label>
                                <div className="mt-2">
                                    <Combobox
                                        currentItem={currentBookingNumber}
                                        itemsArray={bookingNumbers}
                                        itemNotSelectedMessage="Select Booking #..."
                                        commandEmptyMessage="No booking # found!"
                                        setCurrentItem={setCurrentBookingNumber}
                                        btnWidth="w-full"
                                        editing={editing}
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
                                            <Input placeholder="" {...field} />
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
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="eta_departure"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>ETD / Departure</FormLabel>
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
                                            <Input placeholder="" {...field} />
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
                                        <FormLabel>Current Status</FormLabel>
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
                                        <FormLabel>Container ID 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
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
                                    <FormLabel>Attachment of booking</FormLabel>
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
        </FormTransition>
    );
};

export default ShipmentStatusForm;
