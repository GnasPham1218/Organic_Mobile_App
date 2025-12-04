// components/features/product/review/ProductReviewItem.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface ProductReviewItemProps {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  isOwner: boolean; // ✅ Check xem phải bài của mình không
  onEdit?: (id: number, comment: string, rating: number) => void;
  onDelete?: (id: number) => void;
}

const ProductReviewItem: React.FC<ProductReviewItemProps> = ({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  date,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa đánh giá này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => onDelete && onDelete(id),
      },
    ]);
  };

  return (
    <View className="flex-row bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
      <Image
        source={{ uri: userAvatar }}
        className="w-10 h-10 rounded-full mr-3 bg-gray-200"
      />
      <View className="flex-1">
        {/* Header: Tên + Rating + (Edit/Delete) */}
        <View className="flex-row justify-between items-start mb-1">
          <View>
            <Text className="text-base font-bold text-gray-800">
              {userName}
            </Text>
            <View className="flex-row mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome
                  key={i}
                  name={i < rating ? "star" : "star-o"}
                  size={14}
                  color="#FACC15"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
          </View>

          {/* ✅ Nút thao tác (Chỉ hiện nếu là owner) */}
          {isOwner && (
            <View className="flex-row gap-x-3">
              <TouchableOpacity
                onPress={() => onEdit && onEdit(id, comment, rating)}
              >
                <FontAwesome name="pencil" size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome name="trash-o" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text className="text-sm text-gray-700 mt-2 mb-2 leading-5">
          {comment}
        </Text>
        <Text className="text-xs text-gray-400">{date}</Text>
      </View>
    </View>
  );
};

export default ProductReviewItem;
