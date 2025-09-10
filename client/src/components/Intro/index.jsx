import clsx from "clsx";
import styles from "./Intro.module.scss";
import { useSelector } from "react-redux";
import { memo } from "react";
import { Link } from "react-router-dom";

const Intro = () => {
    const { categories } = useSelector((state) => state.app);
    return (
        <div className={clsx(`${styles.intro} bg-gray-50 py-3 px-6 shadow-md`)}>
            <div className="max-w-4xl mx-auto text-center">
                {/* Header */}
                <h2 className="text-xl font-bold text-gray-800 mb-6">Tại sao lại chọn PhongTro123.com?</h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng Phongtro123.com tự hào là trang web đứng top google
                    về các từ khóa:
                    <span className="text-blue-500 font-medium ">
                        {categories?.length > 0 &&
                            categories.map((item) => {
                                return (
                                    <Link
                                        to={item.slug}
                                        key={item.code}
                                        className="hover:text-[#FF5723]"
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        {item.value?.toLowerCase()},{" "}
                                    </Link>
                                );
                            })}
                    </span>
                    ...Vì vậy tin của bạn đăng trên website sẽ tiếp cận được với nhiều khách hàng hơn, do đó giao dịch
                    nhanh hơn, tiết kiệm chi phí hơn
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-12">
                    <div className="text-center">
                        <div className="text-xl font-bold text-orange-500 mb-2">116.998+</div>
                        <div className="text-gray-600 text-sm">Thành viên</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-orange-500 mb-2">103.348+</div>
                        <div className="text-gray-600 text-sm">Tin đăng</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-orange-500 mb-2">300.000+</div>
                        <div className="text-gray-600 text-sm">Lượt truy cập/tháng</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-orange-500 mb-2">2.500.000+</div>
                        <div className="text-gray-600 text-sm">Lượt xem/tháng</div>
                    </div>
                </div>

                {/* Quality & Reviews */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi phí thấp, hiệu quả tối đa</h3>

                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <blockquote className="italic text-gray-600 mb-4 max-w-3xl mx-auto">
                        "Trước khi biết website phongtro123, mình phải tốn nhiều công sức và chi phí cho việc đăng tin
                        cho thuê: từ việc phát tờ rơi, dán giấy, và đăng lên các website khác nhưng hiệu quả không cao.
                        Từ khi biết website phongtro123.com, mình đã thử đăng tin lên và đánh giá hiệu quả khá cao trong
                        khi chi phí khá thấp, không còn tình trạng phòng trống kéo dài."
                    </blockquote>

                    <cite className="text-gray-500 text-sm">Anh Khánh (chủ hệ thống phòng trọ tại Tp.HCM)</cite>
                </div>

                {/* Call to Action */}
                <div className="text-center pb-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Bạn đang có phòng trọ / căn hộ cho thuê?
                    </h3>
                    <p className="text-gray-600 mb-6">Không phải lo tìm người cho thuê, phòng trống kéo dài</p>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-200">
                        Đăng tin ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(Intro);
