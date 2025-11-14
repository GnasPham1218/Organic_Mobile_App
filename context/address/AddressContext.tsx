// context/address/AddressContext.tsx
import { Address, mockAddresses } from "@/data/mockData";
import { useToast } from "@/context/notifications/ToastContext";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

// Định nghĩa form
type AddressForm = Partial<Address>;

// Định nghĩa mọi thứ Context sẽ cung cấp
interface AddressContextType {
  // State
  addresses: Address[];
  selectedAddress: Address | null;
  showAddEditModal: boolean;
  form: AddressForm;
  editingAddress: Address | null;

  // Methods
  setSelectedAddress: (address: Address) => void;
  setShowAddEditModal: (v: boolean) => void;
  setForm: React.Dispatch<React.SetStateAction<AddressForm>>;
  openAddModal: () => void;
  openEditModal: (addr: Address) => void;
  saveAddress: () => void;
  deleteAddress: (id?: number) => void;
  setDefaultAddress: (id?: number) => void;
}

// Tạo Context
const AddressContext = createContext<AddressContextType | undefined>(undefined);

// Form rỗng mặc định (khớp với Partial<Address>)
const EMPTY_FORM: AddressForm = {
  receiver_name: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  street: "",
  is_default: false,
  note: "",
};

// Tạo Provider (component bao bọc)
export const AddressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddressState] = useState<Address | null>(
    () => addresses.find((a) => a.is_default) || addresses[0] || null
  );

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingAddress(null);
    setShowAddEditModal(true);
  };

  const openEditModal = (addr: Address) => {
    setForm(addr);
    setEditingAddress(addr);
    setShowAddEditModal(true);
  };

  const closeModal = () => {
    setShowAddEditModal(false);
    setForm(EMPTY_FORM);
    setEditingAddress(null);
  };

  // ▼▼▼ SỬA LỖI TẠI ĐÂY ▼▼▼
  const saveAddress = () => {
    // 1. SỬA LỖI VALIDATION: Thêm tất cả các trường string bắt buộc
    if (
      !form.receiver_name ||
      !form.phone ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.street
    ) {
      showToast("error", "Vui lòng điền đủ thông tin được yêu cầu");
      return;
    }

    if (editingAddress) {
      // --- Cập nhật ---
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.address_id === editingAddress.address_id
            ? ({ ...addr, ...form } as Address) // Dùng as Address để đảm bảo
            : addr
        )
      );
      showToast("success", "Cập nhật địa chỉ thành công");
    } else {
      // --- Thêm mới ---

      // 2. SỬA LỖI TẠO OBJECT (Lỗi 2322)
      // Tạo object mới tuân thủ 'Address',
      // không dùng spread '...form' (vì nó là Partial<Address>)
      const newAddress: Address = {
        address_id: Date.now(), // ID tạm
        user_id: 1, // User ID tạm

        // Các trường đã được validate (nên dùng !)
        receiver_name: form.receiver_name!,
        phone: form.phone!,
        province: form.province!,
        district: form.district!,
        ward: form.ward!,
        street: form.street!,

        // Các trường tùy chọn (dùng || để có giá trị mặc định)
        is_default: form.is_default || false,
        note: form.note || null,
      };

      setAddresses((prev) => [newAddress, ...prev]);
      showToast("success", "Thêm địa chỉ mới thành công");
    }
    closeModal();
  };
  // ▲▲▲ KẾT THÚC SỬA LỖI ▲▲▲

  const deleteAddress = (id?: number) => {
    if (!id) return;
    setAddresses((prev) => prev.filter((addr) => addr.address_id !== id));
    showToast("success", "Đã xóa địa chỉ");
  };

  const setDefaultAddress = (id?: number) => {
    if (!id) return;
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr.address_id === id,
      }))
    );
    // Cập nhật luôn selectedAddress nếu đang ở trang checkout
    const newDefault = addresses.find(a => a.address_id === id);
    if(newDefault) {
      setSelectedAddressState(newDefault);
    }
    showToast("success", "Đã đặt làm địa chỉ mặc định");
  };

  const setSelectedAddress = (address: Address) => {
    setSelectedAddressState(address);
  };

  const value = useMemo(
    () => ({
      addresses,
      selectedAddress,
      showAddEditModal,
      form,
      editingAddress,
      setSelectedAddress,
      setShowAddEditModal,
      setForm,
      openAddModal,
      openEditModal,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
    }),
    [addresses, selectedAddress, showAddEditModal, form, editingAddress]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};