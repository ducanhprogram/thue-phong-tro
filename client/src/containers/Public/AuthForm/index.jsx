import { useState } from "react";
import Login from "../Login";
import Register from "../Register";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);

    const switchToRegister = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {isLogin ? <Login onSwitchToRegister={switchToRegister} /> : <Register onSwitchToLogin={switchToLogin} />}
        </div>
    );
};

export default AuthForm;
