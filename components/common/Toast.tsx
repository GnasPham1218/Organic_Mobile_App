// components/common/Toast.tsx
import React from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export type ToastType = "success" | "error" | "info" | "warning";

interface Props {
  message: string;
  type?: ToastType;
  opacity: Animated.Value;
}

const { width } = Dimensions.get("window");

const Toast: React.FC<Props> = ({ message, type = "info", opacity }) => {
  const styleMap = {
    success: { color: "bg-green-600", icon: "check-circle" },
    error: { color: "bg-red-600", icon: "times-circle" },
    info: { color: "bg-blue-600", icon: "info-circle" },
    warning: { color: "bg-yellow-500", icon: "exclamation-circle" },
  };

  const { color, icon } = styleMap[type];

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute inset-0 justify-center items-center z-50 pointer-events-none"
    >
      {/* Toast container */}
      <View
        className={`${color} flex-row items-center px-5 py-4 rounded-xl shadow-lg`}
        style={{ maxWidth: width * 0.8 }}
      >
        <FontAwesome name={icon as any} size={20} color="#fff" className="mr-3" />
        <Text className="text-white text-base font-semibold text-center">{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
