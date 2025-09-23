//PostDetail index.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, Phone, MapPin, Calendar, Home, Users, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchPostById, fetchRelatedPosts, clearPostDetail } from "@/features/posts/postSlice";
import { getTimeAgo } from "@/utils/timeUtils";
import formatDateTime from "@/utils/formatDateTime";
import Items from "@/components/Items";
import ItemsDetailPost from "@/components/ItemsDetailPost";

const PostDetail = () => {
    const { postId, title } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { postDetail, relatedPosts, postDetailLoading, relatedPostsLoading, error } = useSelector(
        (state) => state.posts,
    );

    // State cho image gallery
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (postId) {
            // Clear previous data
            dispatch(clearPostDetail());

            // Fetch post detail
            dispatch(fetchPostById(postId));
        }

        return () => {
            dispatch(clearPostDetail());
        };
    }, [dispatch, postId]);

    useEffect(() => {
        if (postDetail) {
            // Parse images
            let parsedImages = [];
            try {
                parsedImages =
                    typeof postDetail.images.image === "string"
                        ? JSON.parse(postDetail.images.image)
                        : postDetail.images.image;
            } catch (error) {
                console.error("Error parsing images:", error);
                parsedImages = [];
            }
            setImages(parsedImages);

            // Fetch related posts
            dispatch(
                fetchRelatedPosts({
                    postId: postDetail.id,
                    categoryCode: postDetail.categoryCode,
                    provinceCode: postDetail.provinceCode,
                    limit: 5,
                }),
            );
        }
    }, [postDetail, dispatch]);

    // Handle image navigation
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const openGallery = (index = 0) => {
        setCurrentImageIndex(index);
        setShowGallery(true);
        document.body.style.overflow = "hidden";
    };

    const closeGallery = () => {
        setShowGallery(false);
        document.body.style.overflow = "auto";
    };

    // Handle keyboard navigation in gallery
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!showGallery) return;

            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") closeGallery();
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [showGallery]);

    // Cleanup body overflow on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Parse description
    const parseDescription = (description) => {
        try {
            return typeof description === "string" ? JSON.parse(description) : description;
        } catch (error) {
            console.log(error);
            return description || "";
        }
    };

    // Create slug for related posts navigation
    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleRelatedPostClick = (relatedPost) => {
        const titleSlug = createSlug(relatedPost.title);
        window.scrollTo({ top: 0 });
        navigate(`/chi-tiet/${titleSlug}/${relatedPost.id}`);
    };

    if (postDetailLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                <span className="ml-3 text-gray-600">Đang tải chi tiết bài viết...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">404</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h1>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!postDetail) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Image Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 text-white hover:text-gray-300 z-10 border border-white rounded-full p-2 cursor-pointer"
                                >
                                    <ChevronLeft className="w-9 h-9" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 text-white hover:text-gray-300 z-10 border border-white rounded-full p-2 cursor-pointer"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Main image */}
                        <img
                            src={images[currentImageIndex]}
                            alt={`Ảnh ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Quay lại
                        </button>

                        {/* Image Gallery */}
                        <div className="mb-6">
                            {images.length > 0 && (
                                <>
                                    {/* Main Image Grid */}
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {/* Main large image */}
                                        <div className="col-span-3 row-span-2">
                                            <img
                                                src={images[0]}
                                                alt="Ảnh chính"
                                                className="w-full h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => openGallery(0)}
                                            />
                                        </div>

                                        {/* Secondary images */}
                                        {images.slice(1, 5).map((image, index) => (
                                            <div key={index + 1} className="relative">
                                                <img
                                                    src={image}
                                                    alt={`Ảnh ${index + 2}`}
                                                    className="w-full h-[156px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => openGallery(index + 1)}
                                                />
                                                {index === 3 && images.length > 5 && (
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer"
                                                        onClick={() => openGallery(4)}
                                                    >
                                                        <span className="text-white font-semibold text-sm">
                                                            +{images.length - 4} ảnh
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Thumbnail Strip */}
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.slice(0, 10).map((image, index) => (
                                            <div
                                                key={index}
                                                className={`flex-shrink-0 relative cursor-pointer transition-all ${
                                                    currentImageIndex === index
                                                        ? "ring-2 ring-blue-500 opacity-100"
                                                        : "opacity-70 hover:opacity-100"
                                                }`}
                                                onClick={() => openGallery(index)}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-16 h-16 object-cover rounded border-2 border-white shadow-sm"
                                                />
                                                {index === 9 && images.length > 10 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded text-white text-xs font-medium">
                                                        +{images.length - 9}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* View all photos button */}
                                    <button
                                        onClick={() => openGallery(0)}
                                        className="mt-3 flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem tất cả {images.length} ảnh
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* Title and Rating */}
                            <div className="mb-4">
                                <div className="flex items-center gap-1 mb-2">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            className={`w-4 h-4 ${
                                                index < postDetail.star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-gray-200 text-gray-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <h1 className="text-2xl font-bold text-red-600 uppercase mb-2">{postDetail.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                        {postDetail.overviews?.code}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDateTime(postDetail.createdAt)}</span>
                                </div>
                            </div>

                            {/* Price and Address */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-6 text-lg">
                                    <span className="text-green-600 font-bold text-2xl">
                                        {postDetail.attributes?.price}
                                    </span>
                                    <span className="text-gray-600">{postDetail.attributes?.acreage}</span>
                                </div>
                                <div className="flex items-start gap-2 mt-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{postDetail.address}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Thông tin mô tả</h3>
                                <div className="prose max-w-none text-gray-700 leading-relaxed">
                                    <p className="whitespace-pre-wrap">{parseDescription(postDetail.description)}</p>
                                </div>
                            </div>

                            {/* Overview Info */}
                            {postDetail.overviews && (
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Đặc điểm tin đăng</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <Home className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <span className="text-sm text-gray-500">Loại tin</span>
                                                <p className="font-medium">{postDetail.overviews.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <span className="text-sm text-gray-500">Đối tượng</span>
                                                <p className="font-medium">{postDetail.overviews.target}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <span className="text-sm text-gray-500">Ngày hết hạn</span>
                                                <p className="font-medium">
                                                    {formatDateTime(postDetail.overviews.expired)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <span className="text-sm text-gray-500">Khu vực</span>
                                                <p className="font-medium">{postDetail.overviews.area}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="lg:col-span-1">
                        {/* Contact Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                                    {postDetail.user?.avatar ? (
                                        <img
                                            src={postDetail.user.avatar}
                                            alt={postDetail.user.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span>👤</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{postDetail.user?.name}</h4>
                                    <p className="text-sm text-gray-500">Đã đăng {getTimeAgo(postDetail.createdAt)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
                                    <Phone className="w-4 h-4" />
                                    {postDetail.user?.phone}
                                </button>
                                <button className="w-full border border-green-500 text-green-500 hover:bg-green-50 py-3 px-4 rounded-lg font-medium transition-colors">
                                    Nhắn tin
                                </button>
                            </div>

                            {/* Additional info */}
                            <div className="mt-6 pt-4 border-t space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Mã tin:</span> {postDetail.overviews?.code}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Loại tin:</span> {postDetail.overviews?.bonus}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Hashtag:</span> #{postDetail.attributes?.hashtag}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Tin đăng liên quan</h2>
                        {relatedPostsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                <span className="ml-2">Đang tải...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => handleRelatedPostClick(post)}
                                        className="cursor-pointer"
                                    >
                                        <ItemsDetailPost
                                            address={post.address}
                                            attributes={post.attributes}
                                            description={parseDescription(post.description)}
                                            images={post.images.image}
                                            star={+post.star}
                                            title={post.title}
                                            user={post.user}
                                            createdAt={post.createdAt}
                                            id={post.id}
                                            onClick={() => handleRelatedPostClick(post)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;
