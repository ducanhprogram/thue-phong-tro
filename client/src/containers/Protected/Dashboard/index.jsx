import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../Header";
import clsx from "clsx";
import SideBar from "../SideBar/index.jsx";

const Dashboard = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace={true} />;
    }
    return (
        <div className={clsx(`w-full h-screen flex flex-col`)}>
            <Header />
            <div className="flex flex-auto min-h-0 relative">
                {/* SideBar fixed */}
                <div className="fixed left-0 top-[56px] h-[calc(100vh-56px)] z-10">
                    <SideBar />
                </div>
                {/* Content area với margin-left để tránh bị che bởi sidebar */}
                <div className="flex-auto bg-white shadow-md h-full p-4 ml-[260px] overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
