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
        }, 250);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchText]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (debouncedText) {
            params.set("search", searchText);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
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
