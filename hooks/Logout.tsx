import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

const useLogout = () => {
    const { userData, setUserData } = useAuth();
    const router = useRouter();

    const logout = async () => {
        console.log("Running");
        const res = await fetch(`${BASE_URL}/api/auth/logout/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${userData?.token}`,
            },
        });

        if (!res.ok) {
            toast({
                title: "Alert",
                description: "Something went wrong!",
                className: "bg-red-200 border-none",
            });
        } else {
            setUserData({ token: "" });
            router.push("/login");
        }
    };

    return logout;
};

export default useLogout;
