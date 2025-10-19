// components/CartDropdown.tsx
import { useCart } from "@/context/CartContext"; // Cập nhật đường dẫn nếu cần
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Tiện ích định dạng tiền tệ ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

interface CartDropdownProps {
  visible: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ visible, onClose }) => {
  // Lấy các hàm mới từ context
  const { cart, addToCart, decrementItem, removeFromCart } = useCart();

  // Tính tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <Pressable className="absolute inset-0 bg-gray-50 shadow-lg">
          {/* Header */}
          <View
            className="flex-row items-center justify-between  bg-STATUS_BAR p-4 border-b border-gray-200"
            style=""
          >
            <Text className="text-xl font-bold text-gray-800">Giỏ hàng</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Danh sách sản phẩm */}
          {cart.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-center py-5 text-gray-500">
                Giỏ hàng của bạn đang trống
              </Text>
            </View>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              className="flex-1 p-2"
              renderItem={({ item }) => (
                <View className="flex-row items-center bg-green-200 p-3 rounded-lg mb-2 shadow-xl">
                  {/* Parent */}
                  <View
                    className="p-1 rounded-md"
                    style={{ width: 72, height: 72, overflow: "hidden" }}
                  >
                    <Image
                      source={
                        typeof item.image === "string"
                          ? { uri: item.image }
                          : item.image
                      }
                      style={{ width: "100%", height: "100%", borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Tên và giá */}
                  <View className="flex-1 mx-3">
                    <Text
                      className="font-semibold text-gray-800 text-sm"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-green-700 font-bold mt-1 text-sm">
                      {formatCurrency(item.price)}
                    </Text>
                  </View>

                  {/* Nút điều khiển số lượng */}
                  <View className="items-center">
                    <View className="flex-row items-center bg-gray-100 rounded-full">
                      <TouchableOpacity
                        onPress={() => decrementItem(item.id)}
                        className="p-1"
                      >
                        <FontAwesome name="minus" size={10} color="black" />
                      </TouchableOpacity>
                      <Text className="px-2 font-bold text-sm">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        className="p-1"
                      >
                        <FontAwesome name="plus" size={10} color="black" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      className="mt-2"
                    >
                      <FontAwesome name="trash-o" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* Footer - Tổng tiền */}
          {cart.length > 0 && (
            <View className="p-4 border-t border-gray-200 bg-white">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-600">
                  Tổng cộng:
                </Text>
                <Text className="text-xl font-bold text-green-700">
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
              <TouchableOpacity className="bg-green-600 p-4 rounded-lg items-center justify-center">
                <Text className="text-white text-lg font-bold">Thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CartDropdown;
