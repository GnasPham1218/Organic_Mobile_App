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
  isLocationReady: boolean; // ✅ Mới: Trạng thái tải data hành chính
  selectedAddress: ICustomerAddress | null;
  setSelectedAddress: (addr: ICustomerAddress | null) => void;
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
  retryFetchLocation: () => void; // ✅ Mới: Hàm thử tải lại data

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
  const [selectedAddress, setSelectedAddress] =
    useState<ICustomerAddress | null>(null);

  // Data hành chính
  const [vietnamData, setVietnamData] = useState<IProvince[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [isLocationReady, setIsLocationReady] = useState(false); // ✅ State mới

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

  // 1. Fetch dữ liệu hành chính Việt Nam
  const fetchAdministrativeUnits = async () => {
    try {
      console.log("Đang tải dữ liệu hành chính..."); // ✅ Log
      const response = await fetch(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      const data = await response.json();
      setVietnamData(data);
      setProvinces(data);
      setIsLocationReady(true); // ✅ Đánh dấu đã tải xong
      console.log("Tải dữ liệu hành chính thành công:", data.length, "tỉnh");
    } catch (error) {
      console.error("Lỗi tải data hành chính:", error);
      setIsLocationReady(false);
    }
  };

  useEffect(() => {
    fetchAdministrativeUnits();
  }, []);

  // 2. Load danh sách địa chỉ khi có userId
  const fetchAddresses = async (uid: number) => {
    if (!uid) return;
    try {
      setLoading(true);
      const res = await getAddressesByUserIdAPI(uid);
      if (res.data && res.data.data) {
        const sorted = res.data.data.sort(
          (a, b) => Number(b.defaultAddress) - Number(a.defaultAddress)
        );
        setAddresses(sorted);
        if (sorted.length > 0) {
          const defaultAddr = sorted.find((a) => a.defaultAddress) || sorted[0];
          setSelectedAddress((prev) => {
            if (!prev) return defaultAddr;
            const exists = sorted.find((a) => a.id === prev.id);
            return exists ? prev : defaultAddr;
          });
        } else {
          setSelectedAddress(null);
        }
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
    setDistricts([]);
    setWards([]);
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

    // Logic tái tạo danh sách Huyện/Xã
    if (vietnamData.length > 0) {
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
    } else {
      // Nếu data chưa tải xong mà mở Modal sửa, thử tải lại hoặc cảnh báo
      console.log("Chưa có data hành chính để fill dropdown");
    }

    setShowAddEditModal(true);
  };

  // 4. Logic Chọn Hành chính
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
        const payload: ICreateCustomerAddressDTO = {
          user: { id: userId },
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
      fetchAddresses(userId);
    } catch (error) {
      console.log("Save address error:", error);
      Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await deleteAddressAPI(id);
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
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
        isLocationReady, // ✅ Export trạng thái
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
        selectedAddress,
        setSelectedAddress,
        retryFetchLocation: fetchAdministrativeUnits, // ✅ Export hàm retry
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
