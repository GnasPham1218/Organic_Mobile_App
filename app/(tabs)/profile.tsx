import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Component con cho từng mục menu ---
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

// --- Component chính của màn hình Profile ---
const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () => console.log("User logged out!"),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      {/* ===== Header ===== */}
      <View className="border-b border-BORDER bg-STATUS_BAR py-4">
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Tài khoản của tôi
        </Text>
      </View>

      <View className="px-4">
        {/* ===== Nhóm TÀI KHOẢN ===== */}
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
            onPress={() => router.push("/user/address")}
          />
          <ProfileMenuItem
            icon="history"
            label="Lịch sử đơn hàng"
            onPress={() => router.push("/order/order_history")}
          />
          <ProfileMenuItem
            icon="credit-card"
            label="Lịch sử thanh toán"
            onPress={() => router.push("/user/payment_history")}
          />
          {/* ===>>> MỤC ĐƯỢC DI CHUYỂN ĐẾN ĐÂY <<<=== */}
          <ProfileMenuItem
            icon="exchange"
            label="Lịch sử đổi trả"
            onPress={() => router.push("/return/return_history")}
          />
        </View>

        {/* ===== Nhóm DỊCH VỤ ===== */}
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

        {/* ===== Nhóm HỖ TRỢ ===== */}
        <Text className="mt-8 mb-2 text-sm font-semibold text-TEXT_SECONDARY">
          HỖ TRỢ
        </Text>
        <View className="divide-y divide-BORDER overflow-hidden rounded-xl border border-BORDER">
          <ProfileMenuItem
            icon="phone"
            label="Liên hệ với chúng tôi"
            onPress={() => router.push('/supports/contact')}
          />
          <ProfileMenuItem
            icon="question-circle-o"
            label="Câu hỏi thường gặp (FAQ)"
            onPress={() => router.push('/supports/faq')}
          />
          <ProfileMenuItem
            icon="shield"
            label="Chính sách & Điều khoản"
            onPress={() => router.push('/supports/policy')}
          />
        </View>

        {/* ===== Nút ĐĂNG XUẤT ===== */}
        <View className="mt-8 overflow-hidden rounded-xl border border-BORDER">
          <ProfileMenuItem
            icon="sign-out"
            label="Đăng xuất"
            onPress={handleLogout}
            isDestructive
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
