import OrderHistoryView from "@/components/features/order/OrderHistory";
import { mockHistoryOrders, OrderStatus } from "@/data/mockData";
import { isSameDay } from "@/utils/dates";
import { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
const statusFilters: { label: string; value: OrderStatus | null }[] = [
  { label: "Tất cả", value: null },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

const OrderHistoryScreen = () => {
  const router = useRouter();
  // State cho bộ lọc (giữ nguyên)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Logic lọc chính (giữ nguyên)
  const filteredOrders = useMemo(() => {
    let orders = mockHistoryOrders;
    if (selectedStatus) {
      orders = orders.filter((order) => order.status === selectedStatus);
    }
    if (selectedDate) {
      orders = orders.filter((order) => {
        const orderDate = new Date(order.order_at);
        return isSameDay(orderDate, selectedDate);
      });
    }
    return orders;
  }, [selectedStatus, selectedDate]);

  // Xử lý khi chọn ngày (giữ nguyên)
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  // Nút reset bộ lọc ngày (giữ nguyên)
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // ▼▼▼ BƯỚC 2: TRẢ VỀ COMPONENT VIEW VÀ TRUYỀN PROPS ▼▼▼
  return (
    <OrderHistoryView
      // Dữ liệu
      orders={filteredOrders}
      statusFilters={statusFilters}
      // State
      selectedStatus={selectedStatus}
      selectedDate={selectedDate}
      showDatePicker={showDatePicker}
      // Hàm xử lý
      onBackPress={() => router.back()}
      onStatusChange={setSelectedStatus} // Truyền thẳng hàm setState
      onDateChange={onDateChange}
      onShowDatePicker={() => setShowDatePicker(true)} // Hàm bật picker
      onClearDateFilter={clearDateFilter}
    />
  );
};

export default OrderHistoryScreen;
