import Navbar from "./Navbar";
import SideBar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <div className="flex-1 bg-white p-5">
                <SideBar />
            </div>
            <div className="flex-[4] p-5">
                <Navbar />
                {children}
            </div>
        </div>
    );
};

export default Layout;
