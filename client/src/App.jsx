import { Routes, Route, BrowserRouter } from "react-router-dom";

import AppRoutes from "./components/AppRoutes";
function App() {
    return (
        <div className="h-screen  bg-primary">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
