import clsx from "clsx";
import styles from "./Contact.module.scss";

const Contact = () => {
    return (
        <div className={clsx(`${styles.contact} bg-gray-50 py-10 px-6 shadow-md`)}>
            <div className="max-w-6xl mx-auto">
                {/* Illustration */}
                <div className="text-center mb-8">
                    <img
                        src="https://phongtro123.com/images/support-bg.jpg"
                        alt="Support Team"
                        className="mx-auto mb-6 max-w-md w-full"
                    />
                    <p className="text-gray-600 text-lg mb-8">Liên hệ với chúng tôi nếu bạn cần hỗ trợ:</p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {/* Support Payment */}
                    <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wide">
                            HỖ TRỢ THANH TOÁN
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-700 font-semibold">
                                Điện thoại: <span className="text-blue-600">0917686101</span>
                            </p>
                            <p className="text-gray-700 font-semibold">
                                Zalo: <span className="text-blue-600">0917686101</span>
                            </p>
                        </div>
                    </div>

                    {/* Support Posting */}
                    <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wide">
                            HỖ TRỢ ĐĂNG TIN
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-700 font-semibold">
                                Điện thoại: <span className="text-blue-600">0902657123</span>
                            </p>
                            <p className="text-gray-700 font-semibold">
                                Zalo: <span className="text-blue-600">0902657123</span>
                            </p>
                        </div>
                    </div>

                    {/* Hotline 24/7 */}
                    <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wide">HOTLINE 24/7</h3>
                        <div className="space-y-2">
                            <p className="text-gray-700 font-semibold">
                                Điện thoại: <span className="text-blue-600">0917686101</span>
                            </p>
                            <p className="text-gray-700 font-semibold">
                                Zalo: <span className="text-blue-600">0917686101</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Button */}
                <div className="text-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md">
                        Gửi liên hệ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contact;
