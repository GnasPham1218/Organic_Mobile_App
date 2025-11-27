import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import OrderDetailView from "@/components/screens/order/OrderDetailView";
// 1. Import API và Type
import { getOrderDetailFullAPI } from "@/service/api";


const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 2. State lưu trữ danh sách chi tiết đơn hàng
  const [orderDetails, setOrderDetails] = useState<IOrderDetailFull[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getOrderDetailFullAPI(Number(id));
        if (res.data && res.data.data) {
          setOrderDetails(res.data.data);
        }
      } catch (error) {
        console.log("Lỗi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 4. Màn hình Loading
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  // 5. Xử lý trường hợp không có dữ liệu
  if (!orderDetails || orderDetails.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg text-gray-500">
          Không tìm thấy đơn hàng!
        </Text>
      </View>
    );
  }

  // 6. Chuẩn bị dữ liệu để truyền vào View
  // Lấy thông tin chung (order info) từ phần tử đầu tiên của mảng
  const orderInfo = orderDetails[0].order;
  
  // Tính tổng tiền thủ công (vì API trả về list sản phẩm)
  const totalAmount = orderDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <OrderDetailView
        // Truyền thông tin chung của đơn hàng
        order={orderInfo} 
        
        // Truyền danh sách sản phẩm (IOrderDetailFull[])
        items={orderDetails} 
        
        // Truyền tổng tiền đã tính
        totalAmount={totalAmount}

        onBackPress={router.back}
        onReportIssue={() => {
          router.push(`/return/${orderInfo.id}`);
        }}
      />
    </>
  );
};

export default OrderDetailScreen;