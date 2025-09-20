import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchItem from "@/components/SearchItem";
import Modal from "@/components/Modal";
import icons from "@/utils/icons";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPostsLimit } from "@/features/posts/postSlice";
import { formatVietnameseToString } from "@/utils/formatVietNameseToString";

const { BsChevronRight, CiLocationOn, TbReportMoney, AiOutlineGateway, MdOutlineMapsHomeWork, FaSearch } = icons;

const Search = () => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [content, setContent] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // const { provinces } = useSelector((state) => state.provinces);
    const { provincesOld } = useSelector((state) => state.provinces);

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
                return queries.category || null;
            case "provinces":
                return queries.provinces || null;
            case "prices":
                return queries.prices || null;
            case "areas":
                return queries.areas || null;
            default:
                return null;
        }
    };

    // Hàm kiểm tra xem có phải giá trị mặc định không
    const isDefaultValue = (value) => {
        const defaultValues = ["Toàn quốc", "Mọi giá", "Mọi diện tích", "Tất cả"];
        return defaultValues.includes(value);
    };

    const handleSearch = () => {
        const queryCodes = Object.entries(queries)
            .filter((item) => item[0].includes("Code"))
            .reduce((acc, curr) => {
                // Nếu code là null (giá trị mặc định), không gửi lên server
                if (curr[1] !== null) {
                    acc[curr[0]] = curr[1];
                }
                return acc;
            }, {});

        // Tạo URL params cho tìm kiếm
        const newSearchParams = new URLSearchParams();

        // Thêm các filter codes
        if (queryCodes.pricesCode) {
            newSearchParams.set("priceCode", queryCodes.pricesCode);
        }
        if (queryCodes.areasCode) {
            newSearchParams.set("areaCode", queryCodes.areasCode);
        }
        if (queryCodes.provincesCode) {
            newSearchParams.set("provinceCode", queryCodes.provincesCode);
        }

        // Xử lý category - nếu có category được chọn, chuyển đến trang category đó
        if (queryCodes.categoryCode && queries.category && !isDefaultValue(queries.category)) {
            const categorySlug = formatVietnameseToString(queries.category);
            navigate(`/${categorySlug}?${newSearchParams.toString()}`);
        } else {
            // Nếu không có category cụ thể, ở lại trang hiện tại và update params
            navigate(`/?${newSearchParams.toString()}`);
        }

        // Gửi request lấy dữ liệu
        const searchParams = {
            priceCode: queryCodes.pricesCode || null,
            areaCode: queryCodes.areasCode || null,
            categoryCode: queryCodes.categoryCode || null,
            provinceCode: queryCodes.provincesCode || null,
            page: 1,
            limit: 10,
        };

        dispatch(fetchPostsLimit(searchParams));
    };

    // Hàm lấy text hiển thị cho SearchItem
    const getDisplayText = (queryKey) => {
        const value = queries[queryKey];
        if (!value || isDefaultValue(value)) {
            return null; // Sẽ hiển thị defaultText
        }
        return value;
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
                    text={getDisplayText("category")}
                    defaultText={"Phòng trọ, nhà trọ"}
                    onClick={() => handleItemClick(categories, "category")}
                />
                <SearchItem
                    IconBefore={<CiLocationOn />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={getDisplayText("provinces")}
                    defaultText={"Toàn quốc"}
                    onClick={() => handleItemClick(provincesOld, "provinces")}
                />
                <SearchItem
                    IconBefore={<TbReportMoney />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={getDisplayText("prices")}
                    defaultText={"Chọn giá"}
                    onClick={() => handleItemClick(prices, "prices")}
                />
                <SearchItem
                    IconBefore={<AiOutlineGateway />}
                    IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                    text={getDisplayText("areas")}
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
