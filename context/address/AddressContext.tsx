import {
  createAddressAPI,
  deleteAddressAPI,
  getAddressesByUserIdAPI,
  setDefaultAddressAPI,
  updateAddressAPI,
} from "@/service/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Type cho dữ liệu form
type AddressFormType = {
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  note: string;
  defaultAddress: boolean;
};

interface AddressContextType {
  // Data
  addresses: ICustomerAddress[];
  loading: boolean;
  provinces: IProvince[];
  districts: IDistrict[];
  wards: IWard[];

  // Form State
  showAddEditModal: boolean;
  setShowAddEditModal: (v: boolean) => void;
  form: AddressFormType;
  setForm: React.Dispatch<React.SetStateAction<AddressFormType>>;
  editingAddress: ICustomerAddress | null;

  // Actions
  initData: (userId: number) => void;
  openAddModal: () => void;
  openEditModal: (addr: ICustomerAddress) => void;
  saveAddress: () => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;

  // Helper select hành chính
  handleSelectProvince: (provinceName: string) => void;
  handleSelectDistrict: (districtName: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<ICustomerAddress[]>([]);
  const [loading, setLoading] = useState(false);

  // Data hành chính
  const [vietnamData, setVietnamData] = useState<IProvince[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  // Modal & Form State
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ICustomerAddress | null>(
    null
  );
  const [form, setForm] = useState<AddressFormType>({
    receiverName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    note: "",
    defaultAddress: false,
  });

  // 1. Fetch dữ liệu hành chính Việt Nam khi mount
  useEffect(() => {
    const fetchAdministrativeUnits = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        const data = await response.json();
        setVietnamData(data);
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi tải data hành chính:", error);
      }
    };
    fetchAdministrativeUnits();
  }, []);

  // 2. Load danh sách địa chỉ khi có userId
  const fetchAddresses = async (uid: number) => {
    if (!uid) return;
    try {
      setLoading(true);
      const res = await getAddressesByUserIdAPI(uid);
      if (res.data && res.data.data) {
        // Sort: Mặc định lên đầu
        const sorted = res.data.data.sort(
          (a, b) => Number(b.defaultAddress) - Number(a.defaultAddress)
        );
        setAddresses(sorted);
      }
    } catch (error) {
      console.log("Lỗi tải danh sách địa chỉ:", error);
    } finally {
      setLoading(false);
    }
  };

  const initData = (uid: number) => {
    setUserId(uid);
    fetchAddresses(uid);
  };

  // 3. Logic Form & Modal
  const openAddModal = () => {
    setEditingAddress(null);
    setForm({
      receiverName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      note: "",
      defaultAddress: false,
    });
    setDistricts([]); // Reset huyện
    setWards([]); // Reset xã
    setShowAddEditModal(true);
  };

  const openEditModal = (addr: ICustomerAddress) => {
    setEditingAddress(addr);
    setForm({
      receiverName: addr.receiverName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      street: addr.street,
      note: addr.note || "",
      defaultAddress: addr.defaultAddress,
    });

    // Logic tái tạo danh sách Huyện/Xã dựa trên tên đã lưu (Khá phức tạp vì cần tìm ngược lại ID)
    // Để đơn giản: Khi sửa, nếu muốn đổi địa chỉ hành chính thì người dùng chọn lại từ đầu (Tỉnh -> Huyện -> Xã)
    const selectedProv = vietnamData.find((p) => p.Name === addr.province);
    if (selectedProv) {
      setDistricts(selectedProv.Districts);
      const selectedDist = selectedProv.Districts.find(
        (d) => d.Name === addr.district
      );
      if (selectedDist) {
        setWards(selectedDist.Wards);
      }
    }

    setShowAddEditModal(true);
  };

  // 4. Logic Chọn Hành chính (Cascading)
  const handleSelectProvince = (provinceName: string) => {
    const province = vietnamData.find((p) => p.Name === provinceName);
    setForm((prev) => ({
      ...prev,
      province: provinceName,
      district: "",
      ward: "",
    }));
    setDistricts(province ? province.Districts : []);
    setWards([]);
  };

  const handleSelectDistrict = (districtName: string) => {
    const district = districts.find((d) => d.Name === districtName);
    setForm((prev) => ({ ...prev, district: districtName, ward: "" }));
    setWards(district ? district.Wards : []);
  };

  // 5. CRUD Actions
  const saveAddress = async () => {
    if (!userId) return;
    // Validate cơ bản
    if (
      !form.receiverName ||
      !form.phone ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.street
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    try {
      if (editingAddress) {
        // --- UPDATE ---
        const payload: IUpdateCustomerAddressDTO = {
          receiverName: form.receiverName,
          phone: form.phone,
          province: form.province,
          district: form.district,
          ward: form.ward,
          street: form.street,
          note: form.note,
          defaultAddress: form.defaultAddress,
        };
        await updateAddressAPI(editingAddress.id, payload);
        Alert.alert("Thành công", "Cập nhật địa chỉ thành công");
      } else {
        // --- CREATE ---
        const payload: ICreateCustomerAddressDTO = {
          userId: userId,
          receiverName: form.receiverName,
          phone: form.phone,
          province: form.province,
          district: form.district,
          ward: form.ward,
          street: form.street,
          note: form.note,
          defaultAddress: form.defaultAddress,
        };
        await createAddressAPI(payload);
        Alert.alert("Thành công", "Thêm địa chỉ mới thành công");
      }

      setShowAddEditModal(false);
      fetchAddresses(userId); // Reload list
    } catch (error) {
      console.log("Save address error:", error);
      Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await deleteAddressAPI(id);
      if (userId) fetchAddresses(userId);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa địa chỉ này.");
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      await setDefaultAddressAPI(id);
      if (userId) fetchAddresses(userId);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đặt mặc định.");
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        provinces,
        districts,
        wards,
        showAddEditModal,
        setShowAddEditModal,
        form,
        setForm,
        editingAddress,
        initData,
        openAddModal,
        openEditModal,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        handleSelectProvince,
        handleSelectDistrict,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context)
    throw new Error("useAddress must be used within AddressProvider");
  return context;
};
