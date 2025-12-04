// app/product/[id].tsx
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import IconButton from "@/components/common/IconButton";
import ProductDetailView, {
  ProductFull,
} from "@/components/screens/product/ProductDetail";
import ProductReviewList from "@/components/screens/product/ProductReviewList";
import ReviewBottomSheet from "@/components/screens/product/ReviewBottomSheet";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";

// Import API
import { AppConfig } from "@/constants/AppConfig";
import {
  createReviewAPI,
  deleteReviewAPI,
  getBestPromotionByProductId,
  getProductDetailAPI,
  getProductImagesAPI,
  getReviewsByProductIdAPI,
  updateReviewAPI,
} from "@/service/api";
import { COLORS } from "@/theme/tokens";

// 🛠️ Helper: Hàm xử lý ảnh đa năng
const getFullImageUrl = (fileName: string | null, baseUrl: string) => {
  if (!fileName) return "";
  const slash = baseUrl.endsWith("/") ? "" : "/";
  return `${baseUrl}${slash}${fileName}`;
};

// 🛠️ Helper: Parse Description JSON
const parseDescription = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item: any) => `- ${item.header || ""}: ${item.content || ""}`)
        .join("\n");
    }
    return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
  } catch (e) {
    return jsonString || "Không có mô tả.";
  }
};

// 🛠️ Helper: Format Date
const formatDate = (isoString: string | null) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("vi-VN");
};

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { showToast } = useToast();

  const productIdAsNumber = id ? parseInt(id, 10) : NaN;

  // --- STATE PRODUCT ---
  const [productDetail, setProductDetail] = useState<any>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [promotion, setPromotion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE REVIEW ---
  const [reviews, setReviews] = useState<IResReviewDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Modal State
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // State để quản lý việc Sửa đánh giá
  const [editingReview, setEditingReview] = useState<{
    id: number;
    comment: string;
    rating: number;
  } | null>(null);

  // --- 1. LẤY USER ID TỪ ASYNC STORAGE ---
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userInfo"); // Key lưu thông tin user khi login
        if (userStr) {
          const user = JSON.parse(userStr);
          // Kiểm tra cấu trúc object user của bạn để lấy đúng ID (id hoặc user_id)
          setCurrentUserId(user.id || user.user_id);
        }
      } catch (e) {
        console.log("Lỗi lấy thông tin user:", e);
      }
    };
    getUserInfo();
  }, []);

  // --- 2. GỌI API PRODUCT DETAIL ---
  const fetchProductData = useCallback(
    async (isBackground = false) => {
      if (Number.isNaN(productIdAsNumber)) {
        setIsLoading(false);
        return;
      }

      // ✅ SỬA: Chỉ hiện loading nếu không phải là chạy ngầm
      if (!isBackground) {
        setIsLoading(true);
        setProductDetail(null); // Xóa data cũ để hiện loading sạch
        setProductImages([]);
        setPromotion(null);
      }

      try {
        const [detailRes, imagesRes, promoRes] = await Promise.allSettled([
          getProductDetailAPI(productIdAsNumber),
          getProductImagesAPI(productIdAsNumber),
          getBestPromotionByProductId(productIdAsNumber),
        ]);

        if (detailRes.status === "fulfilled" && detailRes.value.data.data) {
          setProductDetail(detailRes.value.data.data);
        }

        if (imagesRes.status === "fulfilled" && imagesRes.value.data.data) {
          setProductImages(imagesRes.value.data.data);
        }

        if (promoRes.status === "fulfilled" && promoRes.value.data.data) {
          setPromotion(promoRes.value.data.data);
        }
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu sản phẩm:", error);
        showToast("error", "Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        // ✅ SỬA: Chỉ tắt loading nếu trước đó đã bật
        if (!isBackground) setIsLoading(false);
      }
    },
    [productIdAsNumber, showToast]
  );

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // --- 3. FETCH REVIEWS (Có phân trang) ---
  const fetchReviews = async (pageNumber: number, isRefresh = false) => {
    if (Number.isNaN(productIdAsNumber)) return;

    setIsLoadingReviews(true);
    try {
      // Gọi API: productId, page, size=5 (mỗi lần tải 5 comment)
      const res = await getReviewsByProductIdAPI(
        productIdAsNumber,
        pageNumber,
        5
      );

      if (res.data && res.data.data && res.data.data.result) {
        const newReviews = res.data.data.result; // ✅ Truy cập vào data bên trong
        const meta = res.data.data.meta; // ✅ Truy cập vào data bên trong

        setTotalPages(meta.pages);
        setTotalElements(meta.total);

        if (isRefresh) {
          setReviews(newReviews);
        } else {
          setReviews((prev) => [...prev, ...newReviews]);
        }
      }
    } catch (error) {
      console.log("Lỗi tải reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Load reviews lần đầu (trang 0) khi vào màn hình
  useEffect(() => {
    fetchReviews(0, true);
  }, [productIdAsNumber]);

  // Handle Load More (Xem thêm)
  const handleLoadMoreReviews = () => {
    if (page < totalPages - 1 && !isLoadingReviews) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReviews(nextPage, false);
    }
  };

  // --- 4. CÁC HÀM CRUD REVIEW ---

  // Mở modal để VIẾT MỚI
  const handleOpenWriteReview = () => {
    if (!currentUserId) {
      showToast("warning", "Vui lòng đăng nhập để đánh giá");
      // Có thể thêm logic redirect sang trang Login nếu cần
      return;
    }
    setEditingReview(null); // Reset mode edit
    setReviewError(null);
    setIsReviewModalVisible(true);
  };

  // Mở modal để SỬA
  const handleOpenEditReview = (
    id: number,
    comment: string,
    rating: number
  ) => {
    setEditingReview({ id, comment, rating });
    setReviewError(null);
    setIsReviewModalVisible(true);
  };

  const handleCloseReviewModal = () => setIsReviewModalVisible(false);

  // Xử lý Submit (Create hoặc Update)
  const handleSubmitReview = async (rating: number, comment: string) => {
    if (rating === 0 || !comment.trim()) {
      setReviewError("Vui lòng đánh giá sao và nhập nội dung.");
      return;
    }

    if (!currentUserId) return;

    try {
      if (editingReview) {
        // --- LOGIC SỬA ---
        const res = await updateReviewAPI(editingReview.id, {
          rating,
          comment,
        });
        if (res.data) {
          showToast("success", "Cập nhật đánh giá thành công");

          // Cập nhật list review local (để phản hồi nhanh UI)
          setReviews((prev) =>
            prev.map((r) =>
              r.id === editingReview.id ? { ...r, rating, comment } : r
            )
          );

          // ✅ THÊM DÒNG NÀY: Load lại Product Detail để cập nhật rating_avg mới
          await fetchProductData(true);
        }
      } else {
        // --- LOGIC THÊM MỚI ---
        const payload = {
          productId: productIdAsNumber,
          userId: currentUserId,
          rating,
          comment,
        };
        const res = await createReviewAPI(payload);
        if (res.data) {
          showToast("success", "Đánh giá thành công");

          // Reload review list
          setPage(0);
          fetchReviews(0, true);

          // ✅ THÊM DÒNG NÀY: Load lại Product Detail để cập nhật rating_avg mới
          await fetchProductData(true);
        }
      }
      setIsReviewModalVisible(false);
    } catch (error: any) {
      console.log("Error submitting review:", error);
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      setReviewError(msg);
    }
  };

  // XÓA Review
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviewAPI(reviewId);
      showToast("success", "Đã xóa đánh giá");

      // Xóa khỏi state local
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalElements((prev) => prev - 1);

      // ✅ THÊM DÒNG NÀY: Load lại Product Detail để cập nhật rating_avg mới
      await fetchProductData(true);
    } catch (error) {
      console.log("Error deleting review:", error);
      showToast("error", "Không thể xóa đánh giá này");
    }
  };

  // --- 5. LOGIC CART ---
  const handleAddToCart = (quantity: number) => {
    if (!productDetail) return;
    addToCart(productDetail, quantity);
    showToast("success", "Đã thêm vào giỏ hàng!");
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- MAPPING DATA ---
  const transformedProduct: ProductFull | null = productDetail
    ? {
        product_id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        salePrice: promotion ? promotion.finalPrice : undefined,
        rating_avg: productDetail.rating_avg,

        image: {
          uri: getFullImageUrl(productDetail.image, AppConfig.PRODUCTS_URL),
        },

        images: productImages
          .filter((img) => img.imgUrl && img.imgUrl.trim() !== "")
          .map((img) => ({
            image_id: img.id,
            image_url: {
              uri: getFullImageUrl(img.imgUrl, AppConfig.PRODUCTS_URL),
            },
          })),

        description: parseDescription(productDetail.description),
        unit: productDetail.unit,
        origin_address: productDetail.origin_address,
        quantity: productDetail.quantity,
        mfg_date: formatDate(productDetail.mfgDate),
        exp_date: formatDate(productDetail.expDate),

        certificates: productDetail.certificates.map((cert: any) => ({
          certificate_id: cert.id,
          name: cert.name,
          logo_url: { uri: getFullImageUrl(cert.image, AppConfig.CERT_URL) },
          document_url: {
            uri: getFullImageUrl(cert.imageUrl, AppConfig.CERT_URL),
          },
          certNo: cert.certNo,
          date: formatDate(cert.date),
        })),
      }
    : null;

  // --- RENDER ---
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!transformedProduct) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProductDetailView
        product={transformedProduct}
        onBackPress={router.back}
        onAddToCart={handleAddToCart}
        headerRight={
          <IconButton
            icon="cart-outline"
            onPress={() => router.push("/cart/CartScreen")}
            color={COLORS.PRIMARY}
            badge={cartItemCount > 0}
            badgeContent={cartItemCount > 99 ? "99+" : cartItemCount}
          />
        }
      >
        <ProductReviewList
          reviews={reviews}
          averageRating={productDetail.rating_avg}
          totalReviews={totalElements} // Sử dụng tổng số review từ API
          currentUserId={currentUserId}
          onWriteReview={handleOpenWriteReview}
          onEditReview={handleOpenEditReview}
          onDeleteReview={handleDeleteReview}
          // Props Phân trang
          onLoadMore={handleLoadMoreReviews}
          isLoadingMore={isLoadingReviews}
          hasMore={page < totalPages - 1}
        />
      </ProductDetailView>

      <ReviewBottomSheet
        visible={isReviewModalVisible}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        errorMessage={reviewError}
        onClearError={() => setReviewError(null)}
        // Truyền giá trị cũ nếu đang ở chế độ Edit (đảm bảo ReviewBottomSheet đã hỗ trợ các props này)
        initialComment={editingReview?.comment}
        initialRating={editingReview?.rating}
      />
    </View>
  );
};

export default ProductDetailScreen;
