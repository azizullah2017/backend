"use client";

import { Transition } from "@headlessui/react";
import { CgClose } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { useStaffInformation } from "@/context/StaffInformationContext";
import { toast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import Combobox from "@/components/Combobox";

const CityViseTrackerForm = ({
    isShowing,
    setIsShowing,
    setRevalidate,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
    setRevalidate: (arg: boolean) => void;
}) => {
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [bl, setBl] = useState<string>("");
    const [locations, setLocations] = useState([]);
    const [containers, setContainers] = useState<string>("");
    const { staffInfo } = useStaffInformation();
    const { userData } = useAuth();

    useEffect(() => {
        if (staffInfo.blNumber && staffInfo.containers) {
            setContainers(staffInfo.containers);
            setBl(staffInfo.blNumber);
        }
    }, [bl, containers]);

    useEffect(() => {
        const citiesFunc = async () => {
            const res = await fetch(`${BASE_URL}/api/cities`, {
                headers: {
                    Authorization: `Token ${userData?.token}`,
                },
            });

            const responseData = await res.json();
            setLocations(responseData.cities);
        };
        citiesFunc();
    }, []);

    const submitForm = async () => {
        const data = {
            //Todo: change this before deployment
            bl_containers: containers ? containers : "123,123",
            bl: bl ? bl : "test",
            curent_location: currentLocation,
            date,
            status,
        };

        const res = await fetch(`${BASE_URL}/api/tracker`, {
            method: "POST",
            headers: {
                Authorization: `Token ${userData?.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        } else {
            toast({
                title: "Success",
                description: "Shipment Status Added Successfully!",
                className: "bg-green-200",
            });
            setRevalidate(true);
        }
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
                <div className="mr-4 mt-5">
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex justify-end">
                                <Button>Add City</Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add City</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        City
                                    </Label>
                                    <Combobox
                                        currentItem={currentLocation}
                                        itemsArray={locations}
                                        itemNotSelectedMessage="Select City..."
                                        commandEmptyMessage="No city found"
                                        setCurrentItem={setCurrentLocation}
                                        btnWidth="w-[200px]"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="date"
                                        className="text-right"
                                    >
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="col-span-2"
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="status"
                                        className="text-right"
                                    >
                                        Status
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setStatus(value)
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="inprogress">
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    Done
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={submitForm}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mx-5 mt-5">
                    <Label htmlFor="bl">BL Number</Label>
                    <Input type="text" value={bl} className="mb-4" disabled />
                    <Label htmlFor="bl_containers">Containers</Label>
                    <Input type="text" value={containers} disabled />
                </div>
            </div>
        </Transition>
    );
};

export default CityViseTrackerForm;
