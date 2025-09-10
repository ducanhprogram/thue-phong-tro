import clsx from "clsx";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className={clsx(`${styles.footer} bg-yellow-100 py-12 px-6 mt-20`)}>
            <div className="max-w-7xl mx-auto">
                {/* Partner Sites */}
                <div className="text-center mb-10">
                    <p className="text-gray-600 mb-6 text-sm">Cũng hệ thống LBKCorp:</p>
                    <div className="flex justify-center items-center gap-4 flex-wrap">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-blue-500 font-bold">bds123.vn</span>
                            <p className="text-xs text-gray-500">Kênh nhà đất số 1 Việt Nam</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-red-500 font-bold">chothuenha.me</span>
                            <p className="text-xs text-gray-500">Kênh cho thuê nhà số 1 Việt Nam</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-blue-600 font-bold">thuecanho123.com</span>
                            <p className="text-xs text-gray-500">Kênh thuê căn hộ số 1 Việt Nam</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-orange-500 font-bold">chothuephongtro.me</span>
                            <p className="text-xs text-gray-500">Phòng trọ cho giới trẻ và sinh viên</p>
                        </div>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About PhongTro123 */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">VỀ PHONGTRO123.COM</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Giới thiệu
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Quy chế hoạt động
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Quy định sử dụng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Chính sách bảo mật
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Liên hệ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Customers */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">DÀNH CHO KHÁCH HÀNG</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Câu hỏi thường gặp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Hướng dẫn đăng tin
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Bảng giá dịch vụ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Quy định đăng tin
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                                    Giải quyết khiếu nại
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">PHƯƠNG THỨC THANH TOÁN</h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">MC</span>
                                </div>
                                <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">JCB</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-12 h-8 bg-pink-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">momo</span>
                                </div>
                                <div className="w-12 h-8 bg-blue-400 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Zalo</span>
                                </div>
                                <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">THEO DÕI PHONGTRO123.COM</h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                                <span className="text-white text-xs font-bold">Zalo</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.111.221.082.342-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="border-t border-gray-300 pt-8">
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3">CÔNG TY TNHH LBKCORP</h4>
                        <p className="text-gray-600 text-sm mb-2">
                            Căn 02-34, Lầu 2, Tháp 3, The Sun Avenue, Số 28 Mai Chí Thọ, Phường An Phú, Thành phố Thủ
                            Đức, Thành phố Hồ Chí Minh, Việt Nam.
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                            Tổng đài CSKH:{" "}
                            <a href="tel:0909316890" className="text-blue-600 hover:underline">
                                0909 316 890
                            </a>{" "}
                            - Email:{" "}
                            <a href="mailto:cskh.phongtro123@gmail.com" className="text-blue-600 hover:underline">
                                cskh.phongtro123@gmail.com
                            </a>
                        </p>
                        <p className="text-gray-600 text-sm">
                            Giấy phép đăng ký kinh doanh số 0313588502 do Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 24 tháng
                            12 năm 2015.
                        </p>
                    </div>

                    {/* Certification Badges */}
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center">
                            <img
                                src="https://phongtro123.com/images/bo-cong-thuong.png"
                                alt="Phongtro123.com đã đăng ký trên cổng Bộ Công Thương"
                                className="w-30 h-30 object-contain"
                            />
                        </div>

                        <div className="flex items-center">
                            <img
                                src="https://phongtro123.com/images/dmca-badge-w250-2x1-04.png"
                                alt="Phongtro123.com đã đăng ký trên cổng Bộ Công Thương"
                                className="w-25 h-20 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
