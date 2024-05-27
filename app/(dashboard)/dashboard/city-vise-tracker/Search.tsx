"use client";

import React, { useState } from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const OPTIONS: Option[] = [
    { label: "nextjs", value: "Nextjs" },
    { label: "React", value: "react" },
    { label: "Remix", value: "remix" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
];

const mockSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!value) {
                resolve(OPTIONS);
            }
            const res = OPTIONS.filter((option) =>
                option.value.includes(value)
            );
            resolve(res);
        }, 1000);
    });
};

const MultipleSelectorWithAsyncSearchAndOnFocus = () => {
    const [isTriggered, setIsTriggered] = useState(false);

    return (
        <div className="flex w-full flex-col gap-5 px-10">
            <MultipleSelector
                onSearch={async (value) => {
                    setIsTriggered(true);
                    const res = await mockSearch(value);
                    setIsTriggered(false);
                    return res;
                }}
                triggerSearchOnFocus
                placeholder="trying to search 'a' to get more options..."
                loadingIndicator={
                    <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                        loading...
                    </p>
                }
                emptyIndicator={
                    <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                        no results found.
                    </p>
                }
            />
        </div>
    );
};

export default MultipleSelectorWithAsyncSearchAndOnFocus;
