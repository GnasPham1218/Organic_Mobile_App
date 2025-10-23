// app/user/address.tsx
import ShippingAddress from "@/components/features/user/ShippingAddress";
import { useAddressLogic } from "@/context/user/useAddressLogic";
import { useRouter } from "expo-router";

export default function AddressPage() {
  const router = useRouter();

  const logic = useAddressLogic({
    initialAddresses: [],
    onSave: (data) => console.log("Saved:", data),
  });

  return <ShippingAddress onBack={() => router.back()} {...logic} />;
}
