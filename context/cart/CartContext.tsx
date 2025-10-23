import React, { createContext, useContext, useState, ReactNode } from "react";

// ## Cải thiện kiểu dữ liệu để code rõ ràng hơn ##

// ProductInfo: Thông tin gốc của sản phẩm, không có số lượng
export interface ProductInfo {
  product_id: number; // ✨ SỬA 1: Đổi từ 'id: string' thành 'product_id: number'
  name: string;
  price: number;
  salePrice?: number;
  image: any;
}

// CartItem: Sản phẩm khi đã nằm trong giỏ hàng, luôn có số lượng
export interface CartItem extends ProductInfo {
  quantity: number;
}

// ## Định nghĩa Context Type ##
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductInfo, quantity?: number) => void;
  // ✨ SỬA 2: Đổi kiểu tham số thành number
  decrementItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ## Hàm addToCart đã được cập nhật logic ##
  const addToCart = (product: ProductInfo, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      // ✨ SỬA 3: So sánh bằng 'product_id'
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          // ✨ SỬA 4: So sánh bằng 'product_id'
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  // Giảm số lượng đi 1, nếu về 0 thì xóa
  const decrementItem = (productId: number) => { // ✨ SỬA 5: Đổi kiểu tham số
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          // ✨ SỬA 6: So sánh bằng 'product_id'
          item.product_id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Xóa hẳn một sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: number) => { // ✨ SỬA 7: Đổi kiểu tham số
    setCart((prevCart) =>
      // ✨ SỬA 8: So sánh bằng 'product_id'
      prevCart.filter((item) => item.product_id !== productId)
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    decrementItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ## Hook useCart không đổi ##
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};