// CartScreen.tsx
import type { CartItem } from "@/context/cart/CartContext";
import { useCart } from "@/context/cart/CartContext";
import { useConfirm } from "@/context/confirm/ConfirmContext";
import { useToast } from "@/context/notifications/ToastContext";
import ConfirmModal from "@components/common/ConfirmModal";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

// ✨ 1. Import các component con
import CartEmptyState from "@/components/screens/cart/CartEmptyState";
import CartFooter from "@/components/screens/cart/CartFooter";
import CartHeader from "@/components/screens/cart/CartHeader";
import CartItemCard from "@/components/screens/cart/CartItem";

const CartScreen: React.FC = () => {
  // --- 2. Toàn bộ state và logic được giữ lại ---
  const router = useRouter();
  const { cart, addToCart, decrementItem, removeFromCart } = useCart();
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.salePrice ?? item.price;
    return sum + unit * item.quantity;
  }, 0);

  // --- 3. Tạo các hàm handler để truyền xuống component con ---

  // Khi bấm nút (+), chỉ cần thêm
  const handleIncrement = (item: CartItem) => {
    addToCart(item, 1);
  };

  // Khi bấm nút (-), kiểm tra số lượng
  const handleDecrementRequest = (item: CartItem) => {
    if (item.quantity > 1) {
      decrementItem(item.product_id);
    } else {
      // Nếu số lượng là 1, yêu cầu xóa
      setItemToRemove(item);
    }
  };

  // Khi bấm nút thùng rác
  const handleRemoveRequest = (item: CartItem) => {
    setItemToRemove(item);
  };

  // Khi xác nhận trong modal
  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.product_id);
      showToast("success", `Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`);
    }
    setItemToRemove(null);
  };

  // Khi bấm thanh toán
  const handleCheckout = () => {
    router.push("../payment/checkout");
  };

  // --- 4. Render giao diện đã được chia nhỏ ---
  return (
    <View className="flex-1 bg-gray-50">
      <CartHeader title="Giỏ hàng" onBack={() => router.back()} />

      {cart.length === 0 ? (
        <CartEmptyState />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item: CartItem) => item.product_id.toString()}
            className="flex-1 px-4"
            contentContainerClassName="pt-3 pb-36"
            renderItem={({ item }: { item: CartItem }) => (
              <CartItemCard
                item={item}
                onIncrement={() => handleIncrement(item)}
                onDecrementRequest={() => handleDecrementRequest(item)}
                onRemoveRequest={() => handleRemoveRequest(item)}
              />
            )}
          />
          <CartFooter totalPrice={totalPrice} onCheckout={handleCheckout} />
        </>
      )}

      {/* Modal xác nhận vẫn nằm ở đây */}
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
