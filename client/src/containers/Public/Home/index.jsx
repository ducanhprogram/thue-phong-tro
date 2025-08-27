import { Outlet } from "react-router-dom";
import Header from "../Header";

const Home = () => {
    return (
        <div className="h-full">
            <Header />
            <div className="w-[1100px] m-auto border border-red-500">
                <div className="w-full flex flex-col items-center justify-start">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Home;
