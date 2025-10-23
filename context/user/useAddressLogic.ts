// context/user/useAddressLogic.ts
import { useState } from "react";
import { Alert } from "react-native";

export type Address = {
  address_id?: number;
  user_id: number;
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  is_default: boolean;
  note?: string;
};

type UseAddressLogicProps = {
  initialAddresses?: Address[]; // optional
  onSave?: (addresses: Address[]) => Promise<void> | void;
};

export const useAddressLogic = ({
  initialAddresses = [],
  onSave,
}: UseAddressLogicProps = {}) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [form, setForm] = useState<Partial<Address>>({
    receiver_name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    note: "",
    is_default: false,
  });

  const resetForm = () => {
    setForm({
      receiver_name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      note: "",
      is_default: false,
    });
    setEditingAddress(null);
  };

  const openAddModal = () => {
    if (addresses.length >= 5) {
      Alert.alert("Giới hạn", "Bạn chỉ có thể lưu tối đa 5 địa chỉ.");
      return;
    }
    resetForm();
    setShowAddEditModal(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setForm({
      receiver_name: addr.receiver_name,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      street: addr.street,
      note: addr.note,
      is_default: addr.is_default,
    });
    setShowAddEditModal(true);
  };

  const handleSaveAddress = () => {
    // Validate
    const required = [
      { value: form.receiver_name, label: "tên người nhận" },
      { value: form.phone, label: "số điện thoại phone" },
      { value: form.province, label: "tỉnh/thành" },
      { value: form.district, label: "quận/huyện" },
      { value: form.ward, label: "phường/xã" },
      { value: form.street, label: "đường/số nhà" },
    ];

    for (const field of required) {
      if (!field.value?.trim()) {
        Alert.alert("Lỗi", `Vui lòng nhập ${field.label}.`);
        return;
      }
    }

    const newAddr: Address = {
      address_id: editingAddress?.address_id || Date.now(),
      user_id: 1, // TODO: lấy từ auth context
      receiver_name: form.receiver_name!,
      phone: form.phone!,
      province: form.province!,
      district: form.district!,
      ward: form.ward!,
      street: form.street!,
      note: form.note?.trim(),
      is_default: form.is_default || false,
    };

    let updated: Address[];

    if (editingAddress) {
      updated = addresses.map((a) =>
        a.address_id === editingAddress.address_id ? newAddr : a
      );
    } else {
      updated = [...addresses, newAddr];
    }

    // Nếu là mặc định → bỏ mặc định các cái khác
    if (newAddr.is_default) {
      updated = updated.map((a) => ({
        ...a,
        is_default: a.address_id === newAddr.address_id,
      }));
    }

    setAddresses(updated);
    setShowAddEditModal(false);
    resetForm();
    onSave?.(updated);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;

    Alert.alert("Xóa địa chỉ", "Bạn có chắc chắn muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          const filtered = addresses.filter((a) => a.address_id !== id);
          setAddresses(filtered);
          onSave?.(filtered);
        },
      },
    ]);
  };

  const setDefault = (id?: number) => {
    if (!id) return;

    const updated = addresses.map((a) => ({
      ...a,
      is_default: a.address_id === id,
    }));
    setAddresses(updated);
    onSave?.(updated);
  };

  return {
    // State
    addresses,
    showAddEditModal,
    setShowAddEditModal,
    form,
    setForm,
    editingAddress,

    // Actions
    openAddModal,
    openEditModal,
    handleSaveAddress,
    handleDelete,
    setDefault,
  };
};