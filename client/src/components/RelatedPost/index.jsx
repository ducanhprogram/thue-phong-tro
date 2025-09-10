import { useDispatch, useSelector } from "react-redux";
import RecentItem from "../RecentItem";
import { useEffect } from "react";
import { fetchNewPosts } from "@/features/posts/postSlice";
import { formatRelativeTime } from "@/utils/formateDate";

const RelatedPost = () => {
    const dispatch = useDispatch();
    const { newPosts } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchNewPosts());
    }, [dispatch]);

    // Hàm lấy URL hình ảnh đầu tiên
    const getFirstImage = (imageString) => {
        try {
            if (!imageString) return "https://via.placeholder.com/70x60"; // Hình ảnh mặc định
            const images = JSON.parse(imageString);
            return Array.isArray(images) && images.length > 0 ? images[0] : "https://via.placeholder.com/70x60";
        } catch (error) {
            console.error("Error parsing images:", error);
            return "https://via.placeholder.com/70x60"; // Hình ảnh mặc định nếu parse lỗi
        }
    };
    return (
        <div className="w-full bg-white rounded-md p-4">
            <h3 className="font-medium text-sm">Tin mới đăng</h3>
            <div className="w-full">
                <RecentItem
                    title="Cho thuê nhà mặt tiền Kd p. Phú Thọ Hòa,Tân Phú dtsd 60 m2 chỉ 7triệu"
                    price="40 triệu/tháng"
                    createdAt="Hôm nay"
                />
                {newPosts?.length > 0 &&
                    newPosts.map((post) => {
                        return (
                            <RecentItem
                                key={post.id}
                                title={post.title}
                                price={post.attributes.price}
                                image={getFirstImage(post.images?.image)}
                                createdAt={formatRelativeTime(post.createdAt)}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default RelatedPost;
