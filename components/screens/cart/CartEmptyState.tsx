// components/features/cart/CartEmptyState.tsx
import React from "react";
import { View, Text } from "react-native";

const CartEmptyState: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-500 text-base text-center">
        Giỏ hàng của bạn đang trống
      </Text>
    </View>
  );
};

export default CartEmptyState;