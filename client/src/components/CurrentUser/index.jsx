import { useSelector } from "react-redux";

const CurrentUser = ({ transparent = false }) => {
    const { profileUser } = useSelector((state) => state.auth);

    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg relative ${
                transparent ? "bg-white/10 backdrop-blur-sm border border-white/20 justify-start" : "bg-gray-100"
            }`}
        >
            <img
                src={profileUser?.avatar || "https://phongtro123.com/images/default-user.svg"}
                alt="avatar"
                className="w-10 object-cover h-10 rounded-full"
            />
            <div className="flex flex-col">
                <span className={`text-sm ${transparent ? "text-white/90" : "text-gray-700"}`}>
                    Xin chào,{" "}
                    <span className={`font-semibold ${transparent ? "text-white" : ""}`}>
                        {profileUser?.name || profileUser?.email}
                    </span>
                </span>
                <span className={`text-xs ${transparent ? "text-white/70" : "text-gray-500"}`}>
                    Mã tài khoản: {profileUser?.id}
                </span>
            </div>
        </div>
    );
};

export default CurrentUser;
