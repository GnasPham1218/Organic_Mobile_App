// components/features/product/review/ProductReviewList.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import ProductReviewHeader from "./ProductReviewHeader";
import ProductReviewItem from "./ProductReviewItem";
import { Review } from "@/data/mockData"; // Giả sử bạn export type Review từ mockData

// Định nghĩa kiểu dữ liệu cho review đã được xử lý (thêm user_name, user_avatar)
export type ProcessedReview = Review & {
  user_name: string;
  user_avatar: string;
};

interface ProductReviewListProps {
  reviews: ProcessedReview[];
  averageRating: number;
  onWriteReview: () => void;
}

const ProductReviewList: React.FC<ProductReviewListProps> = ({
  reviews,
  averageRating,
  onWriteReview,
}) => {
  return (
    <View className="px-4 pb-6">
      <ProductReviewHeader
        averageRating={averageRating}
        reviewCount={reviews.length}
        onWriteReview={onWriteReview}
      />

      {reviews.length === 0 ? (
        <View className="py-6 items-center bg-white rounded-2xl shadow-sm">
          <Text className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.review_id.toString()}
          renderItem={({ item }) => (
            <ProductReviewItem
              userName={item.user_name}
              userAvatar={item.user_avatar}
              rating={item.rating}
              comment={item.comment}
              date={item.create_at}
            />
          )}
          scrollEnabled={false} // scroll bằng ScrollView của ProductDetailView
          ListFooterComponent={<View className="h-4" />}
        />
      )}
    </View>
  );
};

export default ProductReviewList;