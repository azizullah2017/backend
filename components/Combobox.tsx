"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

type ComboboxType = {
    currentItem: string;
    itemsArray: string[];
    itemNotSelectedMessage: string;
    commandEmptyMessage: string;
    setCurrentItem: (arg: string) => void;
    btnWidth: string;
    editing?: boolean;
};

const Combobox = ({
    currentItem,
    itemsArray,
    itemNotSelectedMessage,
    commandEmptyMessage,
    setCurrentItem,
    btnWidth,
    editing = false,
}: ComboboxType) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`${btnWidth} justify-between`}
                    >
                        {currentItem && editing
                            ? currentItem
                            : currentItem
                            ? itemsArray.find((item) => item === currentItem)
                            : itemNotSelectedMessage}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={`${btnWidth} p-0`}>
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>{commandEmptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {itemsArray.map((item) => (
                                    <CommandItem
                                        key={item}
                                        value={item}
                                        onSelect={(currentValue) => {
                                            setCurrentItem(
                                                currentValue === currentItem
                                                    ? ""
                                                    : currentValue
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currentItem === item
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {item}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default Combobox;
