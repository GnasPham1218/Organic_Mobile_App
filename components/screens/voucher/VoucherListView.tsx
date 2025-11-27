import IconButton from "@/components/common/IconButton";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VoucherCard from "./VoucherCard";

export type VoucherFilterType = "freeship" | "product_discount";
type StatusFilter = { label: string; value: VoucherFilterType | null };

type VoucherListViewProps = {
  vouchers: IVoucher[];
  statusFilters: StatusFilter[];
  selectedType: VoucherFilterType | null;
  loading: boolean;
  refreshing: boolean;
  onTypeChange: (type: VoucherFilterType | null) => void;
  onBackPress: () => void;
  onRefresh: () => void;
  onCopy: (code: string) => void; // Prop mới
};

const VoucherListView: React.FC<VoucherListViewProps> = ({
  vouchers,
  statusFilters,
  selectedType,
  loading,
  refreshing,
  onBackPress,
  onTypeChange,
  onRefresh,
  onCopy,
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-3 bg-white border-b border-gray-100 mt-8">
        <View className="absolute left-4 z-10">
          <IconButton
            icon="arrow-back"
            size={24}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-xl font-bold text-gray-800">
          Kho Voucher
        </Text>
      </View>

      {/* Filter Chips */}
      <View className="py-3 px-4 bg-white mb-2 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => onTypeChange(filter.value)}
              className={`mr-3 rounded-full px-5 py-2 border ${
                selectedType === filter.value
                  ? "bg-green-600 border-green-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedType === filter.value ? "text-white" : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <FlatList
          data={vouchers}
          renderItem={({ item }) => (
            <VoucherCard voucher={item} onCopy={onCopy} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#16a34a"]}
            />
          }
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <FontAwesome name="ticket" size={60} color="#CBD5E1" />
              <Text className="mt-4 text-base text-gray-500">
                Chưa có voucher nào phù hợp
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default VoucherListView;
