// app/(modals)/select-address.tsx
import { Address, mockAddresses } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddress } from "@/context/address/AddressContext";

export default function SelectAddressModal() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  // ✨ 1. Lấy hàm openAddModal từ context
  const { addresses, selectedAddress, setSelectedAddress, openAddModal } = useAddress();

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    router.back();
  };

  const renderItem = ({ item }: { item: Address }) => {
    const isSelected = item.address_id === selectedAddress?.address_id;
    const selectedClass = isSelected
      ? "border-green-500 bg-green-50"
      : "border-gray-200 bg-white";

    return (
      <TouchableOpacity
        onPress={() => handleSelectAddress(item)}
        className={`flex-row items-start p-4 border rounded-lg mb-3 ${selectedClass}`}
      >
        <Ionicons
          name={isSelected ? "radio-button-on" : "radio-button-off"}
          size={22}
          color={isSelected ? "#10B981" : "#D1D5DB"}
          className="mt-0.5"
        />
        <View className="ml-4 flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            {item.receiver_name}
          </Text>
          <Text className="text-sm text-gray-600 mb-0.5">{item.phone}</Text>
          <Text className="text-sm text-gray-600" style={{ lineHeight: 20 }}>
            {`${item.street}, ${item.ward}, ${item.district}, ${item.province}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          title: "Chọn địa chỉ",
          presentation: "modal",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.address_id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Nút thêm địa chỉ mới */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
        style={{
          paddingBottom: bottom || 16,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          // ✨ 2. Gọi hàm openAddModal
          onPress={openAddModal}
          className="bg-green-600 py-3.5 rounded-lg flex-row justify-center items-center"
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text className="text-white text-base font-semibold ml-2">
            Thêm địa chỉ mới
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}