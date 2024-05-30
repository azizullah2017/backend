import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

const useLogout = (tokenExpire: boolean = false) => {
    const { userData, setUserData } = useAuth();
    const router = useRouter();

    const logout = async () => {
        if (!tokenExpire) {
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
        } else {
            setUserData({ token: "" });
            router.push("/login");
        }
    };

    return logout;
};

export default useLogout;
