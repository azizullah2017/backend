import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TableFilter = ({ setData }: { setData: () => void }) => {
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedText, setDebouncedText] = useState<string>("");

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedText(searchText);
        }, 500);

        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (searchText) {
            params.set("search", searchText);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchText]);

    useEffect(() => {
        console.log("API Call here!");
        // setData();
    }, [debouncedText]);

    return (
        <div>
            <Input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
            />
        </div>
    );
};

export default TableFilter;
