// components/features/user/ShippingAddress.tsx
import type { Address } from "@/context/user/useAddressLogic";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ShippingAddressProps = {
  addresses: Address[];
  showAddEditModal: boolean;
  setShowAddEditModal: (v: boolean) => void;
  form: Partial<Address>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Address>>>;
  editingAddress: Address | null;
  openAddModal: () => void;
  openEditModal: (addr: Address) => void;
  handleSaveAddress: () => void;
  handleDelete: (id?: number) => void;
  setDefault: (id?: number) => void;
  onBack?: () => void;
};

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  addresses,
  showAddEditModal,
  setShowAddEditModal,
  form,
  setForm,
  editingAddress,
  openAddModal,
  openEditModal,
  handleSaveAddress,
  handleDelete,
  setDefault,
  onBack,
}) => {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-STATUS_BAR border-b border-BORDER">
        <TouchableOpacity onPress={onBack} className="p-2">
          <FontAwesome
            name="arrow-left"
            size={24}
            className="text-TEXT_PRIMARY"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-TEXT_PRIMARY">
          Địa chỉ giao hàng
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        {addresses.length === 0 ? (
          <Text className="text-center text-TEXT_SECONDARY py-10">
            Chưa có địa chỉ nào
          </Text>
        ) : (
          <View className="flex-col gap-y-4 pb-6">
            {addresses.map((addr) => (
              <View
                key={addr.address_id}
                className="bg-INPUT_BG p-4 rounded-xl border border-BORDER"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-semibold text-TEXT_PRIMARY text-base">
                      {addr.receiver_name}
                      {addr.is_default && (
                        <Text className="ml-2 text-PRIMARY text-sm font-medium">
                          [Mặc định]
                        </Text>
                      )}
                    </Text>
                    <Text className="text-TEXT_SECONDARY text-sm mt-1">
                      {addr.phone}
                    </Text>
                    <Text className="text-TEXT_PRIMARY text-sm mt-1">
                      {addr.street}, {addr.ward}, {addr.district},{" "}
                      {addr.province}
                    </Text>
                    {addr.note && (
                      <Text className="text-TEXT_SECONDARY text-xs italic mt-1">
                        Ghi chú: {addr.note}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row justify-end gap-3 mt-3">
                  {!addr.is_default && (
                    <TouchableOpacity
                      onPress={() => setDefault(addr.address_id)}
                      className="px-3 py-1.5 rounded-full border border-PRIMARY"
                    >
                      <Text className="text-PRIMARY text-xs font-medium">
                        Đặt mặc định
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => openEditModal(addr)}
                    className="px-3 py-1.5 rounded-full border border-BORDER"
                  >
                    <Text className="text-TEXT_PRIMARY text-xs font-medium">
                      Sửa
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(addr.address_id)}
                    className="px-3 py-1.5 rounded-full border border-red-500"
                  >
                    <Text className="text-red-500 text-xs font-medium">
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={openAddModal}
          className="w-full bg-PRIMARY py-3.5 rounded-full items-center mt-4 shadow-md"
          disabled={addresses.length >= 5}
        >
          <Text className="text-white font-bold text-base">
            + Thêm địa chỉ mới ({addresses.length}/5)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Thêm / Sửa địa chỉ */}
      <Modal visible={showAddEditModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="items-center mb-4">
              <View className="w-12 h-1 bg-BORDER rounded-full" />
            </View>
            <Text className="text-xl font-bold text-center text-TEXT_PRIMARY mb-5">
              {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-col gap-4">
                {/* Họ & tên */}
                <TextInput
                  placeholder="Họ & tên người nhận"
                  value={form.receiver_name}
                  onChangeText={(v) =>
                    setForm(
                      (s): Partial<Address> => ({ ...s, receiver_name: v })
                    )
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Số điện thoại */}
                <TextInput
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, phone: v }))
                  }
                  keyboardType="phone-pad"
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Tỉnh/Thành phố */}
                <TextInput
                  placeholder="Tỉnh/Thành phố"
                  value={form.province}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, province: v }))
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Quận/Huyện */}
                <TextInput
                  placeholder="Quận/Huyện"
                  value={form.district}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, district: v }))
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Phường/Xã */}
                <TextInput
                  placeholder="Phường/Xã"
                  value={form.ward}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, ward: v }))
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Đường, số nhà */}
                <TextInput
                  placeholder="Đường, số nhà"
                  value={form.street}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, street: v }))
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Ghi chú */}
                <TextInput
                  placeholder="Ghi chú (tùy chọn)"
                  value={form.note}
                  onChangeText={(v) =>
                    setForm((s): Partial<Address> => ({ ...s, note: v }))
                  }
                  className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Đặt mặc định */}
                <TouchableOpacity
                  onPress={() =>
                    setForm(
                      (s): Partial<Address> => ({
                        ...s,
                        is_default: !s.is_default,
                      })
                    )
                  }
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-2 ${
                      form.is_default
                        ? "bg-PRIMARY border-PRIMARY"
                        : "border-BORDER"
                    }`}
                  >
                    {form.is_default && (
                      <FontAwesome name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text className="text-TEXT_PRIMARY text-base">
                    Đặt làm mặc định
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Nút hành động */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setShowAddEditModal(false)}
                className="flex-1 rounded-full border border-BORDER py-3.5"
              >
                <Text className="text-center font-medium text-TEXT_PRIMARY">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveAddress}
                className="flex-1 rounded-full bg-PRIMARY py-3.5"
              >
                <Text className="text-center font-bold text-white">
                  {editingAddress ? "Cập nhật" : "Thêm"}
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
