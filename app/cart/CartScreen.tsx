// CartScreen.tsx
import ConfirmModal from "@/components/common/ConfirmModal";
import type { CartItem } from "@/context/cart/CartContext";
import { useCart } from "@/context/cart/CartContext";
import { useConfirm } from "@/context/confirm/ConfirmContext";
import { useToast } from "@/context/notifications/ToastContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, View } from "react-native"; // Thêm ActivityIndicator cho nút

import CartEmptyState from "@/components/screens/cart/CartEmptyState";
import CartFooter from "@/components/screens/cart/CartFooter";
import CartHeader from "@/components/screens/cart/CartHeader";
import CartItemCard from "@/components/screens/cart/CartItem";

const CartScreen: React.FC = () => {
  const router = useRouter();
  // Giờ chỉ cần cart, totalPrice, và các hàm async (bỏ loading)
  const { cart, addToCart, decrementItem, removeFromCart } = useCart();
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  // ✨ STATE MỚI: Chỉ để khóa các nút bấm
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.price;
    return sum + unit * item.quantity;
  }, 0);

  // --- HANDLERS ASYNC ---
  const handleMaxStockAttempt = (item: CartItem) => {
    showToast(
      "warning",
      `Bạn đã đạt số lượng tối đa (${item.maxStock})\n cho "${item.name}".`
    );
  };
  // Khi bấm nút (+), chỉ cần thêm 1
  const handleIncrement = async (item: CartItem) => {
    if (isProcessing) return; // Chặn nếu đang xử lý

    // Bỏ kiểm tra số lượng tối đa ở đây, vì CartItemCard đã vô hiệu hóa nút.

    try {
      setIsProcessing(true);

      // Nếu addToCart trả về false do lỗi 400, thông báo được xử lý bằng Alert trong CartContext.
      await addToCart(item, 1);

      // Nếu thành công thì không cần làm gì thêm
    } finally {
      setIsProcessing(false);
    }
  };

  // Khi bấm nút (-), kiểm tra số lượng
  const handleDecrementRequest = async (item: CartItem) => {
    if (isProcessing) return; // Chặn nếu đang xử lý
    try {
      setIsProcessing(true);
      if (item.quantity > 1) {
        await decrementItem(item.id);
      } else {
        // Nếu số lượng là 1, yêu cầu xóa (dùng modal)
        setItemToRemove(item);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Khi bấm nút thùng rác
  const handleRemoveRequest = (item: CartItem) => {
    if (isProcessing) return;
    setItemToRemove(item);
  };

  // Khi xác nhận trong modal
  const handleConfirmRemove = async () => {
    if (isProcessing || !itemToRemove) return;
    try {
      setIsProcessing(true);
      await removeFromCart(itemToRemove.id);
      showToast("success", `Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`);
    } finally {
      setItemToRemove(null);
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    router.push("../payment/checkout");
  };

  // --- 4. Render giao diện ---
  return (
    <View className="flex-1 bg-gray-50">
      <CartHeader title="Giỏ hàng" onBack={() => router.back()} />

      {/* ⚠️ Bỏ Loading toàn màn hình, chỉ check giỏ hàng rỗng */}
      {cart.length === 0 ? (
        <CartEmptyState />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item: CartItem) => item.id.toString()}
            className="flex-1 px-4"
            contentContainerClassName="pt-3 pb-36"
            renderItem={({ item }: { item: CartItem }) => (
              <CartItemCard
                item={item}
                onMaxStockAttempt={() => handleMaxStockAttempt(item)}
                isProcessing={isProcessing}
                onIncrement={() => handleIncrement(item)}
                onDecrementRequest={() => handleDecrementRequest(item)}
                onRemoveRequest={() => handleRemoveRequest(item)}
              />
            )}
          />
          <CartFooter
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
            // ✨ CHẶN: Khóa nút thanh toán
            isDisabled={isProcessing}
          />
        </>
      )}

      {/* Modal xác nhận */}
      <ConfirmModal
        visible={!!itemToRemove}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${itemToRemove?.name}" khỏi giỏ hàng?`}
        onCancel={() => setItemToRemove(null)}
        onConfirm={handleConfirmRemove}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="destructive"
      />
    </View>
  );
};

export default CartScreen;
