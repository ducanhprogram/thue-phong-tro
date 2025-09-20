import { Outlet } from "react-router-dom";
import Header from "../Header";
import styles from "./Home.module.scss";
import clsx from "clsx";
import Search from "../Search";
import Intro from "@/components/Intro";
import Contact from "@/components/Contact";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "@/features/auth/authSlice";

const Home = () => {
    const { isLoggedIn, profileUser, accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn && accessToken) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, isLoggedIn, accessToken]);

    useEffect(() => {
        console.log("Profile user updated:", profileUser);
    }, [profileUser]);

    return (
        <div className={clsx(`h-full w-full pt-32`)}>
            <Header />
            {isLoggedIn && <Search />}
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
