import { AppConfig } from "@/constants/AppConfig";
import { useToast } from "@/context/notifications/ToastContext";
// ✅ UPDATE 1: Import clearCartAPI
import {
  addToCartAPI,
  clearCartAPI,
  getMyCartAPI,
  updateCartAPI,
} from "@/service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";

// --- INTERFACES ---
export interface CartItem {
  id: number;
  name: string;
  image: any;
  price: number;
  originalPrice: number;
  quantity: number;
  maxStock: number;
  promotionType?: "PERCENT" | "FIXED_AMOUNT" | null;
  promotionValue?: number | null;
}

interface CartContextType {
  cart: CartItem[];
  totalPrice: number;
  loading: boolean;
  addToCart: (product: any, quantity?: number) => Promise<boolean>;
  decrementItem: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  // ✅ UPDATE 2: Cập nhật type cho clearCart (nhận userId và trả về Promise)
  clearCart: (userId: number) => Promise<void>;
  refreshCart: (showLoading?: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // --- 1. Lấy Giỏ Hàng Từ Server ---
  const refreshCart = async (showLoading = true) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setCart([]);
        return;
      }

      if (showLoading) setLoading(true);

      const res = await getMyCartAPI();

      if (res.data) {
        const rawData: any[] = Array.isArray(res.data)
          ? res.data
          : (res.data as any).data || [];

        const mappedCart: CartItem[] = rawData.map((item) => ({
          id: item.id,
          name: item.productName,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          maxStock: item.stock,
          promotionType: item.promotionType,
          promotionValue: item.value,
          image: item.image
            ? { uri: `${AppConfig.PRODUCTS_URL}${item.image}` }
            : require("@/assets/logo_organic.png"),
        }));
        setCart(mappedCart);
      }
    } catch (error) {
      console.log("Lỗi tải giỏ hàng:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // --- 2. Thêm vào giỏ hàng (POST) ---
  const addToCart = async (
    product: any,
    quantity: number = 1
  ): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        showToast("warning", "Vui lòng đăng nhập để mua hàng");
        setTimeout(() => {
          router.push("/(auth)/sign-in");
        }, 1000);
        return false;
      }

      const pid = product.id || product.product_id;

      await addToCartAPI(pid, quantity);
      await refreshCart(false);

      showToast("success", "Đã cập nhật giỏ hàng");
      return true;
    } catch (error: any) {
      console.log(
        "Add Cart Error:",
        error.response?.data?.error || error.message
      );

      if (error.response?.status === 400 && error.response?.data?.error) {
        showToast("error", error.response.data.error);
        return false;
      }

      showToast("error", "Không thể thêm sản phẩm");
      return false;
    }
  };

  // --- 3. Giảm số lượng (PUT) ---
  const decrementItem = async (productId: number) => {
    const currentItem = cart.find((item) => item.id === productId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity - 1;

    try {
      if (newQuantity > 0) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        await updateCartAPI(productId, newQuantity);
      } else {
        await removeFromCart(productId);
      }
    } catch (error: any) {
      showToast("error", "Lỗi cập nhật giỏ hàng");
      refreshCart(false);
    }
  };

  // --- 4. Xóa từng sản phẩm ---
  const removeFromCart = async (productId: number) => {
    try {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      await updateCartAPI(productId, 0);
      showToast("success", "Đã xóa sản phẩm");
    } catch (error) {
      showToast("error", "Lỗi khi xóa sản phẩm");
      refreshCart(false);
    }
  };

  // --- 5. Xóa toàn bộ giỏ hàng (API) ---
  // ✅ UPDATE 3: Implement hàm clearCart gọi API
  const clearCart = async (userId: number) => {
    try {
      // Gọi API xóa trên server
      await clearCartAPI(userId);

      // Xóa state client
      setCart([]);

      // (Optional) Có thể show toast hoặc không tùy UX
      // showToast("success", "Giỏ hàng đã được làm trống");
    } catch (error: any) {
      console.log("Clear Cart Error:", error);
      showToast("error", "Lỗi khi làm trống giỏ hàng");

      // Nếu lỗi, sync lại dữ liệu để đảm bảo tính đúng đắn
      await refreshCart(false);
    }
  };

  // --- 6. Tính tổng tiền ---
  const totalPrice = cart.reduce((sum: number, item: CartItem) => {
    return sum + item.price * item.quantity;
  }, 0);

  const value = {
    cart,
    totalPrice,
    loading,
    addToCart,
    decrementItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
