// File: components/features/voucher/VoucherListView.tsx

import type { Voucher } from "@/data/mockData";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VoucherCard from "./VoucherCard"; // <-- Dùng Card mới

// Định nghĩa kiểu cho Filter
export type VoucherFilterType = "freeship" | "product_discount";
type StatusFilter = { label: string; value: VoucherFilterType | null };

// Props mà component này nhận
type VoucherListViewProps = {
  vouchers: Voucher[];
  statusFilters: StatusFilter[];
  selectedType: VoucherFilterType | null;
  onTypeChange: (type: VoucherFilterType | null) => void;
  onBackPress: () => void;
};

const VoucherListView: React.FC<VoucherListViewProps> = ({
  vouchers,
  statusFilters,
  selectedType,
  onBackPress,
  onTypeChange,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Mã giảm giá
        </Text>
      </View>

      {/* --- Khu vực Bộ lọc --- */}
      <View className="p-4 bg-white border-b border-BORDER">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => onTypeChange(filter.value)}
              className={`mr-2 rounded-full px-4 py-2 border ${
                selectedType === filter.value
                  ? "bg-PRIMARY border-PRIMARY"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedType === filter.value
                    ? "text-white"
                    : "text-TEXT_SECONDARY"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- Danh sách Voucher --- */}
      <FlatList
        data={vouchers}
        renderItem={({ item }) => <VoucherCard voucher={item} />}
        keyExtractor={(item) => item.voucher_id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <FontAwesome name="search" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-TEXT_SECONDARY">
              Không tìm thấy voucher
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default VoucherListView;
