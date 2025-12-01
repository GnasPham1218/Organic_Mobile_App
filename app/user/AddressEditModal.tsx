import { useAddress } from "@/context/address/AddressContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddressEditModal() {
  const { bottom } = useSafeAreaInsets();

  // Lấy logic từ context
  const {
    showAddEditModal,
    setShowAddEditModal,
    form,
    setForm,
    editingAddress,
    saveAddress,
    provinces,
    districts,
    wards,
    handleSelectProvince,
    handleSelectDistrict,
    // ✅ Lấy thêm 2 biến này để xử lý loading
    isLocationReady,
    retryFetchLocation,
  } = useAddress();

  // State để quản lý việc đang chọn cái gì (Tỉnh, Huyện, hay Xã)
  const [selectionMode, setSelectionMode] = useState<
    "NONE" | "PROVINCE" | "DISTRICT" | "WARD"
  >("NONE");

  // Hàm render item cho list chọn
  const renderSelectionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-100"
      onPress={() => {
        if (selectionMode === "PROVINCE") {
          handleSelectProvince(item.Name);
        } else if (selectionMode === "DISTRICT") {
          handleSelectDistrict(item.Name);
        } else if (selectionMode === "WARD") {
          setForm((prev) => ({ ...prev, ward: item.Name }));
        }
        setSelectionMode("NONE"); // Đóng list chọn sau khi chọn xong
      }}
    >
      <Text className="text-base text-gray-800">{item.Name}</Text>
    </TouchableOpacity>
  );

  // Lấy data source dựa trên mode
  const getListData = () => {
    if (selectionMode === "PROVINCE") return provinces;
    if (selectionMode === "DISTRICT") return districts;
    if (selectionMode === "WARD") return wards;
    return [];
  };

  return (
    <Modal visible={showAddEditModal} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[90%] flex-1">
          {/* Header Modal */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              {selectionMode !== "NONE"
                ? "Chọn khu vực"
                : editingAddress
                  ? "Sửa địa chỉ"
                  : "Thêm địa chỉ mới"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectionMode !== "NONE") setSelectionMode("NONE");
                else setShowAddEditModal(false);
              }}
              className="p-1"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* CONTENT: Nếu đang chọn Tỉnh/Huyện/Xã thì hiện List, không thì hiện Form */}
          {selectionMode !== "NONE" ? (
            <View className="flex-1">
              {/* ✅ LOGIC HIỂN THỊ LOADING HOẶC DANH SÁCH */}
              {selectionMode === "PROVINCE" && !isLocationReady ? (
                <View className="flex-1 justify-center items-center p-4">
                  <ActivityIndicator size="large" color="#16A34A" />
                  <Text className="text-gray-500 mt-4 text-center">
                    Đang tải dữ liệu hành chính...
                  </Text>
                  {/* Nút thử lại nếu mạng lỗi */}
                  <TouchableOpacity
                    onPress={retryFetchLocation}
                    className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-gray-700 font-medium">Thử lại</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={getListData()}
                  keyExtractor={(item) => item.Code || item.Name}
                  renderItem={renderSelectionItem}
                  className="flex-1"
                  ListEmptyComponent={
                    <View className="p-4 items-center mt-10">
                      <Text className="text-gray-400">Không có dữ liệu</Text>
                    </View>
                  }
                />
              )}
            </View>
          ) : (
            /* FORM NHẬP LIỆU (Giữ nguyên như cũ) */
            <>
              <ScrollView
                className="p-4"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <View className="flex-col gap-4">
                  <TextInput
                    placeholder="Họ & tên người nhận *"
                    value={form.receiverName}
                    onChangeText={(v) =>
                      setForm((s) => ({ ...s, receiverName: v }))
                    }
                    className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    placeholder="Số điện thoại *"
                    value={form.phone}
                    onChangeText={(v) => setForm((s) => ({ ...s, phone: v }))}
                    keyboardType="phone-pad"
                    className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                    placeholderTextColor="#9CA3AF"
                  />

                  {/* --- Selector Tỉnh/Thành --- */}
                  <TouchableOpacity
                    onPress={() => setSelectionMode("PROVINCE")}
                    className="bg-gray-100 px-4 py-3 rounded-lg flex-row justify-between items-center"
                  >
                    <Text
                      className={`text-base ${form.province ? "text-black" : "text-gray-400"}`}
                    >
                      {form.province || "Tỉnh/Thành phố *"}
                    </Text>
                    {/* ✅ Hiển thị loading nhỏ bên cạnh nếu chưa tải xong */}
                    {!isLocationReady ? (
                      <ActivityIndicator size="small" color="#9CA3AF" />
                    ) : (
                      <Ionicons name="chevron-down" size={20} color="gray" />
                    )}
                  </TouchableOpacity>

                  {/* --- Selector Quận/Huyện --- */}
                  <TouchableOpacity
                    onPress={() => {
                      if (!form.province)
                        alert("Vui lòng chọn Tỉnh/Thành phố trước");
                      else setSelectionMode("DISTRICT");
                    }}
                    className={`bg-gray-100 px-4 py-3 rounded-lg flex-row justify-between items-center ${!form.province ? "opacity-50" : ""}`}
                    disabled={!form.province}
                  >
                    <Text
                      className={`text-base ${form.district ? "text-black" : "text-gray-400"}`}
                    >
                      {form.district || "Quận/Huyện *"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>

                  {/* --- Selector Phường/Xã --- */}
                  <TouchableOpacity
                    onPress={() => {
                      if (!form.district)
                        alert("Vui lòng chọn Quận/Huyện trước");
                      else setSelectionMode("WARD");
                    }}
                    className={`bg-gray-100 px-4 py-3 rounded-lg flex-row justify-between items-center ${!form.district ? "opacity-50" : ""}`}
                    disabled={!form.district}
                  >
                    <Text
                      className={`text-base ${form.ward ? "text-black" : "text-gray-400"}`}
                    >
                      {form.ward || "Phường/Xã *"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Đường, số nhà *"
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
                      setForm((s) => ({
                        ...s,
                        defaultAddress: !s.defaultAddress,
                      }))
                    }
                    className="flex-row items-center mt-2"
                  >
                    <Ionicons
                      name={form.defaultAddress ? "checkbox" : "square-outline"}
                      size={22}
                      color={form.defaultAddress ? "#16A34A" : "#6B7280"}
                    />
                    <Text className="text-gray-700 text-base ml-2">
                      Đặt làm mặc định
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Footer Buttons */}
              <View
                className="flex-row gap-3 p-4 border-t border-gray-200 bg-white"
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
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
