"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type UserDTO = {
    token: string;
    username: string;
    role: string;
    companyName: string;
};
type AuthContextType = {
    userData: UserDTO;
    setUserData: (arg: UserDTO) => void;
};

const AuthContext = createContext<AuthContextType>({
    userData: { token: "", username: "", role: "", companyName: "" },
    setUserData: (arg: UserDTO) => {},
});

const getFromLocalStorage = () => {
    const emptyUserData: UserDTO = {
        token: "",
        username: "",
        role: "",
        companyName: "",
    };

    if (typeof window !== "undefined") {
        const data = JSON.parse(localStorage.getItem("user-data") as string);
        return data || emptyUserData;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<UserDTO>(() =>
        getFromLocalStorage()
    );

    const value = {
        userData,
        setUserData,
    };

    useEffect(() => {
        localStorage.setItem("user-data", JSON.stringify(userData));
    }, [userData]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
