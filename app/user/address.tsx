// app/user/address.tsx  ← SỬA THÀNH THẾ NÀY

import ShippingAddress from "@/components/screens/user/ShippingAddress";
import { useAddress } from "@/context/address/AddressContext"; // Giờ dùng được luôn
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AddressPage() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { initData, loading } = useAddress();

  useEffect(() => {
    if (userId) {
      initData(Number(userId));
    }
  }, [userId]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View className="flex-1 justify-center items-center bg-BACKGROUND">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <ShippingAddress onBack={() => router.back()} />
      )}
    </>
  );
}
