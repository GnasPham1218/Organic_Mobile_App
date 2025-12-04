import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image, // Import thêm Image
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import API và Type
import { AppConfig } from "@/constants/AppConfig";
import { getAccountAPI, logoutAPI } from "@/service/api";

// --- Component con (Giữ nguyên) ---
type ProfileMenuItemProps = {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
};

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  onPress,
  isDestructive = false,
}) => {
  const textColor = isDestructive ? "text-red-600" : "text-TEXT_PRIMARY";
  const iconColor = isDestructive ? "#DC2626" : "#1B4332";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white p-4"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <FontAwesome name={icon} size={20} color={iconColor} className="w-6" />
        <Text className={`ml-4 text-base ${textColor}`}>{label}</Text>
      </View>
      {!isDestructive && (
        <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
};

// --- Component chính ---
const ProfileScreen = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<IUser | null>(null); // Dùng type IUser

  // ===> LOGIC FETCH DATA TỪ API <===
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          // 1. Kiểm tra Token
          const token = await AsyncStorage.getItem("accessToken");
          if (!token) {
            setIsLoggedIn(false);
            setUserInfo(null);
            return;
          }

          // 2. Có token -> Set trạng thái đăng nhập trước (để UI ko bị nhảy)
          setIsLoggedIn(true);

          // 3. Gọi API lấy thông tin mới nhất từ Server
          try {
            const res = await getAccountAPI();
            if (res.data && res.data.data) {
              const userFromApi = res.data.data.user;
              setUserInfo(userFromApi);

              // Cập nhật lại cache local luôn cho lần sau
              await AsyncStorage.setItem(
                "userInfo",
                JSON.stringify(userFromApi)
              );
            }
          } catch (apiError) {
            console.log("Lỗi gọi API Account (có thể do mạng):", apiError);
            // Nếu API lỗi (mất mạng), fallback về dữ liệu cũ trong AsyncStorage
            const cachedUser = await AsyncStorage.getItem("userInfo");
            if (cachedUser) {
              setUserInfo(JSON.parse(cachedUser));
            }
          }
        } catch (error) {
          console.log("Error checking login status:", error);
        }
      };

      fetchProfile();
    }, [])
  );

  const onConfirmLogout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.log("Logout error ignored");
    } finally {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userInfo");
      setIsLoggedIn(false);
      setUserInfo(null);
      router.replace("/(auth)/sign-in");
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: onConfirmLogout, style: "destructive" },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      {/* ===== Header ===== */}
      <View className="border-b border-BORDER bg-STATUS_BAR py-4">
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          {isLoggedIn ? "Tài khoản của tôi" : "Chào khách"}
        </Text>
      </View>

      <View className="px-4">
        {!isLoggedIn ? (
          // === GIAO DIỆN KHÁCH (Giữ nguyên) ===
          <View className="mt-6 items-center rounded-xl border border-dashed border-BORDER bg-white p-6">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FontAwesome name="user-secret" size={40} color="#6B7280" />
            </View>
            <Text className="mb-2 text-center text-lg font-bold text-TEXT_PRIMARY">
              Bạn chưa đăng nhập
            </Text>
            <Text className="mb-6 text-center text-gray-500">
              Đăng nhập để xem lịch sử đơn hàng, tích điểm và nhận ưu đãi riêng!
            </Text>
            <View className="w-full gap-y-3">
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in")}
                className="w-full rounded-lg bg-PRIMARY py-3"
              >
                <Text className="text-center font-bold text-white">
                  Đăng nhập ngay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-up")}
                className="w-full rounded-lg border border-PRIMARY py-3"
              >
                <Text className="text-center font-bold text-PRIMARY">
                  Đăng ký tài khoản
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // === GIAO DIỆN NGƯỜI DÙNG ===
          <>
            {userInfo && (
              <View className="mt-4 flex-row items-center bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                {/* ===> LOGIC HIỂN THỊ AVATAR <=== */}
                <View className="mr-4">
                  {userInfo.avatar ? (
                    <Image
                      source={{
                        uri: `${AppConfig.AVATAR_URL}${userInfo.avatar}`,
                      }}
                      className="h-16 w-16 rounded-full border-2 border-white"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-full bg-green-200 border-2 border-white">
                      <Text className="text-2xl font-bold text-green-800">
                        {userInfo.name
                          ? userInfo.name.charAt(0).toUpperCase()
                          : "U"}
                      </Text>
                    </View>
                  )}
                </View>

                {/* ===> LOGIC HIỂN THỊ TÊN & SĐT <=== */}
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold text-TEXT_PRIMARY"
                    numberOfLines={1}
                  >
                    {userInfo.name}
                  </Text>

                  {/* Email */}
                  <Text className="text-gray-500 text-sm mb-1">
                    {userInfo.email}
                  </Text>

                  {/* Số điện thoại (Hiển thị nếu có) */}
                  {userInfo.phone ? (
                    <View className="flex-row items-center">
                      <FontAwesome name="phone" size={12} color="#16a34a" />
                      <Text className="ml-1 text-sm font-medium text-green-600">
                        {userInfo.phone}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-xs text-gray-400 italic">
                      Chưa cập nhật SĐT
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Các Menu Item (Giữ nguyên) */}
            <Text className="mt-6 mb-2 text-sm font-semibold text-TEXT_SECONDARY">
              TÀI KHOẢN
            </Text>
            <View className="mt-3 divide-y divide-BORDER overflow-hidden rounded-xl border border-BORDER">
              <ProfileMenuItem
                icon="user-o"
                label="Thông tin cá nhân"
                onPress={() => router.push("/user/detail")}
              />
              <ProfileMenuItem
                icon="map-marker"
                label="Địa chỉ giao hàng"
                onPress={() => {
                  if (userInfo && userInfo.id) {
                    // Truyền userId sang trang address
                    router.push({
                      pathname: "/user/address",
                      params: { userId: userInfo.id },
                    });
                  } else {
                    // Fallback nếu chưa load xong user
                    router.push("/user/address");
                  }
                }}
              />
              <ProfileMenuItem
                icon="history"
                label="Lịch sử đơn hàng"
                onPress={() => {
                  if (userInfo && userInfo.id) {
                    // Truyền userId sang trang address
                    router.push({
                      pathname: "/order/order_history",
                      params: { userId: userInfo.id },
                    });
                  } else {
                    // Fallback nếu chưa load xong user
                    router.push("/order/order_history");
                  }
                }}
              />
              <ProfileMenuItem
                icon="exchange"
                label="Lịch sử đổi trả"
                onPress={() => router.push("/return/return_history")}
              />
            </View>

            <Text className="mt-8 mb-2 text-sm font-semibold text-TEXT_SECONDARY">
              DỊCH VỤ
            </Text>
            <View className="mt-3 divide-y divide-BORDER overflow-hidden rounded-xl border border-BORDER">
              <ProfileMenuItem
                icon="ticket"
                label="Mã giảm giá"
                onPress={() => router.push("/voucher/voucher_list")}
              />
              <ProfileMenuItem
                icon="ticket"
                label="Khuyến mãi"
                onPress={() => router.push("/promotion/promotion_list")}
              />
            </View>
          </>
        )}

        {/* Phần Hỗ trợ & Logout (Giữ nguyên) */}
        <Text className="mt-8 mb-2 text-sm font-semibold text-TEXT_SECONDARY">
          HỖ TRỢ
        </Text>
        <View className="divide-y divide-BORDER overflow-hidden rounded-xl border border-BORDER">
          <ProfileMenuItem
            icon="phone"
            label="Liên hệ với chúng tôi"
            onPress={() => router.push("/supports/contact")}
          />
          <ProfileMenuItem
            icon="question-circle-o"
            label="Câu hỏi thường gặp (FAQ)"
            onPress={() => router.push("/supports/faq")}
          />
          <ProfileMenuItem
            icon="shield"
            label="Chính sách & Điều khoản"
            onPress={() => router.push("/supports/policy")}
          />
        </View>

        {isLoggedIn && (
          <View className="mt-8 overflow-hidden rounded-xl border border-BORDER">
            <ProfileMenuItem
              icon="sign-out"
              label="Đăng xuất"
              onPress={handleLogout}
              isDestructive
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
