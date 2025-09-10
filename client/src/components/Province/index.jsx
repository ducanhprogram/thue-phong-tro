import clsx from "clsx";
import ProvinceBtn from "../ProvinceBtn";

const Province = () => {
    return (
        <div className={clsx(`flex items-center gap-5 justify-center py-5`)}>
            <ProvinceBtn />
        </div>
    );
};

export default Province;
