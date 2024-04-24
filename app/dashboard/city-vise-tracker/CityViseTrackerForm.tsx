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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStaffInformation } from "@/context/StaffInformationContext";

const CityViseTrackerForm = ({
    isShowing,
    setIsShowing,
}: {
    isShowing: boolean;
    setIsShowing: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [bl, setBl] = useState<string>("");
    const [containers, setContainers] = useState<string>("");
    const { staffInfo } = useStaffInformation();
    const [frameworks, setFrameworks] = useState([
        {
            value: "next.js",
            label: "Next.js",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ]);

    useEffect(() => {
        if (staffInfo.bl && staffInfo.containers) {
            setContainers(staffInfo.containers);
            setBl(staffInfo.bl);
        }
    }, [bl, containers]);

    console.log(open);

    const submitForm = async () => {
        console.log("hello world");
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
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[200px] justify-between"
                                            >
                                                {value
                                                    ? frameworks.find(
                                                          (framework) =>
                                                              framework.value ===
                                                              value
                                                      )?.label
                                                    : "Select City..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search City..." />
                                                <CommandEmpty>
                                                    No framework found.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {console.log(frameworks)}
                                                    {frameworks.map(
                                                        (framework) => (
                                                            <CommandItem>
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        value ===
                                                                            framework.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {
                                                                    framework.label
                                                                }
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="username"
                                        className="text-right"
                                    >
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="col-span-2"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    onChange={() => submitForm()}
                                >
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
