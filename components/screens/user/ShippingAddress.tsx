import type { Address } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal, // Thêm lại Modal
  ScrollView,
  Text, // Thêm lại ScrollView
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// ✨ 1. Import hook useConfirm
import { useConfirm } from "@/context/confirm/ConfirmContext";
import IconButton from "@/components/common/IconButton";

// ✨ Tách props ra để dễ đọc
type AddressLogicProps = {
  addresses: Address[];
  showAddEditModal: boolean;
  setShowAddEditModal: (v: boolean) => void;
  form: Partial<Address>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Address>>>;
  editingAddress: Address | null;
  openAddModal: () => void;
  openEditModal: (addr: Address) => void;
  saveAddress: () => void;
  deleteAddress: (id?: number) => void;
  setDefaultAddress: (id?: number) => void;
};

type ShippingAddressProps = AddressLogicProps & {
  onBack: () => void;
};

/**
 * Component Card địa chỉ
 */
const AddressCard: React.FC<{
  addr: Address;
  onEdit: () => void;
  onDelete: () => void; // Sẽ được gọi bởi showConfirm
  onSetDefault: () => void;
}> = ({ addr, onEdit, onDelete, onSetDefault }) => {
  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      {/* Phần Thông tin */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-base font-semibold text-gray-800 flex-1">
          {addr.receiver_name}
        </Text>
        <TouchableOpacity onPress={onEdit} className="p-1">
          <Ionicons name="pencil" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-600 mb-1">{addr.phone}</Text>
      <Text className="text-sm text-gray-700 leading-5">
        {`${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`}
      </Text>
      {addr.note && (
        <Text className="text-xs italic text-gray-500 mt-2">
          Ghi chú: {addr.note}
        </Text>
      )}

      {/* Phần Actions */}
      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {addr.is_default ? (
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

        {/* ✨ Nút xóa này sẽ gọi prop 'onDelete' (đã được bọc bởi confirm) */}
        <TouchableOpacity onPress={onDelete} className="p-1">
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Component Giao diện chính
 */
const ShippingAddress: React.FC<ShippingAddressProps> = ({
  addresses,
  showAddEditModal,
  setShowAddEditModal,
  form,
  setForm,
  editingAddress,
  openAddModal,
  openEditModal,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  onBack,
}) => {
  const { bottom } = useSafeAreaInsets();
  // ✨ 2. Khởi tạo hook
  const { showConfirm } = useConfirm();

  // ✨ 3. Tạo một hàm mới để xử lý việc xóa
  const handleDeletePress = (address: Address) => {
    // Gọi modal xác nhận
    showConfirm({
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa địa chỉ "${address.receiver_name}"?`,
      confirmText: "Xóa",
      confirmVariant: "destructive", // Nút màu đỏ
      onConfirm: () => {
        // Chỉ gọi hàm xóa thật sự khi người dùng bấm "Xóa"
        deleteAddress(address.address_id);
      },
      // onCancel không cần làm gì cả, modal sẽ tự đóng
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBack}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-TEXT_PRIMARY">
          Địa chỉ của tôi
        </Text>
      </View>

      {/* Danh sách địa chỉ */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.address_id.toString()}
        renderItem={({ item }) => (
          <AddressCard
            addr={item}
            onEdit={() => openEditModal(item)}
            // ✨ 4. Gọi hàm handleDeletePress mới thay vì deleteAddress
            onDelete={() => handleDeletePress(item)}
            onSetDefault={() => setDefaultAddress(item.address_id)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 py-10">
            Bạn chưa có địa chỉ nào.
          </Text>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />

      {/* Nút Thêm mới (Sticky) */}
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
          className="bg-green-600 py-3.5 rounded-lg flex-row justify-center items-center"
          disabled={addresses.length >= 5} // Logic cũ giữ nguyên
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold text-base ml-2">
            Thêm địa chỉ mới ({addresses.length}/5)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal: Thêm / Sửa địa chỉ (Thiết kế lại) */}
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
                  value={form.note || ""} // Đảm bảo value không phải là null/undefined
                  onChangeText={(v) => setForm((s) => ({ ...s, note: v }))}
                  className="bg-gray-100 px-4 py-3 rounded-lg text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Checkbox Đặt mặc định */}
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
    </View>
  );
};

export default ShippingAddress;
