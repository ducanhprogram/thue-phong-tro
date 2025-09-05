import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchItem from "@/components/SearchItem";
import icons from "@/utils/icons";

const { BsChevronRight, CiLocationOn, TbReportMoney, AiOutlineGateway, MdOutlineMapsHomeWork, FaSearch } = icons;

const Search = () => {
    return (
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
            />
            <SearchItem
                IconBefore={<CiLocationOn />}
                IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                text="Toàn quốc"
            />
            <SearchItem
                IconBefore={<TbReportMoney />}
                IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                text="Toàn giá"
            />
            <SearchItem
                IconBefore={<AiOutlineGateway />}
                IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
                text="Chọn diện tích"
            />
            <button type="button" className={clsx(`outline-none py-2 px-4 w-full ${styles.search_btn}`)}>
                <FaSearch />
                Tìm kiếm
            </button>
        </div>
    );
};

export default Search;
