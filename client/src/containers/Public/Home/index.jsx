import { Outlet } from "react-router-dom";
import Header from "../Header";
import styles from "./Home.module.scss";
import clsx from "clsx";
import Search from "../Search";
import Intro from "@/components/Intro";
import Contact from "@/components/Contact";
import Footer from "../Footer";

const Home = () => {
    return (
        <div className={clsx(`h-full w-full`)}>
            <Header />
            <Search />
            <main className="flex flex-col items-center justify-center">
                <div className={clsx(`w-full flex flex-col justify-start ${styles.row}`)}>
                    <Outlet />
                </div>
                <Intro />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
