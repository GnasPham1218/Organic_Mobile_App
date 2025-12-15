import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import OrderDetailView, {
  IResOrderDTO,
} from "@/components/screens/order/OrderDetailView";

// Import API và Component
import ConfirmModal from "@/components/common/ConfirmModal";
import { useToast } from "@/context/notifications/ToastContext";
import { cancelCodOrderAPI, getOrderByIdV2API } from "@/service/api";

// Import Cart Context
import { useCart } from "@/context/cart/CartContext";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const { addToCart, cart } = useCart();

  // --- STATE ---
  const [order, setOrder] = useState<IResOrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal Hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Modal Xác nhận Mua lại (Khi trùng sản phẩm)
  const [isRepurchaseModalVisible, setRepurchaseModalVisible] = useState(false);
  const [pendingRepurchaseOrder, setPendingRepurchaseOrder] =
    useState<IResOrderDTO | null>(null);
  const [duplicateProductsName, setDuplicateProductsName] =
    useState<string>("");

  // [NEW] Modal Kết quả Mua lại (Thay thế Alert)
  const [resultModal, setResultModal] = useState({
    visible: false,
    title: "",
    message: "",
    isSuccess: false, // Dùng để đổi text nút bấm (VD: Thành công -> Xem giỏ hàng)
  });

  // --- 1. Fetch Data ---
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading((prev) => (prev && !order ? true : prev));
      const res = await getOrderByIdV2API(Number(id));
      if (res.data) {
        // @ts-ignore
        setOrder(res.data.data || res.data);
      }
    } catch (error) {
      console.log("Lỗi lấy chi tiết đơn hàng:", error);
      showToast("error", "Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 2. Logic Hủy Đơn Hàng ---
  const handlePressCancelButton = () => {
    if (!order) return;
    if (order.paymentMethod !== "COD") {
      showToast("error", "Chỉ đơn hàng COD mới được hủy trực tiếp.");
      return;
    }
    setShowCancelModal(true);
  };

  const processCancelOrder = async () => {
    setShowCancelModal(false);
    if (!order) return;
    try {
      await cancelCodOrderAPI(order.id);
      showToast("success", "Đã hủy đơn hàng thành công!");
      setLoading(true);
      await fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi hủy đơn hàng";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // [3] LOGIC MUA LẠI (ĐÃ CẬP NHẬT DÙNG CONFIRM MODAL)
  // ============================================================

  const processAddRepurchase = async (orderData: IResOrderDTO) => {
    // Đóng modal xác nhận trùng (nếu có)
    setRepurchaseModalVisible(false);
    setPendingRepurchaseOrder(null);

    let addedCount = 0;
    const failedItems: string[] = [];

    // Toast nhẹ để báo đang xử lý
    showToast("info", "Đang thêm sản phẩm vào giỏ...", 1500);

    for (const item of orderData.orderDetails) {
      const productPayload = {
        id: item.productId,
        name: item.productName,
        price: item.price,
        image: item.productImage,
        quantity: 100,
        slug: "",
      };

      const success = await addToCart(productPayload, item.quantity);

      if (success) {
        addedCount++;
      } else {
        failedItems.push(item.productName);
      }

      // Delay nhỏ để tránh spam API
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // [UPDATE] Thay Alert.alert bằng setResultModal
    if (addedCount === orderData.orderDetails.length) {
      // 1. Thành công 100%
      setResultModal({
        visible: true,
        title: "Thành công",
        message: `Đã thêm toàn bộ ${addedCount} sản phẩm vào giỏ hàng.`,
        isSuccess: true,
      });
    } else if (addedCount > 0) {
      // 2. Thành công một phần
      setResultModal({
        visible: true,
        title: "Hoàn tất một phần",
        message: `Đã thêm ${addedCount} sản phẩm vào giỏ.\n\nCác sản phẩm sau không đủ hàng:\n- ${failedItems.join("\n- ")}`,
        isSuccess: true, // Vẫn tính là có thành công để hiện nút "Xem giỏ hàng"
      });
    } else {
      // 3. Thất bại toàn bộ
      if (failedItems.length > 0) {
        setResultModal({
          visible: true,
          title: "Hết hàng",
          message:
            "Rất tiếc, các sản phẩm trong đơn này hiện không còn đủ hàng để mua lại.",
          isSuccess: false,
        });
      }
    }
  };

  // Sự kiện click nút "Mua lại"
  const handlePressRepurchase = (orderData: IResOrderDTO) => {
    if (!orderData.orderDetails || orderData.orderDetails.length === 0) return;

    // Check trùng
    const duplicates = orderData.orderDetails.filter((item) =>
      cart.some((cartItem) => cartItem.id === item.productId)
    );

    if (duplicates.length > 0) {
      // Có trùng -> Hiện Modal Xác nhận (ConfirmModal 1)
      const names = duplicates.map((d) => d.productName).join(", ");
      setDuplicateProductsName(names);
      setPendingRepurchaseOrder(orderData);
      setRepurchaseModalVisible(true);
    } else {
      // Không trùng -> Xử lý luôn
      processAddRepurchase(orderData);
    }
  };

  // ============================================================

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg text-gray-500">Không tìm thấy đơn hàng!</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <OrderDetailView
        order={order}
        items={order.orderDetails}
        totalAmount={order.totalPrice}
        onBackPress={router.back}
        onCancelOrder={handlePressCancelButton}
        onReportIssue={() => {
          router.push(`/return/${order.id}`);
        }}
        onRepurchase={handlePressRepurchase}
      />

      {/* 1. Modal Hủy đơn */}
      <ConfirmModal
        visible={showCancelModal}
        title="Xác nhận hủy đơn"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        cancelText="Đóng"
        confirmVariant="destructive"
        onConfirm={processCancelOrder}
        onCancel={() => setShowCancelModal(false)}
      />

      {/* 2. Modal Xác nhận Mua lại (Khi trùng sản phẩm) */}
      <ConfirmModal
        visible={isRepurchaseModalVisible}
        title="Sản phẩm đã có trong giỏ"
        message={`Các sản phẩm sau đã có trong giỏ hàng: "${duplicateProductsName}". Bạn có muốn tiếp tục thêm số lượng vào không?`}
        confirmText="Vẫn thêm"
        cancelText="Hủy bỏ"
        confirmVariant="primary"
        onConfirm={() => {
          if (pendingRepurchaseOrder) {
            processAddRepurchase(pendingRepurchaseOrder);
          }
        }}
        onCancel={() => {
          setRepurchaseModalVisible(false);
          setPendingRepurchaseOrder(null);
        }}
      />

      {/* 3. [NEW] Modal Kết quả Mua lại (Thay thế Alert) */}
      <ConfirmModal
        visible={resultModal.visible}
        title={resultModal.title}
        message={resultModal.message}
        // Nếu thành công -> Nút chính là "Xem giỏ hàng", ngược lại là "OK"
        confirmText={resultModal.isSuccess ? "Xem giỏ hàng" : "OK"}
        // Nút phụ luôn là "Đóng"
        cancelText="Đóng"
        confirmVariant="primary"
        onConfirm={() => {
          setResultModal({ ...resultModal, visible: false });
          // Nếu thành công thì chuyển hướng sang trang giỏ hàng (nếu bạn muốn)
          // Giả sử đường dẫn giỏ hàng là "/(tabs)/cart" hoặc "/cart"
          if (resultModal.isSuccess) {
            router.push("/cart/CartScreen");
          }
        }}
        onCancel={() => {
          setResultModal({ ...resultModal, visible: false });
        }}
      />
    </>
  );
};

export default OrderDetailScreen;
