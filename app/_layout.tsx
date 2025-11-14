// app/_layout.tsx
import { AddressProvider } from "@/context/address/AddressContext";
import { CartProvider } from "@/context/cart/CartContext";
import { ConfirmProvider } from "@/context/confirm/ConfirmContext";
import { ToastProvider } from "@/context/notifications/ToastContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import "../theme/global.css";
import { COLORS } from "../theme/tokens";
import AddressEditModal from "./user/AddressEditModal";

export default function RootLayout() {
  return (
    <SafeAreaView
      className="flex-1 bg-STATUS_BAR"
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        style="dark"
        backgroundColor={COLORS.STATUS_BAR}
        translucent={false}
        hidden={false}
      />
      <ToastProvider>
        <ConfirmProvider>
          <CartProvider>
            <AddressProvider>
              <Stack
                initialRouteName="index"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <AddressEditModal />
            </AddressProvider>
          </CartProvider>
        </ConfirmProvider>
      </ToastProvider>
    </SafeAreaView>
  );
}
