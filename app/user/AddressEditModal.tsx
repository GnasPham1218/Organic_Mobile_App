// components/features/user/AddressEditModal.tsx
import { useAddress } from "@/context/address/AddressContext";
import { Address } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Đây là Modal thêm/sửa địa chỉ.
 * Nó lấy toàn bộ state và logic từ AddressContext.
 */
export default function AddressEditModal() {
  const { bottom } = useSafeAreaInsets();

  // Lấy TOÀN BỘ logic từ context
  const {
    showAddEditModal,
    setShowAddEditModal,
    form,
    setForm,
    editingAddress,
    saveAddress,
  } = useAddress();

  return (
    <Modal visible={showAddEditModal} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[90%]">
          {/* Header Modal */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddEditModal(false)}
              className="p-1"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView
            className="p-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="flex-col gap-4">
              <TextInput
                placeholder="Họ & tên người nhận"
                value={form.receiver_name}
                onChangeText={(v) =>
                  setForm((s) => ({ ...s, receiver_name: v }))
                }
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Số điện thoại"
                value={form.phone}
                onChangeText={(v) => setForm((s) => ({ ...s, phone: v }))}
                keyboardType="phone-pad"
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Tỉnh/Thành phố"
                value={form.province}
                onChangeText={(v) => setForm((s) => ({ ...s, province: v }))}
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Quận/Huyện"
                value={form.district}
                onChangeText={(v) => setForm((s) => ({ ...s, district: v }))}
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Phường/Xã"
                value={form.ward}
                onChangeText={(v) => setForm((s) => ({ ...s, ward: v }))}
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Đường, số nhà"
                value={form.street}
                onChangeText={(v) => setForm((s) => ({ ...s, street: v }))}
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Ghi chú (tùy chọn)"
                value={form.note || ""}
                onChangeText={(v) => setForm((s) => ({ ...s, note: v }))}
                className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity
                onPress={() =>
                  setForm((s) => ({ ...s, is_default: !s.is_default }))
                }
                className="flex-row items-center mt-2"
              >
                <Ionicons
                  name={form.is_default ? "checkbox" : "square-outline"}
                  size={22}
                  color={form.is_default ? "#16A34A" : "#6B7280"}
                />
                <Text className="text-gray-700 text-base ml-2">
                  Đặt làm mặc định
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Nút hành động Modal */}
          <View
            className="flex-row gap-3 p-4 border-t border-gray-200"
            style={{ paddingBottom: bottom || 16 }}
          >
            <TouchableOpacity
              onPress={() => setShowAddEditModal(false)}
              className="flex-1 rounded-lg border border-gray-300 py-3.5"
            >
              <Text className="text-center font-semibold text-gray-700">
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={saveAddress}
              className="flex-1 rounded-lg bg-green-600 py-3.5"
            >
              <Text className="text-center font-semibold text-white">
                {editingAddress ? "Cập nhật" : "Lưu"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}