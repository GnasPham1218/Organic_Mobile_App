// app/user/detail.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ProfileDetail from "@/components/screens/user/ProfileDetail";
import { getAccountAPI, loginAPI } from "@/service/api";

import { AppConfig } from "@/constants/AppConfig";

const UserDetailScreen = () => {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // State quản lý chế độ Sửa
  const [isEditable, setIsEditable] = useState(false); // Mặc định là KHÓA

  // State Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [verifying, setVerifying] = useState(false);

  // 1. Load data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getAccountAPI();
        if (res.data && res.data.data) {
          setUser(res.data.data.user);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 2. Khi người dùng bấm nút "Cây bút" (Chỉnh sửa)
  const handleRequestEdit = () => {
    setPasswordInput("");
    setModalVisible(true); // Mở modal yêu cầu mật khẩu
  };

  // 3. Xác thực mật khẩu
  const verifyPassword = async () => {
    if (!passwordInput || !user?.email) return;

    try {
      setVerifying(true);
      // Check pass bằng loginAPI
      await loginAPI(user.email, passwordInput);

      // --- NẾU ĐÚNG MẬT KHẨU ---
      setModalVisible(false); // Tắt modal
      setIsEditable(true); // MỞ KHÓA INPUT
      Alert.alert("Thành công", "Đã mở khóa. Bạn có thể chỉnh sửa thông tin.");
    } catch (error) {
      Alert.alert("Sai mật khẩu", "Mật khẩu không đúng. Vui lòng thử lại.");
    } finally {
      setVerifying(false);
    }
  };

  // 4. Khi người dùng bấm "Lưu" (Sau khi đã sửa xong)
  const handleSaveData = async (updatedData: any) => {
    try {
      console.log("Đang gọi API Update với data:", updatedData);

      // TODO: Gọi API update profile tại đây (sẽ làm sau)
      // await updateProfileAPI(updatedData);

      Alert.alert("Đã lưu", "Cập nhật thông tin thành công!");

      // Update lại state user để UI hiển thị cái mới
      setUser(updatedData);
      setIsEditable(false); // Khóa lại sau khi lưu xong
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  return (
    <>
      {user && (
        <ProfileDetail
          user={{
            ...user,
            id: user.id,
            avatar: user.avatar
              ? `${AppConfig.AVATAR_URL}${user.avatar}`
              : undefined,
          }}
          isEditable={isEditable} // Truyền trạng thái khóa/mở
          onRequestEdit={handleRequestEdit} // Hàm mở modal
          onSave={handleSaveData} // Hàm lưu (gọi API)
          onBack={() => router.back()}
        />
      )}

      {/* --- MODAL NHẬP PASSWORD --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="w-full"
            >
              <View className="bg-white rounded-2xl p-6 shadow-xl">
                <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                  Mở khóa chỉnh sửa
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Để bảo mật, vui lòng nhập mật khẩu trước khi chỉnh sửa thông
                  tin.
                </Text>

                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-6 text-gray-800 text-lg"
                  placeholder="Mật khẩu của bạn"
                  secureTextEntry
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  autoFocus={true}
                />

                <View className="flex-row gap-4">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="flex-1 py-3.5 rounded-xl bg-gray-100"
                  >
                    <Text className="text-center font-bold text-gray-600">
                      Hủy
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={verifyPassword}
                    disabled={verifying}
                    className={`flex-1 py-3.5 rounded-xl ${verifying ? "bg-green-800" : "bg-green-600"}`}
                  >
                    {verifying ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-center font-bold text-white">
                        Mở khóa
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default UserDetailScreen;
