// app/order/order_history.tsx

import OrderHistoryView from "@/components/screens/order/OrderHistory";
import { getOrderDetailFullAPI, getOrdersByUserIdAPI } from "@/service/api";
import { isSameDay } from "@/utils/dates";
import { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// 1. KHAI BÁO BIẾN statusFilters (Phải nằm ngoài component hoặc dùng useMemo)
const STATUS_FILTERS: { label: string; value: string | null }[] = [
  { label: "Tất cả", value: null },
  { label: "Hoàn thành", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const OrderHistoryScreen = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  // State dữ liệu
  const [apiOrders, setApiOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // State bộ lọc UI
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 2. Gọi API (Có cleanup function để fix lỗi unmount)
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!userId) return;
      try {
        setLoading(true);

        // 1. Gọi API lấy danh sách đơn hàng cơ bản
        const resList = await getOrdersByUserIdAPI(Number(userId));

        if (resList.data && resList.data.data) {
          const basicOrders = resList.data.data;

          // 2. Lọc trạng thái (Đã giao/Đã hủy) TRƯỚC khi gọi chi tiết (để tiết kiệm request)
          const filteredBasicOrders = basicOrders.filter(
            (order) =>
              order.statusOrder === "DELIVERED" ||
              order.statusOrder === "CANCELLED"
          );

          // 3. Gọi API chi tiết cho TỪNG đơn hàng (Chạy song song bằng Promise.all)
          const fullOrdersPromises = filteredBasicOrders.map(async (order) => {
            try {
              // Gọi API getOrderDetailFullAPI bạn vừa viết
              const resDetail = await getOrderDetailFullAPI(order.id);

              // Trả về object order cũ KÈM THÊM orderDetails
              return {
                ...order,
                orderDetails: resDetail.data?.data || [],
              };
            } catch (err) {
              console.log(`Lỗi lấy chi tiết đơn ${order.id}`, err);
              return { ...order, orderDetails: [] }; // Fallback nếu lỗi
            }
          });

          // Chờ tất cả API chạy xong
          const finalOrders = await Promise.all(fullOrdersPromises);

          if (isMounted) {
            setApiOrders(finalOrders);
          }
        }
      } catch (error) {
        console.log("Lỗi tải đơn hàng:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // 3. Logic lọc (Tạo bản sao mảng để tránh mutation error)
  const filteredOrders = useMemo(() => {
    // Tạo bản sao bằng spread operator [...]
    let orders = [...apiOrders];

    if (selectedStatus) {
      orders = orders.filter((order) => order.statusOrder === selectedStatus);
    }

    if (selectedDate) {
      orders = orders.filter((order) => {
        const orderDate = new Date(order.orderAt);
        return isSameDay(orderDate, selectedDate);
      });
    }

    // Sắp xếp (mới nhất lên đầu)
    return orders.sort(
      (a, b) => new Date(b.orderAt).getTime() - new Date(a.orderAt).getTime()
    );
  }, [selectedStatus, selectedDate, apiOrders]);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  return (
    <OrderHistoryView
      // Truyền dữ liệu
      orders={filteredOrders}
      // 4. QUAN TRỌNG: Truyền statusFilters vào đây
      statusFilters={STATUS_FILTERS}
      // State
      selectedStatus={selectedStatus}
      selectedDate={selectedDate}
      showDatePicker={showDatePicker}
      // Hàm xử lý
      onBackPress={() => router.back()}
      onStatusChange={setSelectedStatus}
      onDateChange={onDateChange}
      onShowDatePicker={() => setShowDatePicker(true)}
      onClearDateFilter={() => setSelectedDate(null)}
    />
  );
};

export default OrderHistoryScreen;
