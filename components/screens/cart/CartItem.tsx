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
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrement,
  onDecrementRequest,
  onRemoveRequest,
}) => {
  return (
    <View className="flex-row items-center bg-white p-3 rounded-xl mb-3 border border-gray-100 shadow-sm">
      {/* Ảnh */}
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
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
        <Text className="mt-1 text-sm text-gray-500">
          {formatCurrency(item.salePrice ?? item.price)} x {item.quantity}
        </Text>
        <Text className="mt-1 text-sm font-bold text-green-700">
          {formatCurrency((item.salePrice ?? item.price) * item.quantity)}
        </Text>
      </View>

      {/* Controls + / - / xóa */}
      <View className="items-center ml-2">
        <View className="flex-row items-center bg-gray-100 rounded-full overflow-hidden">
          <TouchableOpacity onPress={onDecrementRequest} className="p-2">
            <FontAwesome name="minus" size={14} color="black" />
          </TouchableOpacity>

          <Text className="px-3 font-bold text-sm">{item.quantity}</Text>

          <TouchableOpacity onPress={onIncrement} className="p-2">
            <FontAwesome name="plus" size={14} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onRemoveRequest} className="mt-2">
          <FontAwesome name="trash-o" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItemCard;