import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPrices } from "./features/app/appSlice";
import { fetchAreas } from "./features/area/areaSlice";
import { fetchProvinces } from "./features/province/provinceSlice";
import { fetchPosts } from "./features/posts/postSlice";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPrices());
        dispatch(fetchAreas());
        dispatch(fetchProvinces());
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <div className="h-screen bg-primary">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
