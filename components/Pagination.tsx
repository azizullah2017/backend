"use client";

import { Button } from "./ui/button";
import {
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardArrowLeft,
    MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationPropType = {
    itemCount: number;
    pageSize: number;
    currentPage: number;
};

const Pagination = ({
    itemCount,
    pageSize,
    currentPage,
}: PaginationPropType) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const pageCount = Math.ceil(itemCount / pageSize);
    if (pageCount <= 1) return null;

    const changePage = (page: number) => {
        // send and api call here
        params.set("page", page.toString());
        router.push("?" + params.toString());
    };

    return (
        <div className="flex items-center gap-2 mt-5">
            <div className="hidden md:block">
                Page {currentPage} of {pageCount}
            </div>
            <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => changePage(1)}
            >
                <MdKeyboardDoubleArrowLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
            >
                <MdKeyboardArrowLeft className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                disabled={currentPage === pageCount}
                onClick={() => changePage(currentPage + 1)}
            >
                <MdKeyboardArrowRight className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                disabled={currentPage === pageCount}
                onClick={() => changePage(pageCount)}
            >
                <MdKeyboardDoubleArrowRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default Pagination;
