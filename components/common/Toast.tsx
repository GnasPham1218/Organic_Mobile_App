// components/common/Toast.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Animated, Dimensions, Text, View } from "react-native";
// (LƯU Ý: Nếu bạn dùng Safe Area Insets để tránh notch, bạn cần import thêm hook đó)
// import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info" | "warning";

interface Props {
  message: string;
  type?: ToastType;
  opacity: Animated.Value;
}

const { width } = Dimensions.get("window");

const Toast: React.FC<Props> = ({ message, type = "info", opacity }) => {
  // ✅ FIX LỖI: ĐỊNH NGHĨA styleMap BỊ THIẾU
  // Map style với màu sắc hiện đại hơn và icon tương ứng
  const styleMap = {
    success: {
      bg: "bg-emerald-500",
      border: "border-emerald-600",
      icon: "check",
      iconColor: "#ffffff",
    },
    error: {
      bg: "bg-rose-500",
      border: "border-rose-600",
      icon: "times",
      iconColor: "#ffffff",
    },
    info: {
      bg: "bg-blue-500",
      border: "border-blue-600",
      icon: "info",
      iconColor: "#ffffff",
    },
    warning: {
      bg: "bg-amber-500",
      border: "border-amber-600",
      icon: "exclamation",
      iconColor: "#ffffff",
    },
  };

  const currentStyle = styleMap[type];

  // Animation scale nhẹ để tạo hiệu ứng "pop" khi xuất hiện (kết hợp với opacity)
  const scale = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ scale }],
      }}
      className="absolute inset-0 justify-center items-center z-50 pointer-events-none"
    >
      {/* Toast container */}
      <View
        className={`
          ${currentStyle.bg} 
          flex-row items-center 
          px-6 py-4 
          rounded-2xl 
          shadow-lg shadow-black/30 
          border-b-4 ${currentStyle.border}
        `}
        style={{
          // Tăng giới hạn chiều rộng an toàn
          maxWidth: width * 0.95, // Rộng 95%
          minWidth: width * 0.9, // Tối thiểu 60%
          elevation: 6,
        }}
      >
        {/* Icon Container: Đã thêm flex-none */}
        <View className="mr-4 bg-white/20 rounded-full p-2 w-10 h-10 items-center justify-center flex-none">
          <FontAwesome
            name={currentStyle.icon as any}
            size={13}
            color={currentStyle.iconColor}
          />
        </View>

        {/* Text Container: Đã thêm shrink và flex-1 */}
        <View className="flex-1 shrink justify-center">
          <Text
            className="text-white text-[15px] font-semibold leading-5"
            numberOfLines={3}
          >
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default Toast;
