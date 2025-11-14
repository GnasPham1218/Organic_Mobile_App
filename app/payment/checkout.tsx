// app/checkout.tsx
import { useAddress } from "@/context/address/AddressContext"; // ✅ Dùng hook này
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---

type PaymentMethodValue = "cod" | "momo" | "vnpay_card";

// ❌ XÓA BỎ interface Address
// ❌ XÓA BỎ const mockAddresses

// --- COMPONENT LỰA CHỌN THANH TOÁN (Giữ nguyên) ---
interface PaymentOptionProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: PaymentMethodValue;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  label,
  icon,
  value,
  isSelected,
  onSelect,
}) => {
  // ... (code component giữ nguyên)
  const selectedClass = isSelected
    ? "border-green-500 bg-green-50"
    : "border-gray-200 bg-white";
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`flex-row items-center p-4 border rounded-lg mb-3 ${selectedClass}`}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isSelected ? "#10B981" : "#6B7280"}
      />
      <Text className="text-base text-gray-800 font-medium ml-4 flex-1">
        {label}
      </Text>
      <Ionicons
        name={isSelected ? "radio-button-on" : "radio-button-off"}
        size={20}
        color={isSelected ? "#10B981" : "#D1D5DB"}
      />
    </TouchableOpacity>
  );
};

/**
 * Màn hình Thanh toán chính
 */
export default function CheckoutScreen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const { selectedAddress } = useAddress(); // ✅ Lấy địa chỉ từ Context

  // --- STATE ---
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodValue>("cod");
  const [isLoading, setIsLoading] = useState(false);

  // ❌ XÓA BỎ state địa chỉ cục bộ

  // ✨ State cho Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

  // --- TÍNH TOÁN TỔNG TIỀN (Lấy tự động từ Cart) ---
  const subtotal = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  const shippingFee = 15000;
  const totalAmount = subtotal + shippingFee - discountAmount;

  // ... (Hàm handleApplyVoucher giữ nguyên)
  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      showToast("error", "Vui lòng nhập mã voucher");
      return;
    }
    setIsCheckingVoucher(true);

    setTimeout(() => {
      const code = voucherCode.trim().toUpperCase();
      if (code === "GIAM10") {
        const discount = subtotal * 0.1;
        setDiscountAmount(discount);
        showToast(
          "success",
          `Áp dụng voucher giảm ${discount.toLocaleString()}đ`
        );
      } else {
        setDiscountAmount(0);
        showToast("error", "Mã voucher không hợp lệ");
      }
      setIsCheckingVoucher(false);
    }, 1000);
  };

  // ... (Hàm handlePayment giữ nguyên)
  const handlePayment = () => {
    // ✨ Thêm kiểm tra địa chỉ trước khi thanh toán
    if (!selectedAddress) {
      showToast("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsLoading(true);

    let paymentData = {
      amount: totalAmount,
      method: "COD",
      provider: "Giao Hàng Nhanh",
      status: "pending",
      address_id: selectedAddress.address_id, // ✨ Lấy ID từ Context
      user_id: selectedAddress.user_id, // ✨ Lấy ID từ Context
    };

    if (selectedMethod === "momo") {
      paymentData.method = "E-Wallet";
      paymentData.provider = "MoMo";
    } else if (selectedMethod === "vnpay_card") {
      paymentData.method = "Credit Card";
      paymentData.provider = "VNPay";
    }

    console.log("Đang gửi lên server:", paymentData);

    setTimeout(() => {
      setIsLoading(false);
      showToast("success", "Đặt hàng thành công!");
      clearCart();
      router.replace("/(tabs)"); // Sửa lại route
    }, 2000);
  };

  // ✨ Thêm xử lý nếu không có địa chỉ
  if (!selectedAddress) {
    return (
      <View className="flex-1 bg-gray-50">
        <Stack.Screen options={{ title: "Thanh toán" }} />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-base text-gray-600 mb-4">
            Vui lòng chọn hoặc thêm địa chỉ giao hàng.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/select_address")} // ✨ Sửa đường dẫn
            className="bg-green-600 py-3 px-5 rounded-lg"
          >
            <Text className="text-white font-semibold">Chọn địa chỉ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Thanh toán" }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* 1. Khối địa chỉ (ĐÃ CẬP NHẬT) */}
        <TouchableOpacity
          onPress={() => router.push("/(modals)/select_address")} // ✨ Sửa đường dẫn
          className="bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              Địa chỉ nhận hàng
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#6B7280"
            />
          </View>
          <View className="flex-row items-start">
            <Ionicons name="location-outline" size={20} color="#333" />
            <View className="ml-3 flex-1">
              {/* ✨ Sửa tên trường (dùng receiver_name) */}
              <Text className="text-base font-medium">
                {selectedAddress.receiver_name}
              </Text>
              <Text className="text-sm text-gray-600">
                {selectedAddress.phone}
              </Text>
              {/* ✨ Sửa hiển thị (ghép 4 trường) */}
              <Text
                className="text-sm text-gray-600"
                style={{ lineHeight: 20 }}
              >
                {`${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 2. Khối Voucher (Giữ nguyên) */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          {/* ... (Code voucher giữ nguyên) ... */}
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Mã giảm giá
          </Text>
          <View className="flex-row items-center">
            <TextInput
              value={voucherCode}
              onChangeText={setVoucherCode}
              placeholder="Nhập mã voucher..."
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm"
            />
            <TouchableOpacity
              onPress={handleApplyVoucher}
              disabled={isCheckingVoucher}
              className="bg-green-600 py-3 px-4 rounded-lg ml-2"
            >
              {isCheckingVoucher ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-sm">
                  Áp dụng
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Khối tóm tắt đơn hàng (Giữ nguyên) */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          {/* ... (Code tóm tắt đơn hàng giữ nguyên) ... */}
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Tóm tắt đơn hàng
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Tạm tính</Text>
            <Text className="text-sm font-medium">
              {subtotal.toLocaleString()}đ
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Phí vận chuyển</Text>
            <Text className="text-sm font-medium">
              {shippingFee.toLocaleString()}đ
            </Text>
          </View>
          {discountAmount > 0 && (
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-green-600">Giảm giá (Voucher)</Text>
              <Text className="text-sm font-medium text-green-600">
                -{discountAmount.toLocaleString()}đ
              </Text>
            </View>
          )}
          <View className="h-px bg-gray-200" />
          <View className="flex-row justify-between mt-3">
            <Text className="text-base font-bold text-gray-900">Tổng cộng</Text>
            <Text className="text-base font-bold text-green-600">
              {totalAmount.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* 4. Khối chọn phương thức (Giữ nguyên) */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          {/* ... (Code chọn phương thức giữ nguyên) ... */}
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Phương thức thanh toán
          </Text>
          <PaymentOption
            label="Thanh toán khi nhận hàng (COD)"
            icon="cash-outline"
            value="cod"
            isSelected={selectedMethod === "cod"}
            onSelect={() => setSelectedMethod("cod")}
          />
          <PaymentOption
            label="Ví điện tử MoMo"
            icon="wallet-outline"
            value="momo"
            isSelected={selectedMethod === "momo"}
            onSelect={() => setSelectedMethod("momo")}
          />
          <PaymentOption
            label="Thẻ Tín dụng / Ghi nợ"
            icon="card-outline"
            value="vnpay_card"
            isSelected={selectedMethod === "vnpay_card"}
            onSelect={() => setSelectedMethod("vnpay_card")}
          />
        </View>
      </ScrollView>

      {/* Nút thanh toán (Footer) */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
        style={{
          paddingBottom: bottom || 16,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={handlePayment}
          disabled={isLoading || cart.length === 0}
          className={`py-3.5 rounded-lg flex-row justify-center items-center ${
            isLoading || cart.length === 0 ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Đặt hàng ( {totalAmount.toLocaleString()}đ )
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
