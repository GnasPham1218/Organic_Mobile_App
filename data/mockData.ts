// data/mockData.ts

// Lưu ý: Đường dẫn đến ảnh ('@/assets/...') cần khớp với cấu trúc thư mục của bạn.

export const mockProducts = [
  {
    id: "p1",
    name: "Táo Fuji hữu cơ 1kg",
    image: require("@/assets/products/tao.png"),
    price: 85000,
    salePrice: 69000,
    inStock: true,
  },
  {
    id: "p2",
    name: "Sữa chua Hy Lạp",
    image: require("@/assets/products/yogurt.png"),
    price: 42000,
    inStock: false,
  },
  {
    id: "p3",
    name: "Cà rốt Đà Lạt 500g",
    image: require("@/assets/products/carrot.png"),
    price: 32000,
    discountPercent: 15,
    inStock: true,
  },
  {
    id: "p4", // Sửa ID để không bị trùng
    name: "Cải bó xôi Baby 300g",
    image: require("@/assets/products/spinach.png"), // Giả sử bạn có ảnh này
    price: 28000,
    inStock: true,
  },
  {
    id: "p5", // Sửa ID để không bị trùng
    name: "Nho đen không hạt 500g",
    image: require("@/assets/products/grapes.png"), // Giả sử bạn có ảnh này
    price: 95000,
    salePrice: 79000,
    inStock: true,
  },
  {
    id: "p6", // Sửa ID để không bị trùng
    name: "Thịt ba rọi heo 500g",
    image: require("@/assets/products/pork.png"), // Giả sử bạn có ảnh này
    price: 110000,
    inStock: true,
  },
  // ... bạn có thể thêm các sản phẩm khác nếu muốn
];

export const mockBanners = [
  require("@/assets/banners/b1.jpg"), // Giả sử bạn có các ảnh banner
  require("@/assets/banners/b2.jpg"),
  require("@/assets/banners/b2.jpg"),
];

// Định nghĩa lại kiểu dữ liệu để tương thích với hàm addToCart
// Đây là một cách để đảm bảo code chặt chẽ hơn với TypeScript
type ProductType = (typeof mockProducts)[0];
export type ProductInfo = Omit<ProductType, "quantity">;


// ======================================================
// PHẦN 2: DỮ LIỆU ĐƠN HÀNG (Phần mới cần thêm)
// ======================================================

// Định nghĩa kiểu dữ liệu cho sản phẩm và đơn hàng
type Product = typeof mockProducts[0];
export type Order = {
  id: string;
  status: "processing" | "shipping";
  totalItems: number;
  totalPrice: string;
  items: Product[]; // Mỗi item là một sản phẩm đầy đủ
};

// Hàm tiện ích để định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Tạo dữ liệu đơn hàng mẫu bằng cách lấy sản phẩm từ mockProducts
export const mockOngoingOrders: Order[] = [
  {
    id: "DH789123",
    status: "processing",
    // Các sản phẩm trong đơn hàng này
    items: [mockProducts[0], mockProducts[3], mockProducts[2]],
    // Tự động tính toán
    totalItems: 3,
    totalPrice: formatCurrency(
      (mockProducts[0].salePrice ?? mockProducts[0].price) +
      (mockProducts[3].salePrice ?? mockProducts[3].price) +
      (mockProducts[2].salePrice ?? mockProducts[2].price)
    ), // 69k + 28k + 32k = 129.000đ
  },
  {
    id: "DH564879",
    status: "shipping",
    // Các sản phẩm trong đơn hàng này
    items: [mockProducts[5], mockProducts[4]],
    // Tự động tính toán
    totalItems: 2,
    totalPrice: formatCurrency(
      (mockProducts[5].salePrice ?? mockProducts[5].price) +
      (mockProducts[4].salePrice ?? mockProducts[4].price)
    ), // 110k + 79k = 189.000đ
  },
];