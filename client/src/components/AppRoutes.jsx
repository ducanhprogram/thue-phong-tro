import config from "@/config";
import CategoryPage from "@/containers/Public/CategoryPage";
import Home from "@/containers/Public/Home";
import Login from "@/containers/Public/Login";
import NotFound from "@/containers/Public/NotFound";
import PostDetail from "@/containers/Public/PostDetail";
import Register from "@/containers/Public/Register";
import HomePage from "@/pages/HomePage";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import { Route, Routes } from "react-router-dom";

function AppRoutes() {
    return (
        <Routes>
            <Route path={config.routes.home} element={<Home />}>
                <Route path={config.routes.homePage} element={<HomePage />}></Route>
                <Route path={config.routes.login} element={<Login />}></Route>
                <Route path={config.routes.register} element={<Register />}></Route>
                {/* <Route path={config.routes.chothuecanho} element={<ChoThueCanHo />}></Route>
                <Route path={config.routes.chothuematbang} element={<ChoThueMatBang />}></Route>
                <Route path={config.routes.chothuephongtro} element={<ChoThuePhongTro />}></Route>
                <Route path={config.routes.nhachothue} element={<NhaChoThue />}></Route> */}

                <Route path="/:categorySlug" element={<CategoryPage />} />
                <Route path={config.routes.postDetailTitlePostID} element={<PostDetail />}></Route>
            </Route>
            <Route path={config.routes.verifyEmail} element={<VerifyEmail />}></Route>
            <Route path={config.routes.resetPassword} element={<ResetPassword />}></Route>
            <Route path={config.routes.notFound} element={<NotFound />}></Route>
        </Routes>
    );
}

export default AppRoutes;
