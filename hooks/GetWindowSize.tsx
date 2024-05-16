import { useEffect, useLayoutEffect, useState } from "react";

const useGetWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (typeof window !== "undefined") {
        useLayoutEffect(() => {
            setWindowWidth(window.innerWidth);
        }, []);
    }

    return windowWidth;
};

export default useGetWindowWidth;
