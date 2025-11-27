import OrderCard from "@/components/screens/order/OrderCard";
import { getOrderDetailFullAPI, getOrdersByUserIdAPI } from "@/service/api"; // Import thêm API chi tiết
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

// Các trạng thái đơn hàng cần hiển thị (Đang xử lý & Đang giao)
const ACTIVE_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERING",
];

const OrdersScreen = () => {
  const router = useRouter();

  // State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- HÀM LẤY DỮ LIỆU (LOGIC MỚI) ---
  const fetchOrders = useCallback(async () => {
    try {
      // 1. Lấy User ID từ AsyncStorage
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      if (!userInfoStr) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userInfo = JSON.parse(userInfoStr);
      const userId = userInfo?.id;

      if (!userId) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 2. Gọi API danh sách đơn hàng (Cấp 1)
      const resList = await getOrdersByUserIdAPI(userId);

      if (resList.data && resList.data.data) {
        const basicOrders = resList.data.data;

        // 3. Lọc lấy các đơn đang hoạt động (Active) TRƯỚC khi gọi chi tiết
        // Việc này giúp giảm số lượng request không cần thiết
        const activeOrders = basicOrders.filter(
          (order) => ACTIVE_STATUSES.includes(order.statusOrder) // Lưu ý: check lại field là 'status' hay 'statusOrder' tùy backend
        );

        // 4. Kỹ thuật "Enrich Data": Gọi API chi tiết cho từng đơn hàng (Cấp 2)
        // Sử dụng Promise.all để chạy song song giúp tải nhanh hơn
        const enrichedOrdersPromises = activeOrders.map(async (order) => {
          try {
            // Gọi API lấy chi tiết sản phẩm (để lấy ảnh, tên sp...)
            const resDetail = await getOrderDetailFullAPI(order.id);

            // Trả về object cũ KÈM THEO orderDetails lấy được từ API mới
            return {
              ...order,
              orderDetails: resDetail.data?.data || [], // Gán vào field này để OrderCard tự hiểu
            };
          } catch (err) {
            console.log(`Lỗi lấy chi tiết đơn ${order.id}`, err);
            // Nếu lỗi API chi tiết, vẫn trả về đơn hàng nhưng mảng chi tiết rỗng
            return { ...order, orderDetails: [] };
          }
        });

        // Chờ tất cả các API con chạy xong
        const finalOrders = await Promise.all(enrichedOrdersPromises);

        // (Tùy chọn) Sắp xếp mới nhất lên đầu
        finalOrders.sort(
          (a, b) =>
            new Date(b.orderAt).getTime() - new Date(a.orderAt).getTime()
        );

        setOrders(finalOrders);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Gọi API khi màn hình mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xử lý kéo xuống để refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handlePressOrder = (orderId: number) => {
    router.push(`/order/${orderId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 shadow-sm z-10">
        <Text className="text-center text-xl font-bold text-green-700">
          Đơn hàng hiện tại
        </Text>
      </View>

      {/* Loading View */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="mt-2 text-gray-500">Đang tải đơn hàng...</Text>
        </View>
      ) : (
        /* Danh sách đơn hàng */
        <FlatList
          data={orders}
          // Truyền object đã có đủ orderDetails vào đây
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10B981"]}
            />
          }
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center opacity-70">
              <FontAwesome name="dropbox" size={80} color="#CBD5E1" />
              <Text className="mt-4 text-lg font-medium text-gray-500">
                Không có đơn hàng nào đang xử lý
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default OrdersScreen;
