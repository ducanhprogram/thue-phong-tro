import Navigation from "@/containers/Public/Navigation";
import ProtectedNavigation from "../ProtectedNavigation";

const Header = () => {
    return (
        <div className="w-full flex flex-none">
            <ProtectedNavigation />
        </div>
    );
};
export default Header;
