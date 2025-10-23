// src/context/profile/useProfileLogic.ts
import { useState } from "react";
import { Alert } from "react-native";

export type UserType = {
  user_id: number;
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

type UseProfileLogicProps = {
  user: UserType;
  currentPassword: string;
  onSave?: (user: UserType) => Promise<void> | void;
};

export const useProfileLogic = ({
  user,
  currentPassword,
  onSave,
}: UseProfileLogicProps) => {
  const [form, setForm] = useState<UserType>({ ...user });
  const [original] = useState<UserType>({ ...user });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCurrentPasswordModal, setShowCurrentPasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [inputCurrentPassword, setInputCurrentPassword] = useState("");
  const [showPlainPassword, setShowPlainPassword] = useState(false);

  const [authPasswordInput, setAuthPasswordInput] = useState("");

  // Kiểm tra có thay đổi không
  const hasChanges = () => {
    return (
      form.name !== original.name ||
      form.email !== original.email ||
      form.phone !== original.phone ||
      form.image !== original.image ||
      !!form.password
    );
  };

  // Xử lý chọn ảnh (demo)
  const handlePickAvatar = () => {
    Alert.alert("Ảnh đại diện", "Demo – dùng ảnh mẫu.", [
      {
        text: "Dùng ảnh mẫu",
        onPress: () =>
          setForm((s) => ({
            ...s,
            image: "https://i.pravatar.cc/300?u=" + Date.now(),
          })),
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // Xác thực trước khi lưu
  const handleConfirmSave = () => {
    if (!hasChanges()) {
      Alert.alert("Không có thay đổi", "Thông tin chưa được chỉnh sửa.");
      return;
    }
    setShowAuthModal(true);
  };

  // Lưu cuối cùng
  const handleFinalSave = async () => {
    if (authPasswordInput !== currentPassword) {
      Alert.alert("Sai mật khẩu", "Mật khẩu bạn nhập không đúng.");
      return;
    }

    if (!form.name?.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên.");
      return;
    }
    if (!form.email?.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    try {
      const saveData = { ...form };
      if (!saveData.password) delete saveData.password;

      await (onSave ? onSave(saveData) : Promise.resolve());
      setShowAuthModal(false);
      setAuthPasswordInput("");
      Alert.alert("Thành công", "Thông tin đã được lưu.");
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu. Vui lòng thử lại.");
    }
  };

  // Xem mật khẩu hiện tại
  const handleShowCurrentPassword = () => {
    if (inputCurrentPassword === currentPassword) {
      setShowPlainPassword(true);
      setShowCurrentPasswordModal(false);
      setInputCurrentPassword("");
    } else {
      Alert.alert("Sai mật khẩu", "Mật khẩu bạn nhập không đúng.");
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = () => {
    if (oldPassword !== currentPassword) {
      Alert.alert("Lỗi", "Mật khẩu cũ không đúng.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    setForm((s) => ({ ...s, password: newPassword }));
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Đã cập nhật", "Mật khẩu mới sẽ được lưu khi bạn nhấn 'Lưu thay đổi'.");
  };

  return {
    // State
    form,
    setForm,
    showPasswordModal,
    setShowPasswordModal,
    showAuthModal,
    setShowAuthModal,
    showCurrentPasswordModal,
    setShowCurrentPasswordModal,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    inputCurrentPassword,
    setInputCurrentPassword,
    showPlainPassword,
    authPasswordInput,
    setAuthPasswordInput,
    hasChanges,

    // Handlers
    handlePickAvatar,
    handleConfirmSave,
    handleFinalSave,
    handleShowCurrentPassword,
    handleChangePassword,
  };
};