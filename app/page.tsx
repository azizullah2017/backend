import Navbar from "./dashboard/Navbar";
import SideBar from "./dashboard/Sidebar";

export default function Home() {
    return (
        <div className="flex">
            <div className="flex-1 bg-white p-5">
                <SideBar />
            </div>
            <div className="flex-[4] p-5">
                <Navbar />
                <div>Dashboard</div>
            </div>
        </div>
    );
}
