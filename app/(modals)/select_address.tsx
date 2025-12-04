import { useAddress } from "@/context/address/AddressContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddressEditModal from "../user/AddressEditModal";

// ✅ Component Item chỉ còn nút Sửa
const AddressItem = ({ item, isSelected, onSelect, onEdit }: any) => {
  return (
    <View
      className={`bg-white rounded-xl mb-4 border ${
        isSelected
          ? "border-green-500 bg-green-50"
          : "border-transparent shadow-sm"
      }`}
    >
      <TouchableOpacity className="p-4 flex-row items-start" onPress={onSelect}>
        <View className="mt-1 mr-3">
          <Ionicons
            name={isSelected ? "radio-button-on" : "radio-button-off"}
            size={22}
            color={isSelected ? "#16A34A" : "#9CA3AF"}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text
              className="font-bold text-gray-800 text-base flex-1"
              numberOfLines={1}
            >
              {item.receiverName}
            </Text>
            {item.defaultAddress && (
              <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                <Text className="text-green-700 text-xs font-bold">
                  Mặc định
                </Text>
              </View>
            )}
          </View>
          <Text className="text-gray-500 text-sm mb-1">{item.phone}</Text>
          <Text className="text-gray-700 text-sm leading-5">
            {item.street}, {item.ward}, {item.district}, {item.province}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Footer chỉ còn nút Sửa */}
      <View className="flex-row border-t border-gray-100">
        <TouchableOpacity className="flex-1 p-3 items-center" onPress={onEdit}>
          <Text className="text-blue-600 font-medium">Sửa địa chỉ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SelectAddressScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams();

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    openAddModal,
    openEditModal,
    initData,
    loading,
  } = useAddress();

  useEffect(() => {
    if (addresses.length === 0 && userId) {
      initData(Number(userId));
    }
  }, [userId]);

  const handleSelect = (item: any) => {
    setSelectedAddress(item); // Cập nhật state
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.back();
    }
  };

  // ✅ Đã xóa hàm handleDelete

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-between mt-8">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          Chọn địa chỉ nhận hàng
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && addresses.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16A34A" />
          <Text className="text-gray-500 mt-2">Đang tải địa chỉ...</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-10">
              <Ionicons name="location-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4">Chưa có địa chỉ nào.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <AddressItem
              item={item}
              isSelected={selectedAddress?.id === item.id}
              onSelect={() => handleSelect(item)}
              onEdit={() => openEditModal(item)}
            />
          )}
        />
      )}

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 pb-8">
        <TouchableOpacity
          onPress={openAddModal}
          className="bg-green-600 py-3 rounded-lg flex-row justify-center items-center shadow"
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Thêm địa chỉ mới
          </Text>
        </TouchableOpacity>
      </View>
      <AddressEditModal />
    </View>
  );
}
