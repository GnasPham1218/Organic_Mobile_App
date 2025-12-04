import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import OrderDetailView from "@/components/screens/order/OrderDetailView";

// 1. Import API và Type mới
// Giả sử file chứa interface và api tên là "@/service/api", bạn hãy điều chỉnh nếu khác
import { getOrderByIdV2API } from "@/service/api";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 2. State lưu trữ dữ liệu đơn hàng (Kiểu IResOrderDTO)
  const [order, setOrder] = useState<IResOrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // 3. Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Gọi API V2 mới
        const res = await getOrderByIdV2API(Number(id));

        // Kiểm tra structure response (thường là res.data hoặc res.data.data tùy axios config)
        if (res.data) {
          // Nếu backend trả về bọc trong data (res.data.data) thì dùng dòng dưới, nếu không thì dùng res.data
          // Dựa vào code cũ của bạn: res.data.data
          // @ts-ignore: Tùy chỉnh theo thực tế response wrapper của bạn
          setOrder(res.data.data || res.data);
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
  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg text-gray-500">Không tìm thấy đơn hàng!</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <OrderDetailView
        // 6. Truyền dữ liệu vào View

        // 'order' bây giờ là toàn bộ object IResOrderDTO (chứa status, ngày tháng, payment...)
        order={order}
        // 'items' lấy từ mảng orderDetails nằm bên trong object trả về
        items={order.orderDetails}
        // 'totalAmount' lấy trực tiếp từ API, không cần tính toán thủ công nữa
        totalAmount={order.totalPrice}
        onBackPress={router.back}
        onReportIssue={() => {
          router.push(`/return/${order.id}`);
        }}
      />
    </>
  );
};

export default OrderDetailScreen;
