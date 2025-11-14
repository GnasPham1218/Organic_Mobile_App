// app/user/address.tsx
import ShippingAddress from "@/components/screens/user/ShippingAddress";
// ✨ 1. Import hook mới (thay thế useAddressLogic)
import { useAddress } from "@/context/address/AddressContext";
import { Stack, useRouter } from "expo-router";

export default function AddressPage() {
  const router = useRouter();
  // ✨ 2. Lấy toàn bộ logic từ Context
  const logic = useAddress();

  return (
    <>
      {/* Ẩn Header mặc định của trang này */}
      <Stack.Screen options={{ headerShown: false }} />
      {/* ✨ 3. Truyền logic vào component con */}
      <ShippingAddress onBack={() => router.back()} {...logic} />
    </>
  );
}
