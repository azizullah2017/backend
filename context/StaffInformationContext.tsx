"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type StaffInfoDTO = {
    bookingNumber: string;
    blNumber: string;
    containers: string;
};

export type StaffInformationType = {
    staffInfo: StaffInfoDTO;
    setStaffInfo: (arg: Object) => void;
};

const StaffInformationContext = createContext<StaffInformationType>({
    staffInfo: { bookingNumber: "", blNumber: "", containers: "" },
    setStaffInfo: (arg) => {},
});

const getFromLocalStorage = () => {
    const emptyStaffData: StaffInfoDTO = {
        bookingNumber: "",
        blNumber: "",
        containers: "",
    };

    if (typeof window !== "undefined") {
        const data = JSON.parse(localStorage.getItem("staff-data") as string);
        return data || emptyStaffData;
    }
};

export const StaffInformationContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [staffInfo, setStaffInfo] = useState(() => getFromLocalStorage());

    const value = {
        staffInfo,
        setStaffInfo,
    };

    useEffect(() => {
        localStorage.setItem("staff-data", JSON.stringify(staffInfo));
    }, [staffInfo]);

    return (
        <StaffInformationContext.Provider value={value}>
            {children}
        </StaffInformationContext.Provider>
    );
};

export const useStaffInformation = () => useContext(StaffInformationContext);
