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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import Combobox from "@/components/Combobox";
import { MultiSelect } from "@/components/MultiSelect";
import FormTransition from "../_components/FormTransition";
import useLogout from "@/hooks/Logout";

const defaultValues = {
    delivery_at: "",
    gd_no: "",
    clearing_agent: "",
    transporter: "",
    truck_no: "",
    driver_name: "",
    driver_mobile_no: "",
    truck_placement_date: "",
    truck_out_date: "",
    status: "",
};

type ContainerPortStatusFormPropsType = {
    isShowing: boolean;
    setIsShowing: () => void;
    port: { [key: string]: string };
    setPort: (arg: {}) => void;
    setRevalidate: (arg: boolean) => void;
};

const ContainerPortStatusForm = ({
    isShowing,
    setIsShowing,
    port,
    setPort,
    setRevalidate,
}: ContainerPortStatusFormPropsType) => {
    const [files, setFiles] = useState<string[]>([]);
    const [currentBlNumber, setCurrentBlNumber] = useState("");
    const [currentContainers, setCurrentContainers] = useState<string[]>([]);
    const [containers, setContainers] = useState([]);
    const [blNumbers, setBlNumbers] = useState([]);
    const [formReset, setFormReset] = useState(false);
    const router = useRouter();
    const { userData } = useAuth();
    const logout = useLogout(true);

    const editing = Object.keys(port).length !== 0;

    const form = useForm({
        defaultValues,
    });

    const fileChangeHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const fileInputs = e.target.files;
        const myFiles = Array.from(fileInputs);

        myFiles.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file as File);
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFiles((prevValue) => [
                        ...prevValue,
                        reader.result as string,
                    ]);
                }
            };
        });
    };

    const onSubmit = async (data) => {
        let res;

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
            bl_containers: currentContainers.join(","),
            status: data.status,
            attachment: files && files.join(","),
        };

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/port`, {
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
                uid: port.uid,
            };

            res = await fetch(`${BASE_URL}/api/port/update/${port.uid}/`, {
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
                description = "Port Updated Successfully!";
            } else {
                description = "Port Added Successfully!";
            }
            toast({
                title: "Success",
                description,
                className: "bg-green-200",
            });
            if (!editing) {
                router.push("/dashboard/city-vise-tracker");
            } else {
                setIsShowing((prevState) => !prevState);
            }
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
                if (res.status === 401) return logout();
                toast({
                    title: "Alert",
                    description: "Something went wrong!",
                    className: "bg-red-200 border-none",
                });
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
                    if (res.status === 401) return;
                    toast({
                        title: "Alert",
                        description: "Something went wrong!",
                        className: "bg-red-200 border-none",
                    });
                } else {
                    const { containers } = await res.json();

                    setContainers(containers);
                }
            };

            fetchContainers();
        }
    }, [currentBlNumber]);

    useEffect(() => {
        if (editing) {
            Object.entries(port).map((prt) => {
                if (prt[0] === "attachment") {
                    const items = prt[1].split(",");
                    for (let i = 1; i <= items.length; i++) {
                        if (i % 2 === 0) {
                            setFiles((prevValue) => [
                                ...prevValue,
                                items[i - 2] + "," + items[i - 1] + ",",
                            ]);
                        }
                    }
                    return;
                }
                if (prt[0] === "bl_containers") {
                    const cont = port.bl_containers.split(",");
                    setCurrentContainers(cont);
                    return;
                }
                form.setValue(prt[0], prt[1]);
            });

            setCurrentBlNumber(port.bl);
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
                setPort({});
                setRevalidate(true);
            }

            setFormReset(true);
            setCurrentBlNumber("");
            setFiles([]);
            setCurrentContainers([]);
        }
    }, [isShowing]);

    return (
        <FormTransition isShowing={isShowing} setIsShowing={setIsShowing}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 p-7">
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full lg:flex-1">
                                <Label htmlFor="name" className="text-right">
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
                                        editing={editing}
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
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full lg:flex-1">
                            <Label htmlFor="name" className="text-right">
                                Containers
                            </Label>
                            <div className="mt-2">
                                <MultiSelect
                                    options={containers}
                                    selected={currentContainers}
                                    onChange={setCurrentContainers}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="gd_no"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>GD No.</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clearing_agent"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Clearing Agent</FormLabel>
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
                                name="transporter"
                                render={({ field }) => (
                                    <FormItem className="w-full lg:flex-1">
                                        <FormLabel>Transporter</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
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
                                            <Input placeholder="" {...field} />
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
                                            <Input placeholder="" {...field} />
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
                                            <Input placeholder="" {...field} />
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
                                        <FormLabel>Truck Out Date</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="attachment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachment of deal</FormLabel>
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
        </FormTransition>
    );
};

export default ContainerPortStatusForm;