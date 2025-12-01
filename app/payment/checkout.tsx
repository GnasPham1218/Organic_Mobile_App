import CartHeader from "@/components/screens/cart/CartHeader";
import { useAddress } from "@/context/address/AddressContext";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";

import { getAccountAPI, getVoucherByCodeAPI } from "@/service/api";
import { formatCurrency } from "@/utils/formatters";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
// 🆕 Update: Chỉ còn COD và BANK_TRANSFER, bỏ momo, cod viết hoa
type PaymentMethodValue = "COD" | "BANK_TRANSFER";

// --- COMPONENT LỰA CHỌN THANH TOÁN ---
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

  const { selectedAddress, initData, addresses, loading } = useAddress();

  // --- STATE ---
  // 🆕 Update: Default state là "COD" viết hoa
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodValue>("COD");
  const [isLoading, setIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<any>(null);

  // ✨ State cho Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<IResVoucherDTO | null>(
    null
  );

  // --- EFFECT: LẤY THÔNG TIN USER KHI VÀO MÀN HÌNH ---
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;

        const cachedUser = await AsyncStorage.getItem("userInfo");
        if (cachedUser) {
          setUserInfo(JSON.parse(cachedUser));
        }

        const res = await getAccountAPI();
        if (res.data && res.data.data && res.data.data.user) {
          const userFromApi = res.data.data.user;
          setUserInfo(userFromApi);
          await AsyncStorage.setItem("userInfo", JSON.stringify(userFromApi));
        }
      } catch (error) {
        console.log("Lỗi lấy thông tin user tại Checkout:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      if (addresses.length === 0) {
        initData(userInfo.id);
      }
    }
  }, [userInfo, addresses.length, initData]);

  // --- TÍNH TOÁN TỔNG TIỀN ---

  // 1. Tạm tính (Subtotal)
  const subtotal = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  // 2. Thuế VAT (8% trên tạm tính)
  const taxRate = 0.08;
  const taxAmount = Math.round(subtotal * taxRate);

  // 3. Phí vận chuyển
  // Mặc định 25k, nếu đơn > 500k thì miễn phí
  const shippingFee = subtotal > 500000 ? 0 : 25000;

  // --- LOGIC VOUCHER ---

  // Hàm kiểm tra tính hợp lệ của Voucher
  const validateVoucher = (voucher: IResVoucherDTO, orderValue: number) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    // 1. Kiểm tra Active
    if (!voucher.active) {
      throw new Error("Voucher này hiện đang bị khóa.");
    }

    // 2. Kiểm tra thời gian
    if (now < startDate) {
      throw new Error("Voucher chưa đến đợt áp dụng.");
    }
    if (now > endDate) {
      throw new Error("Voucher đã hết hạn sử dụng.");
    }

    // 3. Kiểm tra số lượng
    if (voucher.quantity <= voucher.usedCount) {
      throw new Error("Voucher đã hết lượt sử dụng.");
    }

    // 4. Kiểm tra giá trị đơn hàng tối thiểu
    if (orderValue < voucher.minOrderValue) {
      throw new Error(
        `Đơn hàng phải từ ${formatCurrency(voucher.minOrderValue)} để áp dụng mã này.`
      );
    }
  };

  // Hàm tính toán tiền giảm giá
  const calculateDiscount = (
    voucher: IResVoucherDTO,
    orderSubtotal: number,
    shipFee: number
  ) => {
    let discount = 0;

    if (voucher.typeVoucher === "PERCENT") {
      // Giảm theo phần trăm
      discount = orderSubtotal * (voucher.value / 100);
      // Kiểm tra giảm tối đa
      if (discount > voucher.maxDiscountAmount) {
        discount = voucher.maxDiscountAmount;
      }
    } else if (voucher.typeVoucher === "FIXED_AMOUNT") {
      // Giảm số tiền cố định
      discount = voucher.value;
    } else if (voucher.typeVoucher === "FREESHIP") {
      // Miễn phí vận chuyển (Giảm bằng đúng phí ship hiện tại)
      discount = shipFee;
    }

    return Math.round(discount);
  };

  // 4. Tổng cộng (Tính lại mỗi khi render hoặc dependency thay đổi)
  // Đảm bảo không âm
  const totalAmountRaw = subtotal + taxAmount + shippingFee - discountAmount;
  const totalAmount = totalAmountRaw > 0 ? totalAmountRaw : 0;

  // Xử lý Voucher khi nhấn Áp dụng
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      showToast("error", "Vui lòng nhập mã voucher");
      return;
    }

    // Reset state trước khi check
    setDiscountAmount(0);
    setAppliedVoucher(null);
    setIsCheckingVoucher(true);

    try {
      // Gọi API lấy thông tin voucher
      const res = await getVoucherByCodeAPI(voucherCode.trim());

      if (res.data && res.data.data) {
        const voucher = res.data.data;

        // Validate voucher
        validateVoucher(voucher, subtotal);

        // Tính toán giảm giá
        const discount = calculateDiscount(voucher, subtotal, shippingFee);

        setAppliedVoucher(voucher);
        setDiscountAmount(discount);

        showToast(
          "success",
          `Áp dụng mã thành công! Giảm ${formatCurrency(discount)}`
        );
      } else {
        showToast("error", "Không tìm thấy mã voucher.");
      }
    } catch (error: any) {
      // Xử lý lỗi từ API hoặc lỗi validation ném ra
      const msg =
        error.message ||
        (error.response?.data?.message ??
          "Mã voucher không hợp lệ hoặc lỗi hệ thống");
      showToast("error", msg);
      setDiscountAmount(0);
      setAppliedVoucher(null);
    } finally {
      setIsCheckingVoucher(false);
    }
  };

  // 🆕 Hàm hủy Voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCode(""); // Xóa text trong ô input luôn cho sạch (tùy chọn)
    showToast("info", "Đã hủy mã giảm giá");
  };

  // Effect: Nếu Subtotal thay đổi (VD: user quay lại sửa giỏ hàng), cần check lại voucher đã áp dụng
  useEffect(() => {
    if (appliedVoucher) {
      try {
        validateVoucher(appliedVoucher, subtotal);
        // Nếu vẫn hợp lệ, tính lại giá (vì subtotal đổi thì giảm giá % có thể đổi)
        const newDiscount = calculateDiscount(
          appliedVoucher,
          subtotal,
          shippingFee
        );
        setDiscountAmount(newDiscount);
      } catch (e) {
        // Nếu không còn hợp lệ (VD: tổng tiền giảm xuống dưới mức tối thiểu)
        setAppliedVoucher(null);
        setDiscountAmount(0);
        showToast(
          "info",
          "Voucher đã bị hủy do đơn hàng thay đổi không đủ điều kiện."
        );
      }
    }
  }, [subtotal, shippingFee]); // Chạy lại khi tiền hàng hoặc phí ship thay đổi

  // Xử lý Thanh toán
  const handlePayment = () => {
    if (cart.length === 0) return;

    if (!selectedAddress) {
      showToast("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsLoading(true);

    let paymentData = {
      amount: totalAmount,
      subtotal: subtotal,
      tax: taxAmount,
      shipping_fee: shippingFee,
      discount: discountAmount,
      voucher_code: appliedVoucher ? appliedVoucher.code : null, // Gửi kèm mã voucher nếu có
      voucher_id: appliedVoucher ? appliedVoucher.id : null, // Gửi kèm ID voucher nếu cần
      method: "COD",
      provider: "Giao Hàng Nhanh",
      status: "pending",
      address_id: selectedAddress.id,
      user_id: userInfo?.id,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // 🆕 Update: Logic cho Bank Transfer
    if (selectedMethod === "BANK_TRANSFER") {
      paymentData.method = "BANK_TRANSFER";
      paymentData.provider = "BANK";
    }
    // Không còn case momo nữa

    console.log("Đang gửi lên server:", paymentData);

    setTimeout(() => {
      setIsLoading(false);
      showToast("success", "Đặt hàng thành công!");
      clearCart();
      router.replace("/(tabs)");
    }, 2000);
  };

  const handlePressSelectAddress = () => {
    if (userInfo && userInfo.id) {
      router.push({
        pathname: "/(modals)/select_address",
        params: { userId: userInfo.id },
      });
    } else {
      router.push("/(modals)/select_address");
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <CartHeader title="Thanh toán" onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. KHỐI ĐỊA CHỈ */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Địa chỉ nhận hàng
          </Text>

          <TouchableOpacity
            onPress={handlePressSelectAddress}
            className={`bg-white p-4 rounded-xl border shadow-sm flex-row items-center ${
              !selectedAddress
                ? "border-orange-300 bg-orange-50"
                : "border-gray-100"
            }`}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                !selectedAddress ? "bg-orange-100" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name="location"
                size={20}
                color={!selectedAddress ? "#F97316" : "#374151"}
              />
            </View>

            <View className="flex-1">
              {loading && addresses.length === 0 ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#16A34A" />
                  <Text className="text-gray-500 ml-2">
                    Đang tải địa chỉ...
                  </Text>
                </View>
              ) : selectedAddress ? (
                <>
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-bold text-gray-900 mr-2">
                      {selectedAddress.receiverName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      | {selectedAddress.phone}
                    </Text>
                  </View>
                  <Text
                    className="text-sm text-gray-600 leading-5"
                    numberOfLines={2}
                  >
                    {selectedAddress.street}, {selectedAddress.ward},{" "}
                    {selectedAddress.district}, {selectedAddress.province}
                  </Text>
                </>
              ) : (
                <View>
                  <Text className="text-base font-semibold text-orange-600">
                    Chưa chọn địa chỉ
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {userInfo
                      ? "Chọn địa chỉ từ sổ địa chỉ của bạn"
                      : "Vui lòng chọn địa chỉ giao hàng"}
                  </Text>
                </View>
              )}
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 2. Khối Voucher */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Mã giảm giá
          </Text>
          <View className="flex-row items-center">
            {/* 🆕 Update: Input sẽ bị disable khi đã áp dụng voucher */}
            <TextInput
              value={voucherCode}
              onChangeText={setVoucherCode}
              placeholder="Nhập mã voucher..."
              editable={!appliedVoucher}
              className={`flex-1 border rounded-lg p-3 text-sm ${
                appliedVoucher
                  ? "bg-gray-100 text-gray-500 border-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              autoCapitalize="characters"
            />

            {/* 🆕 Update: Logic hiển thị nút bấm */}
            <TouchableOpacity
              onPress={
                appliedVoucher ? handleRemoveVoucher : handleApplyVoucher
              }
              disabled={isCheckingVoucher}
              className={`py-3 px-4 rounded-lg ml-2 ${
                appliedVoucher ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {isCheckingVoucher ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-sm">
                  {appliedVoucher ? "Hủy" : "Áp dụng"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {appliedVoucher && (
            <Text className="text-xs text-green-600 mt-2 ml-1">
              Đã áp dụng: {appliedVoucher.code} - {appliedVoucher.description}
            </Text>
          )}
        </View>

        {/* 3. Khối tóm tắt đơn hàng */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Tóm tắt đơn hàng
          </Text>

          {/* Tạm tính */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Tạm tính</Text>
            <Text className="text-sm font-medium">
              {formatCurrency(subtotal)}
            </Text>
          </View>

          {/* Thuế VAT */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Thuế VAT (8%)</Text>
            <Text className="text-sm font-medium">
              {formatCurrency(taxAmount)}
            </Text>
          </View>

          {/* Phí vận chuyển */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Phí vận chuyển</Text>
            {shippingFee === 0 ? (
              <Text className="text-sm font-medium text-green-600">
                Miễn phí
              </Text>
            ) : (
              <Text className="text-sm font-medium">
                {formatCurrency(shippingFee)}
              </Text>
            )}
          </View>

          {/* Logic hiển thị freeship suggestion nếu chưa đủ điều kiện */}
          {subtotal > 0 && subtotal < 500000 && (
            <View className="mb-2 bg-blue-50 p-2 rounded border border-blue-100">
              <Text className="text-xs text-blue-700 text-center">
                Mua thêm {formatCurrency(500000 - subtotal)} để được Miễn phí
                vận chuyển!
              </Text>
            </View>
          )}

          {/* Giảm giá */}
          {discountAmount > 0 && (
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-green-600">Giảm giá (Voucher)</Text>
              <Text className="text-sm font-medium text-green-600">
                -{formatCurrency(discountAmount)}
              </Text>
            </View>
          )}

          <View className="h-px bg-gray-200" />

          {/* Tổng cộng */}
          <View className="flex-row justify-between mt-3">
            <Text className="text-base font-bold text-gray-900">Tổng cộng</Text>
            <Text className="text-base font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>

        {/* 4. Khối chọn phương thức */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Phương thức thanh toán
          </Text>
          <PaymentOption
            label="Thanh toán khi nhận hàng (COD)"
            icon="cash-outline"
            value="COD"
            isSelected={selectedMethod === "COD"}
            onSelect={() => setSelectedMethod("COD")}
          />

          <PaymentOption
            label="Chuyển khoản ngân hàng"
            icon="card-outline"
            value="BANK_TRANSFER"
            isSelected={selectedMethod === "BANK_TRANSFER"}
            onSelect={() => setSelectedMethod("BANK_TRANSFER")}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
        style={{
          paddingBottom: bottom > 0 ? bottom : 16,
          paddingTop: 12,
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
              Đặt hàng ( {formatCurrency(totalAmount)} ){" "}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
