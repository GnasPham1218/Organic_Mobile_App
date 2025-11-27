import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import các component và type cần thiết
import IconButton from "@/components/common/IconButton";
import OrderCard from "@/components/screens/order/OrderCard";

// Định nghĩa props mà component này sẽ nhận
type OrderHistoryProps = {
  orders: IOrder[];

  statusFilters: { label: string; value: string | null }[];
  selectedStatus: string | null;

  selectedDate: Date | null;
  showDatePicker: boolean;

  // Hàm xử lý sự kiện
  onBackPress: () => void;
  onStatusChange: (status: string | null) => void; // Sửa type tham số
  onDateChange: (event: DateTimePickerEvent, date?: Date) => void;
  onShowDatePicker: () => void;
  onClearDateFilter: () => void;
};

const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  statusFilters,
  selectedStatus,
  selectedDate,
  showDatePicker,
  onBackPress,
  onStatusChange,
  onDateChange,
  onShowDatePicker,
  onClearDateFilter,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Lịch sử đơn hàng
        </Text>
      </View>

      {/* --- Khu vực Bộ lọc --- */}
      <View className="p-4 bg-white border-b border-BORDER">
        {/* Bộ lọc Trạng thái */}
        <Text className="text-base font-semibold text-TEXT_PRIMARY mb-2">
          Lọc theo trạng thái
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => onStatusChange(filter.value)}
              className={`mr-2 rounded-full px-4 py-2 border ${
                selectedStatus === filter.value
                  ? "bg-PRIMARY border-PRIMARY"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedStatus === filter.value
                    ? "text-white"
                    : "text-TEXT_SECONDARY"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bộ lọc Ngày */}
        <Text className="text-base font-semibold text-TEXT_PRIMARY mt-4 mb-2">
          Lọc theo ngày tạo
        </Text>
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity
            onPress={onShowDatePicker}
            className="flex-1 rounded-lg border border-BORDER bg-gray-50 p-3"
          >
            <Text className="text-base text-TEXT_PRIMARY">
              {selectedDate
                ? selectedDate.toLocaleDateString("vi-VN")
                : "Chọn ngày"}
            </Text>
          </TouchableOpacity>
          {/* Nút reset ngày */}
          {selectedDate && (
            <TouchableOpacity onPress={onClearDateFilter} className="p-2">
              <FontAwesome name="times-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- Danh sách đơn hàng --- */}
      <FlatList
        data={orders}
        // 4. SỬA keyExtractor (id API là number nên cần toString)
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // ⚠️ LƯU Ý: Component OrderCard bên trong cũng cần phải sửa
          // để nhận prop 'order' là kiểu IOrder thay vì kiểu cũ.
          <OrderCard order={item} />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <FontAwesome name="search" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-TEXT_SECONDARY">
              Không tìm thấy đơn hàng nào
            </Text>
          </View>
        }
      />

      {/* Component DateTimePicker (ẩn) */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default OrderHistory;
