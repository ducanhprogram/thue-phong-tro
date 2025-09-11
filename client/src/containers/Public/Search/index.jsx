import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchItem from "@/components/SearchItem";
import Modal from "@/components/Modal";
import icons from "@/utils/icons";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsLimit } from "@/features/posts/postSlice";

const { BsChevronRight, CiLocationOn, TbReportMoney, AiOutlineGateway, MdOutlineMapsHomeWork, FaSearch } = icons;

const Search = () => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [content, setContent] = useState([]);
    const [name, setName] = useState("");

    const { provinces } = useSelector((state) => state.provinces);
    const { areas } = useSelector((state) => state.areas);
    const { prices, categories } = useSelector((state) => state.app);
    const [queries, setQueries] = useState({});
    const dispatch = useDispatch();

    const handleItemClick = (itemType, name) => {
        setContent(itemType);
        setName(name);
        setIsShowModal(true);
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
    };

    const handleSubmit = useCallback((e, query) => {
        e.stopPropagation();
        setQueries((prev) => ({ ...prev, ...query }));
        setIsShowModal(false);
    }, []);

    // Lấy giá trị đã chọn dựa trên name hiện tại
    const getSelectedValue = () => {
        switch (name) {
            case "category":
                return queries.category;
            case "provinces":
                return queries.provinces;
            case "prices":
                return queries.prices;
            case "areas":
                return queries.areas;
            default:
                return null;
        }
    };

    const handleSearch = () => {
        const queryCodes = Object.entries(queries)
            .filter((item) => item[0].includes("Code"))
            .reduce((acc, curr) => {
                acc[curr[0]] = curr[1];
                return acc;
            }, {});

        const searchParams = {
            priceCode: queryCodes.pricesCode || null,
            areaCode: queryCodes.areasCode || null,
            categoryCode: queryCodes.categoryCode || null,
            provinceCode: queryCodes.provincesCode || null,
        };
        dispatch(fetchPostsLimit(searchParams)).unwrap();
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
                    text={queries.category}
                    defaultText={"Phòng trọ, nhà trọ"}
                    onClick={() => handleItemClick(categories, "category")}
                />
                <SearchItem
                    IconBefore={<CiLocationOn />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={queries.provinces}
                    defaultText={"Toàn quốc"}
                    onClick={() => handleItemClick(provinces, "provinces")}
                />
                <SearchItem
                    IconBefore={<TbReportMoney />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={queries.prices}
                    defaultText={"Chọn giá"}
                    onClick={() => handleItemClick(prices, "prices")}
                />
                <SearchItem
                    IconBefore={<AiOutlineGateway />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={queries.areas}
                    defaultText={"Chọn diện tích"}
                    onClick={() => handleItemClick(areas, "areas")}
                />
                <button
                    type="button"
                    className={clsx(`outline-none py-2 px-4 w-full ${styles.search_btn}`)}
                    onClick={handleSearch}
                >
                    <FaSearch />
                    Tìm kiếm
                </button>
            </div>
            {/* Chỉ hiển thị Modal khi isShowModal = true */}
            {isShowModal && (
                <Modal
                    content={content}
                    handleSubmit={handleSubmit}
                    name={name}
                    onClose={handleCloseModal}
                    selectedValue={getSelectedValue()}
                />
            )}
        </>
    );
};

export default Search;
