// app/product/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

import IconButton from "@/components/common/IconButton";
import ProductDetailView from "@/components/screens/product/ProductDetail";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
import { mockProducts, mockReviews, mockUsers } from "@/data/mockData";

import { COLORS } from "@/theme/tokens";
// ✨ FontAwesome không cần thiết ở đây nữa (đã chuyển xuống component con)
// import { FontAwesome } from "@expo/vector-icons";
import ProductReviewList from "@/components/screens/product/ProductReviewList";
import ReviewBottomSheet from "@/components/screens/product/ReviewBottomSheet";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  const productIdAsNumber = id ? parseInt(id, 10) : NaN;

  const product = mockProducts.find((p) => p.product_id === productIdAsNumber);

  // --- reviews state (giữ nguyên)
  const [productReviews, setProductReviews] = useState(() => {
    if (Number.isNaN(productIdAsNumber)) return [];
    return mockReviews
      .filter((r) => r.product_id === productIdAsNumber)
      .map((r) => {
        const user = mockUsers.find((u) => u.user_id === r.customer_user_id);
        return {
          ...r,
          user_name: user?.name ?? "Ẩn danh",
          user_avatar: user?.avatar_url ?? "https://i.pravatar.cc/150",
        };
      });
  });
  const [averageRating, setAverageRating] = useState(product?.rating_avg ?? 0);

  // --- review modal state
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  // ✨ 1. Thêm state lỗi
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleOpenReviewModal = () => {
    setReviewError(null); // ✨ Xóa lỗi cũ khi mở modal
    setIsReviewModalVisible(true);
  };
  const handleCloseReviewModal = () => setIsReviewModalVisible(false);

  const handleSubmitReview = (rating: number, comment: string) => {
    if (rating === 0 || !comment.trim()) {
      // ✨ 2. Cập nhật state lỗi thay vì gọi showToast
      setReviewError("Vui lòng chọn sao và viết bình luận.");
      return;
    }

    // Xóa lỗi nếu đã qua
    setReviewError(null);

    const newReview = {
      review_id: Date.now(),
      product_id: productIdAsNumber,
      customer_user_id: 99,
      comment: comment.trim(),
      rating: rating,
      create_at: new Date().toISOString().split("T")[0],
      user_name: "Bạn",
      user_avatar: "https://i.pravatar.cc/150?u=current_user",
    };

    setProductReviews((prevReviews) => {
      const updatedReviews = [newReview, ...prevReviews];
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = totalRating / updatedReviews.length;
      setAverageRating(newAverage);
      return updatedReviews;
    });

    handleCloseReviewModal();
    // ✨ Toast này VẪN HOẠT ĐỘNG, vì nó chỉ hiển thị sau khi modal đã đóng
    showToast("success", "Cảm ơn bạn đã đánh giá!");
  };

  // (Hàm handleAddToCart giữ nguyên)
  const handleAddToCart = (quantity: number) => {
    if (!product) {
      return;
    }
    const { quantity: productStock, ...productInfo } = product;
    addToCart(productInfo, quantity);

    showToast("success", "Đã thêm sản phẩm vào giỏ hàng!");
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!product) {
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
        product={product}
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
          reviews={productReviews}
          averageRating={averageRating}
          onWriteReview={handleOpenReviewModal}
        />
      </ProductDetailView>

      {/* ✨ 3. Truyền state lỗi và hàm clear vào modal */}
      <ReviewBottomSheet
        visible={isReviewModalVisible}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        errorMessage={reviewError}
        onClearError={() => setReviewError(null)} // Hàm để xóa lỗi
      />
    </View>
  );
};

export default ProductDetailScreen;
