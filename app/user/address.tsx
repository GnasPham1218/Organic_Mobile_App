// app/user/address.tsx
import ShippingAddress from "@/components/screens/user/ShippingAddress";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
// Import Provider và Hook
import { AddressProvider, useAddress } from "@/context/address/AddressContext";
import { ActivityIndicator, View } from "react-native";

// 1. Tạo Component con để dùng được hook useAddress
const AddressContent = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  // Bây giờ gọi hook ở đây mới an toàn vì đã nằm trong Provider
  const { initData, loading } = useAddress();

  useEffect(() => {
    if (userId) {
      initData(Number(userId));
    }
  }, [userId]);

  if (loading && !userId) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {/* ShippingAddress đã tự kết nối context bên trong nó, chỉ cần truyền onBack */}
      <ShippingAddress onBack={() => router.back()} />
    </>
  );
};

// 2. Component chính export ra ngoài (Bọc Provider)
export default function AddressPage() {
  return (
    <AddressProvider>
      <AddressContent />
    </AddressProvider>
  );
}
