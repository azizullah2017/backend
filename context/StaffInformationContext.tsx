"use client";

import React, { createContext, useContext, useState } from "react";

const StaffInformationContext = createContext({
    staffInfo: {},
    setStaffInfo: () => {},
});

export const StaffInformationContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [staffInfo, setStaffInfo] = useState({});

    const value = {
        staffInfo,
        setStaffInfo,
    };

    return (
        <StaffInformationContext.Provider value={value}>
            {children}
        </StaffInformationContext.Provider>
    );
};

export const useStaffInformation = () => useContext(StaffInformationContext);
