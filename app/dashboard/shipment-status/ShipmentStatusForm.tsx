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
    const [file, setFile] = useState<File>();
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            book_no: staffInfo.bookingNo,
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
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

        formData.append("attachment", file as File);
        formData.append("book_no", data.book_no);
        formData.append("bl", data.bl);
        formData.append("no_container", data.no_container);
        formData.append("eta_departure", data.eta_departure);
        formData.append("eta_arrival", data.eta_arrival);
        formData.append("port", data.port);
        formData.append("docs", data.docs);
        formData.append("surrender", data.surrender);
        formData.append("containers", containers);
        formData.append("status", data.status);

        setStaffInfo((prevValue) => ({
            ...prevValue,
            bl: data.bl,
            containers: containers,
        }));
        router.push("/dashboard/container-status");
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
                            <FormField
                                control={form.control}
                                name="book_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Number</FormLabel>
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
                                name="bl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{`BL (Bill of Lading No.)`}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="no_container"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
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
                            <FormField
                                control={form.control}
                                name="eta_arrival"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
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
                                    <FormItem>
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
                            <FormField
                                control={form.control}
                                name="surrender"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
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
                            <div className="flex justify-end">
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
                            <FormField
                                control={form.control}
                                name="container_id_1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Container ID 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {containerInput.map((container) => (
                                <FormField
                                    control={form.control}
                                    name={container.name}
                                    render={({ field }) => (
                                        <FormItem>
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
                                                    setFile(
                                                        e.target.files?.[0]
                                                    );
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
