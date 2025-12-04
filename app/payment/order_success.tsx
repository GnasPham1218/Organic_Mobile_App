import { getOrderByIdV2API } from "@/service/api";
import { formatCurrency } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const fetchData = async () => {
    try {
      const res = await getOrderByIdV2API(Number(orderId));
      if (res.data && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.log("Lỗi lấy order:", err);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mb-6">
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
          <Text className="text-2xl font-bold text-green-600 mt-2">
            Thanh toán thành công!
          </Text>
          <Text className="text-gray-500 mt-1">
            Mã đơn hàng: #{orderId?.toString().padStart(6, "0")}
          </Text>
        </View>

        {order && (
          <View className="bg-gray-50 p-4 rounded-xl space-y-3">
            <Text className="text-lg font-semibold text-gray-800">
              Thông tin đơn hàng
            </Text>

            <Text className="text-sm text-gray-600">
              Người nhận: {order.receiverName}
            </Text>
            <Text className="text-sm text-gray-600">
              SĐT: {order.receiverPhone}
            </Text>
            <Text className="text-sm text-gray-600">
              Địa chỉ: {order.shipAddress}
            </Text>

            <Text className="text-sm mt-3 font-semibold text-gray-800">
              Tổng tiền:{" "}
              <Text className="text-green-600">
                {formatCurrency(order.totalPrice)}
              </Text>
            </Text>
          </View>
        )}

        {/* Danh sách sản phẩm */}
        {order?.orderDetails && (
          <View className="mt-5 bg-white">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Sản phẩm đã mua
            </Text>

            {order.orderDetails.map((item: any) => (
              <View
                key={item.productId}
                className="flex-row justify-between py-3 border-b border-gray-200"
              >
                <Text className="text-gray-700 flex-1">{item.productName}</Text>
                <Text className="text-gray-800 font-medium">
                  x{item.quantity}
                </Text>
                <Text className="text-gray-900 font-semibold w-20 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Nút quay về trang chủ */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          className="mt-10 bg-green-600 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">
            Về trang chủ
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
