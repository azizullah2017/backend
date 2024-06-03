"use client";

import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export type UserDTO = {
    token: string;
    username: string;
    role: string;
    companyName: string;
    mobileNumber: string;
    email: string;
    uid: string;
};
type AuthContextType = {
    userData: UserDTO;
    setUserData: (arg: UserDTO) => void;
    isAuthenticated: boolean | null;
    setIsAuthenticated: (arg: boolean | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    userData: {
        token: "",
        username: "",
        role: "",
        companyName: "",
        email: "",
        mobileNumber: "",
        uid: "",
    },
    setUserData: (arg: UserDTO) => {},
    isAuthenticated: null,
    setIsAuthenticated: (arg: boolean | null) => {},
});

const getFromLocalStorage = () => {
    const emptyUserData: UserDTO = {
        token: "",
        username: "",
        role: "",
        companyName: "",
        email: "",
        mobileNumber: "",
        uid: "",
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            if (userData?.token === "") {
                setIsAuthenticated(false);
                router.push("/login");
                return;
            }

            const res = await fetch(
                `${BASE_URL}/api/chart?get=eachstatus&filter=monthly&company_name=${userData?.companyName}`,
                {
                    headers: {
                        Authorization: `Token ${userData.token}`,
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 401) {
                    setIsAuthenticated(false);
                    setUserData({ token: "" });
                    router.push("/login");
                }
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuthentication();
    }, [router, isAuthenticated]);

    const value = {
        userData,
        setUserData,
        isAuthenticated,
        setIsAuthenticated,
    };

    useEffect(() => {
        localStorage.setItem("user-data", JSON.stringify(userData));
    }, [userData]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
