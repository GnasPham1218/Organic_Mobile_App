// components/features/cart/CartItemCard.tsx
import type { CartItem } from "@/context/cart/CartContext";
import { formatCurrency } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrementRequest: () => void;
  onRemoveRequest: () => void;
  isProcessing: boolean; // Khóa nút khi API đang chạy
  onMaxStockAttempt: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrement,
  onDecrementRequest,
  onRemoveRequest,
  isProcessing,
  onMaxStockAttempt,
}) => {
  // Kiểm tra xem có giảm giá không
  const isDiscounted = item.originalPrice > item.price;
  const finalItemPrice = item.price; // Giá bán thực tế
  const totalItemPrice = finalItemPrice * item.quantity;
  const canIncrement = item.quantity < item.maxStock;

  // ✨ TẠO HÀM HANDLER CHO NÚT TĂNG
  const handleIncrementPress = () => {
    if (!canIncrement) {
      // Nếu đã đạt tối đa, thông báo cho người dùng
      onMaxStockAttempt();
    } else {
      // Nếu chưa đạt tối đa, gọi hàm tăng số lượng (sẽ gọi API)
      onIncrement();
    }
  };
  return (
    <View className="flex-row items-center bg-white p-3 rounded-xl mb-3 border border-gray-100 shadow-sm">
      {/* Ảnh */}
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          source={
            typeof item.image === "string" ? { uri: item.image } : item.image
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Tên + giá */}
      <View className="flex-1 ml-3">
        <Text
          numberOfLines={2}
          className="text-base font-semibold text-gray-800"
        >
          {item.name}
        </Text>

        {/* ✨ SỬA 1: Hiển thị giá gốc gạch ngang */}
        {isDiscounted && (
          <Text className="text-xs text-gray-400 line-through mt-1">
            {formatCurrency(item.originalPrice)}
          </Text>
        )}

        {/* ✨ SỬA 2: Hiển thị giá bán thực tế */}
        <Text className="mt-1 text-base font-bold text-red-600">
          {formatCurrency(finalItemPrice)} x {item.quantity}
        </Text>

        {/* Tổng tiền của item này */}
        <Text className="text-sm font-bold text-green-700 mt-1">
          Thành tiền: {formatCurrency(totalItemPrice)}
        </Text>
      </View>

      {/* Controls + / - / xóa */}
      <View className="items-center ml-2">
        {/* Khóa nút khi isProcessing HOẶC không thể giảm thêm (quantity <= 1) */}
        <View className="flex-row items-center bg-gray-100 rounded-full overflow-hidden">
          <TouchableOpacity
            onPress={onDecrementRequest}
            disabled={isProcessing || item.quantity <= 1} // Khóa nếu đang xử lý hoặc qty=1
            className={`p-2 ${isProcessing ? "opacity-50" : ""}`}
          >
            <FontAwesome name="minus" size={14} color="#333" />
          </TouchableOpacity>

          <Text className="px-3 font-bold text-sm">{item.quantity}</Text>

          <TouchableOpacity
            onPress={handleIncrementPress}
            disabled={isProcessing}
            className={`p-2 ${isProcessing || !canIncrement ? "opacity-50" : ""}`}
          >
            <FontAwesome name="plus" size={14} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Nút Xóa */}
        <TouchableOpacity
          onPress={onRemoveRequest}
          // ✨ SỬA 4: Khóa nút xóa khi đang xử lý
          disabled={isProcessing}
          className={`mt-2 ${isProcessing ? "opacity-50" : ""}`}
        >
          <FontAwesome name="trash-o" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItemCard;
