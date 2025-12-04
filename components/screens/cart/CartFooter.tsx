// components/features/cart/CartFooter.tsx
import { formatCurrency } from "@/utils/formatters";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CartFooterProps {
  totalPrice: number;
  onCheckout: () => void;
  isDisabled: boolean;
}

const CartFooter: React.FC<CartFooterProps> = ({
  totalPrice,
  onCheckout,
  isDisabled,
}) => {
  return (
    <View className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-gray-200">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-semibold text-gray-700">
          Tổng cộng:
        </Text>
        <Text className="text-lg font-bold text-green-700">
          {formatCurrency(totalPrice)}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-green-600 py-3 rounded-xl items-center justify-center active:opacity-90"
        onPress={onCheckout}
        disabled={isDisabled}
      >
        <Text className="text-white text-base font-bold">Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartFooter;
