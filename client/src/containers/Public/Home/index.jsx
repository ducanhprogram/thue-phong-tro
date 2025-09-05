import { Outlet } from "react-router-dom";
import Header from "../Header";
import styles from "./Home.module.scss";
import clsx from "clsx";
import Search from "../Search";
import Navigation from "../Navigation";

const Home = () => {
    return (
        <div className={clsx(`h-full w-full`)}>
            <Header />
            <Search />
            <main>
                <div className={clsx(`w-full flex flex-col justify-start ${styles.row}`)}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Home;
