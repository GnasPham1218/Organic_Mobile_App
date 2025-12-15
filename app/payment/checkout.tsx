import CartHeader from "@/components/screens/cart/CartHeader";
import { useAddress } from "@/context/address/AddressContext";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
// 🆕 Import API
import {
  cancelOrderAPI,
  getAccountAPI,
  getVoucherByCodeAPI,
  PaymentAPI,
  placeOrderAPI,
} from "@/service/api";
import { formatCurrency } from "@/utils/formatters";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard"; // 🆕 Dùng expo-clipboard để copy
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking, // 🆕 Dùng để mở link ảnh QR
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- HELPER FUNCTION ---
const formatOrderCode = (id: number): string => {
  return id.toString().padStart(6, "0");
};

// 🆕 Helper lấy tên ngân hàng
const getBankName = (bin: string) => {
  const banks: Record<string, string> = {
    "970422": "MBBank (Quân Đội)",
    "970436": "Vietcombank",
    "970415": "VietinBank",
    "970418": "BIDV",
    "970405": "Agribank",
    "970407": "Techcombank",
    "970423": "TPBank",
    "970432": "VPBank",
  };
  return banks[bin] || "Ngân hàng";
};

// 🆕 Helper format thời gian mm:ss
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
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

  // 🆕 State cho Modal Thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<IPaymentResponse | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // 🆕 State Countdown Timer (10 phút = 600 giây)
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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

  // --- LOGIC POLLING & TIMER ---
  useEffect(() => {
    if (showPaymentModal && paymentInfo) {
      // 1. Reset timer
      setTimeLeft(600);

      // 2. Start Countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Hết giờ
            clearInterval(timerRef.current!);
            clearInterval(pollingRef.current!);
            setShowPaymentModal(false);
            showToast("info", "Hết thời gian thanh toán");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 3. Start Polling Check Status (mỗi 5s)
      pollingRef.current = setInterval(async () => {
        try {
          // Lưu ý: paymentInfo.orderCode chính là ID dùng để check status
          const res = await PaymentAPI.checkStatus(paymentInfo.orderCode);

          // Giả sử response trả về dạng: { data: { status: "PAID" }, ... } hoặc trực tiếp { status: "PAID" }
          // Tùy vào cấu trúc API của bạn. Dựa trên prompt: "status chỉ trả về status thôi"
          const status = res.data?.status || res.data;

          console.log("Checking status...", status);

          if (status === "PAID" || status === "SUCCESS") {
            clearInterval(timerRef.current!);
            clearInterval(pollingRef.current!);
            setShowPaymentModal(false);
            setPaymentInfo(null);

            // 🆕 CẬP NHẬT: Lấy User ID để xóa giỏ hàng (Banking)
            try {
              const jsonUser = await AsyncStorage.getItem("userInfo");
              if (jsonUser) {
                const userObj = JSON.parse(jsonUser);
                // Truyền ID vào hàm clearCart
                await clearCart(userObj.id);
                console.log("Đã xóa giỏ hàng (Banking) cho user:", userObj.id);
              }
            } catch (error) {
              console.log("Lỗi lấy ID user xóa giỏ (Banking):", error);
            }

            showToast("success", "Thanh toán thành công!");
            router.replace({
              pathname: "/payment/order_success",
              params: { orderId: paymentInfo.orderCode.toString() },
            });
          } else if (status === "CANCELED") {
            clearInterval(timerRef.current!);
            clearInterval(pollingRef.current!);
            setShowPaymentModal(false);
            showToast("error", "Giao dịch đã bị hủy");
          }
        } catch (error) {
          console.log("Lỗi check status payment", error);
        }
      }, 5000); // Check mỗi 5 giây
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [showPaymentModal, paymentInfo]);

  // --- TÍNH TOÁN TỔNG TIỀN ---
  const subtotal = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  const taxRate = 0.08;
  const taxAmount = Math.round(subtotal * taxRate);
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const totalAmountRaw = subtotal + taxAmount + shippingFee - discountAmount;
  const totalAmount = totalAmountRaw > 0 ? totalAmountRaw : 0;

  // --- LOGIC VOUCHER ---
  const validateVoucher = (voucher: IResVoucherDTO, orderValue: number) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (!voucher.active) throw new Error("Voucher này hiện đang bị khóa.");
    if (now < startDate) throw new Error("Voucher chưa đến đợt áp dụng.");
    if (now > endDate) throw new Error("Voucher đã hết hạn sử dụng.");
    if (voucher.quantity <= voucher.usedCount)
      throw new Error("Voucher đã hết lượt sử dụng.");
    if (orderValue < voucher.minOrderValue) {
      throw new Error(
        `Đơn hàng phải từ ${formatCurrency(
          voucher.minOrderValue
        )} để áp dụng mã này.`
      );
    }
  };

  const calculateDiscount = (
    voucher: IResVoucherDTO,
    orderSubtotal: number,
    shipFee: number
  ) => {
    let discount = 0;
    if (voucher.typeVoucher === "PERCENT") {
      discount = orderSubtotal * (voucher.value / 100);
      if (discount > voucher.maxDiscountAmount) {
        discount = voucher.maxDiscountAmount;
      }
    } else if (voucher.typeVoucher === "FIXED_AMOUNT") {
      discount = voucher.value;
    } else if (voucher.typeVoucher === "FREESHIP") {
      discount = shipFee;
    }
    return Math.round(discount);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      showToast("error", "Vui lòng nhập mã voucher");
      return;
    }
    setDiscountAmount(0);
    setAppliedVoucher(null);
    setIsCheckingVoucher(true);

    try {
      const res = await getVoucherByCodeAPI(voucherCode.trim());
      if (res.data && res.data.data) {
        const voucher = res.data.data;
        validateVoucher(voucher, subtotal);
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

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCode("");
    showToast("info", "Đã hủy mã giảm giá");
  };

  useEffect(() => {
    if (appliedVoucher) {
      try {
        validateVoucher(appliedVoucher, subtotal);
        const newDiscount = calculateDiscount(
          appliedVoucher,
          subtotal,
          shippingFee
        );
        setDiscountAmount(newDiscount);
      } catch (e) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        showToast(
          "info",
          "Voucher đã bị hủy do đơn hàng thay đổi không đủ điều kiện."
        );
      }
    }
  }, [subtotal, shippingFee]);
  // 🆕 HÀM XỬ LÝ HỦY ĐƠN HÀNG (Dùng cho cả nút Hủy và nút X)
  const handleCancelTransaction = async () => {
    // Kiểm tra state createdOrderId (73) thay vì paymentInfo
    if (!createdOrderId) {
      console.log("❌ Lỗi: Không tìm thấy ID đơn hàng gốc");
      setShowPaymentModal(false);
      return;
    }

    console.log("🚀 Đang gửi yêu cầu hủy đơn ID (Gốc):", createdOrderId);

    try {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);

      // Gọi API với ID đúng (73)
      await cancelOrderAPI(createdOrderId);

      showToast("info", "Đã hủy đơn hàng và giao dịch");
    } catch (error: any) {
      console.log("❌ Lỗi Backend:", error.response?.data);
      const msg = error.response?.data?.message || "Lỗi khi hủy đơn hàng";
      showToast("error", msg);
    } finally {
      setShowPaymentModal(false);
      setPaymentInfo(null);
      setCreatedOrderId(null); // Reset ID
      setTimeLeft(600);
    }
  };

  // --- XỬ LÝ THANH TOÁN ---
  const handlePayment = async () => {
    if (cart.length === 0) return;

    if (!selectedAddress) {
      showToast("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsLoading(true);

    try {
      const fullAddress = `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`;

      const cartItemsRequest: ICartItemRequest[] = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.salePrice ?? item.price,
      }));

      const orderPayload: IReqPlaceOrder = {
        receiverName: selectedAddress.receiverName,
        receiverPhone: selectedAddress.phone,
        shipAddress: fullAddress,
        note: selectedAddress.note,
        paymentMethod: selectedMethod,

        // --- THÊM MỚI ---
        voucherId: appliedVoucher ? appliedVoucher.id : null, // Gửi ID voucher
        subtotal: subtotal, // Gửi tạm tính
        shippingFee: shippingFee, // Gửi phí ship
        taxAmount: taxAmount, // Gửi thuế
        discountAmount: discountAmount, // Gửi số tiền giảm
        totalPrice: totalAmount, // Tổng tiền cuối cùng
        // ----------------

        cartItems: cartItemsRequest,
      };
      console.log("Payload gửi đi:", JSON.stringify(orderPayload, null, 2)); // Log để kiểm tra
      const resOrder = await placeOrderAPI(orderPayload);

      if (resOrder.data && resOrder.data.data) {
        const orderId = resOrder.data.data.id;
        setCreatedOrderId(orderId);

        if (selectedMethod === "COD") {
          setIsLoading(false);

          // 🆕 CẬP NHẬT: Lấy User ID để xóa giỏ hàng
          try {
            const jsonUser = await AsyncStorage.getItem("userInfo");
            if (jsonUser) {
              const userObj = JSON.parse(jsonUser);
              // Truyền ID vào hàm clearCart
              await clearCart(userObj.id);
              console.log("Đã xóa giỏ hàng cho user:", userObj.id);
            }
          } catch (error) {
            console.log("Lỗi lấy ID user để xóa giỏ:", error);
          }

          showToast("success", "Đặt hàng thành công!");
          router.replace({
            pathname: "/payment/order_success",
            params: { orderId: orderId.toString() },
          });
        } else if (selectedMethod === "BANK_TRANSFER") {
          const formattedId = formatOrderCode(orderId);
          const safeDescription = `Thanh toan DH${formattedId}`.substring(
            0,
            25
          );

          const paymentRequest: CreatePaymentRequest = {
            amount: Math.round(totalAmount),
            orderId: orderId,
            description: safeDescription,
            buyerName: selectedAddress.receiverName,
            buyerPhone: selectedAddress.phone,
          };

          const resPayment = await PaymentAPI.createPayment(paymentRequest);
          const paymentData = resPayment.data as unknown as IPaymentResponse;

          if (paymentData) {
            setPaymentInfo(paymentData);
            setShowPaymentModal(true);
            setIsLoading(false);
          } else {
            throw new Error("Không nhận được thông tin thanh toán");
          }
        }
      } else {
        throw new Error("Không tạo được đơn hàng. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("❌ Lỗi thanh toán chi tiết:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xử lý đơn hàng";
      showToast("error", `Lỗi: ${msg}`);
      setIsLoading(false);
    }
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

  // 🆕 Xử lý copy text
  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast("success", "Đã sao chép vào bộ nhớ tạm!");
  };

  // 🆕 Xử lý tải/mở ảnh QR
  const handleDownloadQR = () => {
    if (paymentInfo?.qrCode) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(paymentInfo.qrCode)}`;
      Linking.openURL(qrUrl);
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

          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Tạm tính</Text>
            <Text className="text-sm font-medium">
              {formatCurrency(subtotal)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Thuế VAT (8%)</Text>
            <Text className="text-sm font-medium">
              {formatCurrency(taxAmount)}
            </Text>
          </View>

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

          {subtotal > 0 && subtotal < 500000 && (
            <View className="mb-2 bg-blue-50 p-2 rounded border border-blue-100">
              <Text className="text-xs text-blue-700 text-center">
                Mua thêm {formatCurrency(500000 - subtotal)} để được Miễn phí
                vận chuyển!
              </Text>
            </View>
          )}

          {discountAmount > 0 && (
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-green-600">Giảm giá (Voucher)</Text>
              <Text className="text-sm font-medium text-green-600">
                -{formatCurrency(discountAmount)}
              </Text>
            </View>
          )}

          <View className="h-px bg-gray-200" />

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
            label="Chuyển khoản ngân hàng (BANK_TRANSFER)"
            icon="qr-code-outline"
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
              {selectedMethod === "BANK_TRANSFER"
                ? `Thanh toán (${formatCurrency(totalAmount)})`
                : `Đặt hàng (${formatCurrency(totalAmount)})`}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 🆕 MODAL THANH TOÁN QR */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelTransaction}
      >
        <View className="flex-1 justify-center items-center bg-black/60 p-4">
          <View className="bg-white w-full rounded-2xl p-5 shadow-lg max-h-[90%]">
            {/* Header Modal */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Thanh toán
                </Text>
                <Text className="text-sm text-red-500 font-medium mt-1">
                  Hết hạn trong: {formatTime(timeLeft)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleCancelTransaction}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {paymentInfo && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* QR Code */}
                <View className="items-center mb-6">
                  <View className="p-2 border border-green-500 rounded-xl bg-white shadow-sm relative">
                    {paymentInfo.qrCode ? (
                      <Image
                        source={{
                          uri: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                            paymentInfo.qrCode
                          )}`,
                        }}
                        style={{ width: 220, height: 220 }}
                        className="rounded-lg"
                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={{ width: 220, height: 220 }}
                        className="justify-center items-center bg-gray-100"
                      >
                        <Text className="text-gray-400">Không có mã QR</Text>
                      </View>
                    )}
                  </View>

                  {/* Nút tải ảnh */}
                  <TouchableOpacity
                    onPress={handleDownloadQR}
                    className="flex-row items-center mt-3 bg-gray-100 py-2 px-4 rounded-full"
                  >
                    <Ionicons
                      name="download-outline"
                      size={18}
                      color="#4B5563"
                    />
                    <Text className="ml-2 text-gray-600 font-medium text-xs">
                      Tải ảnh QR
                    </Text>
                  </TouchableOpacity>

                  <Text className="text-center text-sm text-gray-500 mt-3 italic">
                    Tự động kiểm tra trạng thái mỗi 5 giây...
                  </Text>
                </View>

                {/* Thông tin chi tiết */}
                <View className="bg-gray-50 p-4 rounded-xl space-y-4 mb-2">
                  <InfoRow
                    label="Ngân hàng"
                    value={getBankName(paymentInfo.bin)}
                    isCopyable
                    onCopy={() => handleCopy(getBankName(paymentInfo.bin))}
                  />

                  <InfoRow
                    label="Số tài khoản"
                    value={paymentInfo.accountNumber}
                    isCopyable
                    onCopy={() => handleCopy(paymentInfo.accountNumber)}
                  />
                  <InfoRow
                    label="Chủ tài khoản"
                    value={paymentInfo.accountName}
                  />
                  <InfoRow
                    label="Số tiền"
                    value={formatCurrency(paymentInfo.amount)}
                    highlight
                    isCopyable
                    onCopy={() => handleCopy(paymentInfo.amount.toString())}
                  />
                  <InfoRow
                    label="Nội dung"
                    value={paymentInfo.description}
                    isCopyable
                    onCopy={() => handleCopy(paymentInfo.description)}
                  />
                </View>
                {/* --- Nút Hủy Thanh Toán --- */}
                <TouchableOpacity
                  onPress={handleCancelTransaction}
                  className="mt-4 bg-red-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">
                    HỦY THANH TOÁN
                  </Text>
                </TouchableOpacity>
                <View className="items-center py-4">
                  <ActivityIndicator color="#16A34A" />
                  <Text className="text-xs text-gray-400 mt-2">
                    Đang chờ thanh toán...
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper Component
const InfoRow = ({
  label,
  value,
  highlight = false,
  isCopyable = false,
  onCopy,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isCopyable?: boolean;
  onCopy?: () => void;
}) => (
  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-gray-500 text-sm w-1/3">{label}:</Text>
    <View className="flex-1 flex-row justify-end items-center gap-2">
      <Text
        className={`text-right text-sm font-medium ${
          highlight ? "text-red-600 font-bold text-base" : "text-gray-800"
        } flex-1`}
        numberOfLines={2}
      >
        {value}
      </Text>
      {isCopyable && (
        <TouchableOpacity onPress={onCopy} className="p-1 bg-gray-200 rounded">
          <Ionicons name="copy-outline" size={14} color="#374151" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);
