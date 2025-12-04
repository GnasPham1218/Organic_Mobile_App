// components/features/product/review/ProductReviewList.tsx
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductReviewHeader from "./ProductReviewHeader";
import ProductReviewItem from "./ProductReviewItem";

interface ProductReviewListProps {
  reviews: IResReviewDTO[];
  averageRating: number;
  totalReviews: number; // Tổng số review từ server
  currentUserId: number | null; // ID người đang đăng nhập
  onWriteReview: () => void;
  onEditReview: (id: number, comment: string, rating: number) => void;
  onDeleteReview: (id: number) => void;
  // Props cho phân trang
  onLoadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
}

const ProductReviewList: React.FC<ProductReviewListProps> = ({
  reviews,
  averageRating,
  totalReviews,
  currentUserId,
  onWriteReview,
  onEditReview,
  onDeleteReview,
  onLoadMore,
  isLoadingMore,
  hasMore,
}) => {
  return (
    <View className="px-4 pb-6">
      <ProductReviewHeader
        averageRating={averageRating}
        reviewCount={totalReviews}
        onWriteReview={onWriteReview}
      />

      {reviews.length === 0 ? (
        <View className="py-8 items-center bg-white rounded-2xl border border-dashed border-gray-300">
          <Text className="text-gray-500 italic">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductReviewItem
                id={item.id}
                userName={item.userName || "Ẩn danh"}
                userAvatar={item.userAvatar || "https://i.pravatar.cc/150"}
                rating={item.rating}
                comment={item.comment}
                date={new Date(item.createdAt).toLocaleDateString("vi-VN")}
                isOwner={currentUserId === item.userId} // ✅ So sánh ID
                onEdit={onEditReview}
                onDelete={onDeleteReview}
              />
            )}
            scrollEnabled={false}
          />

          {/* ✅ Nút Load More */}
          {hasMore && (
            <TouchableOpacity
              onPress={onLoadMore}
              disabled={isLoadingMore}
              className="mt-2 bg-gray-100 py-3 rounded-xl items-center active:bg-gray-200"
            >
              {isLoadingMore ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Text className="text-gray-600 font-medium">
                  Xem thêm đánh giá
                </Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default ProductReviewList;
