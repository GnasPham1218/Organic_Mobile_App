// components/CartDropdown.tsx
import type { CartItem } from "@/context/cart/CartContext";
import { useCart } from "@/context/cart/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

interface CartDropdownProps {
  visible: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ visible, onClose }) => {
  const { cart, addToCart, decrementItem, removeFromCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Fullscreen container */}
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={onClose} className="p-1">
          <FontAwesome name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Giỏ hàng</Text>
        {/* Placeholder để cân bằng header */}
        <View className="w-6" />
      </View>

      {/* Content: danh sách (cuộn được) */}
      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-base text-center">
            Giỏ hàng của bạn đang trống
          </Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item: CartItem) => item.product_id.toString()}
          className="flex-1 px-4"
          contentContainerClassName="pt-3 pb-36" // padding bottom để không bị che bởi footer
          renderItem={({ item }: { item: CartItem }) => (
            <View className="flex-row items-center bg-white p-3 rounded-xl mb-3 border border-gray-100 shadow-sm">
              {/* Image khung cố định */}
              <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  source={
                    typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* tên + giá */}
              <View className="flex-1 ml-3">
                <Text
                  numberOfLines={2}
                  className="text-base font-semibold text-gray-800"
                >
                  {item.name}
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {formatCurrency(item.salePrice ?? item.price)} x{" "}
                  {item.quantity}
                </Text>
                <Text className="mt-1 text-sm font-bold text-green-700">
                  {formatCurrency(
                    (item.salePrice ?? item.price) * item.quantity
                  )}
                </Text>
              </View>

              {/* controls */}
              <View className="items-center ml-2">
                <View className="flex-row items-center bg-gray-100 rounded-full overflow-hidden">
                  <TouchableOpacity
                    onPress={() => decrementItem(item.product_id)}
                    className="p-2"
                  >
                    <FontAwesome name="minus" size={14} color="black" />
                  </TouchableOpacity>
                  <Text className="px-3 font-bold text-sm">
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item, 1)}
                    className="p-2"
                  >
                    <FontAwesome name="plus" size={14} color="black" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeFromCart(item.product_id)}
                  className="mt-2"
                >
                  <FontAwesome name="trash-o" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator
          // Android nested scroll fix (nếu cần)
          nestedScrollEnabled
        />
      )}

      {/* Footer cố định dưới cùng */}
      {cart.length > 0 && (
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
            onPress={() => {
              /* điều hướng thanh toán */
            }}
          >
            <Text className="text-white text-base font-bold">Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

export default CartDropdown;
