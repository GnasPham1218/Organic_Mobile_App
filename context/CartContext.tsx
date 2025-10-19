// context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Giữ nguyên interface Product của bạn
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // Thêm trường image
  // Thêm các trường khác nếu cần
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Omit<Product, "quantity">) => void;
  decrementItem: (productId: string) => void;    // <--- HÀM MỚI
  removeFromCart: (productId: string) => void; // <--- HÀM MỚI
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Hàm addToCart giữ nguyên, nó sẽ đóng vai trò là nút TĂNG (+)
  const addToCart = (product: Omit<Product, "quantity">) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // HÀM MỚI: Giảm số lượng đi 1
  const decrementItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Lọc bỏ sản phẩm nếu số lượng về 0
    );
  };
  
  // HÀM MỚI: Xóa hẳn sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };


  const value = { cart, addToCart, decrementItem, removeFromCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};