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
import { DataTable } from "@/components/ui/data-tables";
import FormTransition from "../_components/FormTransition";

type CityViseTrackerFormType = {
    isShowing: boolean;
    setIsShowing: () => void;
    setRevalidate: (arg: boolean) => void;
    revalidate: boolean;
    cityDialog: boolean;
    setCityDialog: (arg: boolean) => void;
    truckDetailsColumn: any;
    tracker: { [key: string]: string };
    setTracker: (arg: {}) => void;
};

const CityViseTrackerForm = ({
    isShowing,
    setIsShowing,
    setRevalidate,
    revalidate,
    cityDialog,
    setCityDialog,
    truckDetailsColumn,
    tracker,
    setTracker,
}: CityViseTrackerFormType) => {
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [locations, setLocations] = useState([]);
    const [currentTruck, setCurrentTruck] = useState<string>("");
    const [trucks, setTrucks] = useState([]);
    const [truckDetails, setTruckDetails] = useState([]);
    const [truckData, setTruckData] = useState({});
    const { userData } = useAuth();

    const editing = Object.keys(tracker).length !== 0;

    useEffect(() => {
        if (currentTruck) {
            const citiesFunc = async () => {
                const res = await fetch(
                    `${BASE_URL}/api/cities?truck=${currentTruck}`,
                    {
                        headers: {
                            Authorization: `Token ${userData?.token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Something went wrong");
                } else {
                    const { cities } = await res.json();
                    setLocations(cities);
                }
            };
            citiesFunc();
        }
    }, [currentTruck]);

    useEffect(() => {
        const fetchTrucks = async () => {
            const res = await fetch(`${BASE_URL}/api/tracker?query=truck`, {
                headers: {
                    Authorization: `Token ${userData?.token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Something went wrong");
            } else {
                const { truck_list } = await res.json();

                setTrucks(truck_list);
            }
        };

        fetchTrucks();
    }, []);

    useEffect(() => {
        if (currentTruck || revalidate) {
            const fetchTruckDetails = async () => {
                const res = await fetch(
                    `${BASE_URL}/api/tracker?truck=${currentTruck}`,
                    {
                        headers: {
                            Authorization: `Token ${userData?.token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Something went wrong");
                } else {
                    const { truck_list } = await res.json();

                    setTruckDetails(truck_list);
                    setTruckData({
                        bl: truck_list[0].bl,
                        blContainers: truck_list[0].bl_containers
                            .split(",")
                            .join(", "),
                        truckNo: currentTruck,
                    });
                }
            };

            fetchTruckDetails();
        }
    }, [currentTruck, revalidate]);

    useEffect(() => {
        if (editing) {
            Object.entries(tracker).map((trck) => {
                trck[0] === "date" && setDate(trck[1]);
                trck[0] === "status" && setStatus(trck[1]);
                trck[0] === "curent_location" && setCurrentLocation(trck[1]);
            });
        }
    }, [editing]);

    useEffect(() => {
        if (!cityDialog) {
            if (editing) {
                setTracker({});
                setRevalidate(true);
            }

            setStatus("");
            setDate("");
        }
    }, [cityDialog]);

    const submitForm = async () => {
        const containers = truckData.blContainers.split(",");
        const updatedCont = containers
            .map((container) => container.trim())
            .join(",");
        let res;

        const data = {
            bl_containers: updatedCont,
            bl: truckData.bl,
            curent_location: currentLocation,
            date,
            status,
            truck_no: currentTruck,
        };

        if (!editing) {
            res = await fetch(`${BASE_URL}/api/tracker`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${userData?.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        } else {
            const dataWithUID = {
                ...data,
                uid: tracker.uid,
            };

            res = await fetch(
                `${BASE_URL}/api/tracker/update/${tracker.uid}/`,
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
            throw new Error("Something went wrong");
        } else {
            toast({
                title: "Success",
                description: "City Vise Tracker Added Successfully!",
                className: "bg-green-200",
            });
            setRevalidate(true);
            setCityDialog(false);
        }
    };

    return (
        <FormTransition isShowing={isShowing} setIsShowing={setIsShowing}>
            <div className="mr-4 mt-5">
                <Dialog
                    open={cityDialog}
                    onOpenChange={() =>
                        setCityDialog((prevValue) => !prevValue)
                    }
                >
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
                                <Label htmlFor="name" className="text-right">
                                    City
                                </Label>
                                <Combobox
                                    currentItem={currentLocation}
                                    itemsArray={locations}
                                    itemNotSelectedMessage="Select City..."
                                    commandEmptyMessage="No city found"
                                    setCurrentItem={setCurrentLocation}
                                    btnWidth="w-[200px]"
                                    editing={editing}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    className="col-span-2"
                                    onChange={(e) => setDate(e.target.value)}
                                    value={date}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    onValueChange={(value) => setStatus(value)}
                                    value={status}
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
                            <Button
                                type="button"
                                onClick={submitForm}
                                disabled={!currentTruck}
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mx-5 mt-5 space-y-3 mb-3">
                <Label htmlFor="bl">Truck Number</Label>
                <Combobox
                    currentItem={currentTruck}
                    itemsArray={trucks}
                    itemNotSelectedMessage="Select Truck..."
                    commandEmptyMessage="No truck found"
                    setCurrentItem={setCurrentTruck}
                    btnWidth="w-full"
                />
                <p>
                    <span className="font-semibold">BL Number: </span>
                    {truckData.bl}
                </p>
                <p>
                    <span className="font-semibold">Containers: </span>
                    {truckData.blContainers}
                </p>
                <p>
                    <span className="font-semibold">Truck Number: </span>
                    {truckData.truckNo}
                </p>
                <DataTable
                    columns={truckDetailsColumn}
                    data={truckDetails}
                    pagination={false}
                />
            </div>
        </FormTransition>
    );
};

export default CityViseTrackerForm;
