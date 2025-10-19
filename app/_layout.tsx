// app/_layout.js hoặc app/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../context/CartContext";
import "../theme/global.css";
import { COLORS } from "../theme/tokens"; // Import tokens màu sắc

export default function RootLayout() {
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-STATUS_BAR"
        edges={["top", "left", "right"]}
      >
        <StatusBar
          style="dark"
          backgroundColor={COLORS.STATUS_BAR} // Sử dụng token
          translucent={false}
          hidden={false}
        />

        <CartProvider>
          <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
          >
            {/* Trang gốc */}
            <Stack.Screen name="index" />

            {/* Nhóm tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
      </SafeAreaView>
    </>
  );
}
