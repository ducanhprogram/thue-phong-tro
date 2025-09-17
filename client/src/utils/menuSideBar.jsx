import { HiMiniPencilSquare } from "react-icons/hi2";
import { RiTodoLine } from "react-icons/ri";
import { FaUserCog } from "react-icons/fa";

const menuSideBar = [
    {
        id: 1,
        text: "Đăng tin cho thuê",
        path: "/dashboard/tao-tin-dang",
        icon: <HiMiniPencilSquare size={"18px"} />,
    },
    {
        id: 2,
        text: "Quản lý tin đăng",
        path: "/dashboard/quan-ly-tin-dang",
        icon: <RiTodoLine size={"18px"} />,
    },
    {
        id: 3,
        text: "Sửa thông tin cá nhân",
        path: "/dashboard/sua-thong-tin-ca-nhan",
        icon: <FaUserCog size={"18px"} />,
    },
    {
        id: 4,
        text: "Liên Hệ",
        path: "/dashboard/lien-he",
        icon: <FaUserCog size={"18px"} />,
    },
];

export default menuSideBar;
