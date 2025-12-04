import OrderCard from "@/components/screens/order/OrderCard";
import { getOrderDetailFullAPI, getOrdersByUserIdAPI } from "@/service/api";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

// IMPORT TOAST CONTEXT
import { useToast } from "@/context/notifications/ToastContext";

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
  const { showToast } = useToast(); // hook toast

  // State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Ref lưu giá trị orders trước đó để so sánh trạng thái
  const prevOrdersRef = useRef<IOrder[]>([]);

  // --- HÀM LẤY DỮ LIỆU (LOGIC MỚI) ---
  const fetchOrders = useCallback(async () => {
    try {
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

      const resList = await getOrdersByUserIdAPI(userId);

      if (resList.data && resList.data.data) {
        const basicOrders = resList.data.data;

        // Lọc các đơn Active
        const activeOrders = basicOrders.filter((order) =>
          ACTIVE_STATUSES.includes(order.statusOrder)
        );

        // Lấy chi tiết cho từng đơn hàng
        const enrichedOrdersPromises = activeOrders.map(async (order) => {
          try {
            const resDetail = await getOrderDetailFullAPI(order.id);
            return {
              ...order,
              orderDetails: resDetail.data?.data || [],
            };
          } catch (err) {
            console.log(`Lỗi lấy chi tiết đơn ${order.id}`, err);
            return { ...order, orderDetails: [] };
          }
        });

        const finalOrders = await Promise.all(enrichedOrdersPromises);

        finalOrders.sort(
          (a, b) =>
            new Date(b.orderAt).getTime() - new Date(a.orderAt).getTime()
        );

        // --- KIỂM TRA TRẠNG THÁI ĐỂ HIỂN THỊ TOAST ---
        finalOrders.forEach((order) => {
          const prevOrder = prevOrdersRef.current.find(
            (o) => o.id === order.id
          );
          if (!prevOrder) return;

          // DELIVERING
          if (
            prevOrder.statusOrder !== "DELIVERING" &&
            order.statusOrder === "DELIVERING"
          ) {
            showToast("info", `Đơn #${order.id} đang được vận chuyển.`);
          }

          // DELIVERED
          if (
            prevOrder.statusOrder !== "DELIVERED" &&
            order.statusOrder === "DELIVERED"
          ) {
            showToast("success", `Đơn #${order.id} đã được giao thành công.`);
          }
        });

        // Cập nhật prevOrdersRef
        prevOrdersRef.current = finalOrders;

        setOrders(finalOrders);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handlePressOrder = (orderId: number) => {
    router.push(`/order/${orderId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="border-b border-BORDER bg-STATUS_BAR py-4">
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Đơn hàng hiện tại
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="mt-2 text-gray-500">Đang tải đơn hàng...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
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
