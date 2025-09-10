import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchItem from "@/components/SearchItem";
import Modal from "@/components/Modal";
import icons from "@/utils/icons";
import { useState } from "react";
import { useSelector } from "react-redux";

const { BsChevronRight, CiLocationOn, TbReportMoney, AiOutlineGateway, MdOutlineMapsHomeWork, FaSearch } = icons;

const Search = () => {
    const [isShowModal, setShowModal] = useState(false);
    const [content, setContent] = useState([]);
    const [name, setName] = useState("");

    const { provinces } = useSelector((state) => state.provinces);
    const { areas } = useSelector((state) => state.areas);
    const { prices, categories } = useSelector((state) => state.app);

    const handleItemClick = (itemType, name) => {
        setContent(itemType);
        setName(name);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div
                className={clsx(
                    `h-[55px] p-[10px] bg-[#febb02] rounded-lg flex items-center justify-around text-sm gap-2 ${styles.search}`,
                )}
            >
                <SearchItem
                    fontWeight
                    IconBefore={<MdOutlineMapsHomeWork />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text="Phòng trọ, nhà trọ"
                    onClick={() => handleItemClick(categories, "category")}
                />
                <SearchItem
                    IconBefore={<CiLocationOn />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text="Toàn quốc"
                    onClick={() => handleItemClick(provinces, "provinces")}
                />
                <SearchItem
                    IconBefore={<TbReportMoney />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text="Toàn giá"
                    onClick={() => handleItemClick(prices, "prices")}
                />
                <SearchItem
                    IconBefore={<AiOutlineGateway />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text="Chọn diện tích"
                    onClick={() => handleItemClick(areas, "areas")}
                />
                <button type="button" className={clsx(`outline-none py-2 px-4 w-full ${styles.search_btn}`)}>
                    <FaSearch />
                    Tìm kiếm
                </button>
            </div>

            {/* Chỉ hiển thị Modal khi isShowModal = true */}
            {isShowModal && <Modal content={content} name={name} onClose={handleCloseModal} />}
        </>
    );
};

export default Search;
