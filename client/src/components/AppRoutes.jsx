import config from "@/config";
import Home from "@/containers/Public/Home";
import Login from "@/containers/Public/Login";
import Register from "@/containers/Public/Register";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import { Route, Routes } from "react-router-dom";

function AppRoutes() {
    return (
        <Routes>
            <Route path={config.routes.home} element={<Home />}>
                <Route path={config.routes.login} element={<Login />}></Route>
                <Route path={config.routes.register} element={<Register />}></Route>
            </Route>
            <Route path={config.routes.verifyEmail} element={<VerifyEmail />}></Route>
            <Route path={config.routes.resetPassword} element={<ResetPassword />}></Route>
        </Routes>
    );
}

export default AppRoutes;
