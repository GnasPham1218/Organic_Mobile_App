import type { CartItem } from "@/context/cart/CartContext";
import { useCart } from "@/context/cart/CartContext";
import { useConfirm } from "@/context/confirm/ConfirmContext";
import { useToast } from "@/context/notifications/ToastContext";
import { formatCurrency } from "@/utils/formatters";
import ConfirmModal from "@components/common/ConfirmModal";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const CartScreen: React.FC = () => {
  const router = useRouter();
  const { cart, addToCart, decrementItem, removeFromCart } = useCart();
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <FontAwesome name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Giỏ hàng</Text>
        <View className="w-6" />
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 text-base text-center">
            Giỏ hàng của bạn đang trống
          </Text>
        </View>
      ) : (
        <>
          {/* LIST */}
          <FlatList
            data={cart}
            keyExtractor={(item: CartItem) => item.product_id.toString()}
            className="flex-1 px-4"
            contentContainerClassName="pt-3 pb-36"
            renderItem={({ item }: { item: CartItem }) => (
              <View className="flex-row items-center bg-white p-3 rounded-xl mb-3 border border-gray-100 shadow-sm">
                {/* Ảnh */}
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
                    <TouchableOpacity
                      onPress={() => {
                        if (item.quantity > 1) {
                          decrementItem(item.product_id);
                        } else {
                          setItemToRemove(item);
                        }
                      }}
                      className="p-2"
                    >
                      <FontAwesome name="minus" size={14} color="black" />
                    </TouchableOpacity>

                    <Text className="px-3 font-bold text-sm">{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => addToCart(item, 1)}
                      className="p-2"
                    >
                      <FontAwesome name="plus" size={14} color="black" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setItemToRemove(item)}
                    className="mt-2"
                  >
                    <FontAwesome name="trash-o" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* FOOTER */}
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
              onPress={() =>
                showToast("error", "Chức năng thanh toán đang được phát triển")
              }
            >
              <Text className="text-white text-base font-bold">Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        visible={!!itemToRemove}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${itemToRemove?.name}" khỏi giỏ hàng?`}
        onCancel={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            removeFromCart(itemToRemove.product_id);
            showToast("success", `Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`);
          }
          setItemToRemove(null);
        }}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="destructive"
      />
    </View>
  );
};

export default CartScreen;
