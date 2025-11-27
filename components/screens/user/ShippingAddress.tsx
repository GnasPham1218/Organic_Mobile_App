import AddressEditModal from "@/app/user/AddressEditModal";
import IconButton from "@/components/common/IconButton";

import { useAddress } from "@/context/address/AddressContext"; // Hook lấy data
import { useConfirm } from "@/context/confirm/ConfirmContext"; // Hook xác nhận xóa
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ShippingAddressProps = {
  onBack: () => void;
};

/**
 * Component Card hiển thị từng địa chỉ
 * Lưu ý: Đã cập nhật field name theo Interface mới (receiverName, defaultAddress...)
 */
const AddressCard: React.FC<{
  addr: ICustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}> = ({ addr, onEdit, onDelete, onSetDefault }) => {
  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      {/* Phần Thông tin */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-base font-semibold text-gray-800 flex-1 mr-2">
          {addr.receiverName}
        </Text>
        <TouchableOpacity onPress={onEdit} className="p-1">
          <Ionicons name="pencil" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-600 mb-1">{addr.phone}</Text>
      <Text className="text-sm text-gray-700 leading-5">
        {`${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`}
      </Text>
      {addr.note ? (
        <Text className="text-xs italic text-gray-500 mt-2">
          Ghi chú: {addr.note}
        </Text>
      ) : null}

      {/* Phần Actions */}
      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {addr.defaultAddress ? (
          <View className="bg-green-100 py-1 px-3 rounded-full">
            <Text className="text-green-700 text-xs font-semibold">
              Mặc định
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onSetDefault}
            className="border border-gray-300 py-1 px-3 rounded-full"
          >
            <Text className="text-gray-700 text-xs font-semibold">
              Đặt mặc định
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onDelete} className="p-1">
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Component Giao diện chính Quản lý địa chỉ
 */
const ShippingAddress: React.FC<ShippingAddressProps> = ({ onBack }) => {
  const { bottom } = useSafeAreaInsets();

  // 1. Lấy Data & Action từ AddressContext
  const {
    addresses,
    openAddModal,
    openEditModal,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  // 2. Lấy Action từ ConfirmContext
  const { showConfirm } = useConfirm();

  // 3. Xử lý xóa với Confirm Modal
  const handleDeletePress = (address: ICustomerAddress) => {
    showConfirm({
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa địa chỉ của "${address.receiverName}"?`,
      confirmText: "Xóa",
      confirmVariant: "destructive",
      onConfirm: async () => {
        await deleteAddress(address.id);
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-white border-b border-gray-100 mt-8">
        <View className="absolute left-4 top-2">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBack}
          />
        </View>
        <Text className="text-center text-xl font-bold text-gray-800 pt-2">
          Địa chỉ của tôi
        </Text>
      </View>

      {/* Danh sách địa chỉ */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AddressCard
            addr={item}
            onEdit={() => openEditModal(item)}
            onDelete={() => handleDeletePress(item)}
            onSetDefault={() => setDefaultAddress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="location-outline" size={48} color="#9CA3AF" />
            <Text className="text-center text-gray-500 mt-4">
              Bạn chưa có địa chỉ nào.
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />

      {/* Nút Thêm mới (Sticky Bottom) */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100"
        style={{
          paddingBottom: bottom || 16,
          paddingTop: 12,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={openAddModal}
          className="bg-green-600 py-3.5 rounded-xl flex-row justify-center items-center shadow-sm"
          disabled={addresses.length >= 5} // Giới hạn 5 địa chỉ
          style={{ opacity: addresses.length >= 5 ? 0.6 : 1 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Thêm địa chỉ mới ({addresses.length}/5)
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✨ Modal Thêm/Sửa Địa chỉ 
         Được import từ file riêng, tự nó quản lý logic hiển thị dựa trên Context
      */}
      <AddressEditModal />
    </View>
  );
};

export default ShippingAddress;
