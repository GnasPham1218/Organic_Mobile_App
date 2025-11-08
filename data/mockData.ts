// data/mockData.ts
import type { ImageSourcePropType } from "react-native";

// Lưu ý: Đường dẫn đến ảnh ('@/assets/...') cần khớp với cấu trúc thư mục của bạn.

// Giả định bạn có các Category với ID:
// 1: Trái cây
// 2: Rau củ
// 3: Thịt, cá, trứng
// 4: Sữa & Sản phẩm từ sữa
// 5: Bánh & Ngũ cốc

// ## BƯỚC 1: Hợp nhất thành một nguồn dữ liệu sản phẩm duy nhất ##
// Đổi tên "mockProductsFull" thành "mockProducts" và thêm salePrice để logic tính toán hoạt động
export const mockProducts = [
  {
    product_id: 1,
    category_id: 1, // Trái cây
    name: "Táo Fuji hữu cơ 1kg",
    price: 85000.0,
    salePrice: 69000.0, // Thêm salePrice
    rating_avg: 4.85,
    image: require("@/assets/products/tao.png"),
    images: [
      { image_id: 101, image_url: require("@/assets/products/tao.png") },
      { image_id: 102, image_url: require("@/assets/products/tao.png") },
    ],
    description:
      "Táo Fuji hữu cơ được trồng theo tiêu chuẩn nghiêm ngặt, giữ trọn vị ngọt, giòn tan và hương thơm tự nhiên. Sản phẩm không chứa thuốc trừ sâu, an toàn cho cả gia đình.",
    unit: "kg",
    origin_address: "Nông trại hữu cơ GreenFarm, Đà Lạt, Lâm Đồng",
    quantity: 150,
    mfg_date: "2025-10-20",
    exp_date: "2025-11-20",
    certificates: [
      {
        certificate_id: 1,
        name: "VietGAP",
        image_url: require("@/assets/certs/vietgap.png"),
      },
      {
        certificate_id: 2,
        name: "USDA Organic",
        image_url: require("@/assets/certs/usda_organic.png"),
      },
    ],
  },
  {
    product_id: 2,
    category_id: 4, // Sữa & Sản phẩm từ sữa
    name: "Sữa chua Hy Lạp nguyên chất 180g",
    price: 42000.0,
    rating_avg: 4.9,
    image: require("@/assets/products/yogurt.png"),
    images: [
      { image_id: 103, image_url: require("@/assets/products/yogurt.png") },
    ],
    description:
      "Sữa chua Hy Lạp sánh mịn, giàu protein và ít đường. Sản phẩm được lên men tự nhiên từ sữa tươi nguyên chất từ bò ăn cỏ, tốt cho hệ tiêu hóa và hỗ trợ duy trì vóc dáng.",
    unit: "hộp",
    origin_address: "Công ty sữa DalatMilk, Lâm Đồng",
    quantity: 85,
    mfg_date: "2025-10-18",
    exp_date: "2025-11-05",
    certificates: [
      {
        certificate_id: 3,
        name: "ISO 22000",
        image_url: require("@/assets/certs/iso22000.png"),
      },
    ],
  },
  {
    product_id: 3,
    category_id: 2, // Rau củ
    name: "Cà rốt Đà Lạt baby 500g",
    price: 32000.0,
    rating_avg: 4.7,
    image: require("@/assets/products/carrot.png"),
    images: [
      { image_id: 104, image_url: require("@/assets/products/carrot.png") },
    ],
    description:
      "Cà rốt baby tươi ngon từ vùng đất Đà Lạt, có màu cam đậm, vị ngọt tự nhiên và giàu Vitamin A. Thích hợp để ăn sống, chế biến các món xào, hoặc luộc.",
    unit: "túi 500g",
    origin_address: "Hợp tác xã rau sạch Xuân Hương, Đà Lạt, Lâm Đồng",
    quantity: 200,
    mfg_date: "2025-10-21",
    exp_date: "2025-10-28",
    certificates: [
      {
        certificate_id: 1,
        name: "VietGAP",
        image_url: require("@/assets/certs/vietgap.png"),
      },
    ],
  },
  {
    product_id: 4,
    category_id: 3, // Thịt, cá
    name: "Thịt ba rọi heo thảo mộc 500g",
    price: 115000.0,
    rating_avg: 4.95,
    image: require("@/assets/products/pork.png"),
    images: [
      { image_id: 105, image_url: require("@/assets/products/pork.png") },
    ],
    description:
      "Thịt ba rọi từ heo được nuôi bằng thức ăn thảo mộc, đảm bảo thịt thơm ngon, săn chắc và an toàn. Tỷ lệ nạc mỡ cân bằng, phù hợp cho các món kho, luộc, hoặc nướng.",
    unit: "khay 500g",
    origin_address: "Trang trại MeatDeli, Hà Nam",
    quantity: 60,
    mfg_date: "2025-10-22",
    exp_date: "2025-10-25",
    certificates: [
      {
        certificate_id: 4,
        name: "GlobalG.A.P.",
        image_url: require("@/assets/certs/globalgap.png"),
      },
      {
        certificate_id: 3,
        name: "ISO 22000",
        image_url: require("@/assets/certs/iso22000.png"),
      },
    ],
  },
  {
    product_id: 5,
    category_id: 2, // Rau củ
    name: "Cải bó xôi Baby 300g",
    price: 28000.0,
    rating_avg: 4.75,
    image: require("@/assets/products/spinach.png"),
    images: [
      { image_id: 106, image_url: require("@/assets/products/spinach.png") },
    ],
    description:
      "Cải bó xôi (rau chân vịt) non, lá mềm và vị ngọt thanh. Đây là loại rau giàu sắt và vitamin, lý tưởng để nấu canh, xào tỏi hoặc làm sinh tố xanh.",
    unit: "bó 300g",
    origin_address: "Trang trại rau sạch VinEco, Tam Đảo, Vĩnh Phúc",
    quantity: 180,
    mfg_date: "2025-10-22",
    exp_date: "2025-10-26",
    certificates: [
      {
        certificate_id: 1,
        name: "VietGAP",
        image_url: require("@/assets/certs/vietgap.png"),
      },
    ],
  },
  {
    product_id: 6,
    category_id: 1, // Trái cây
    name: "Nho đen không hạt Mỹ 500g",
    price: 95000.0,
    salePrice: 79000.0, // Thêm salePrice
    rating_avg: 4.8,
    image: require("@/assets/products/grapes.png"),
    images: [
      { image_id: 107, image_url: require("@/assets/products/grapes.png") },
    ],
    description:
      "Nho đen không hạt nhập khẩu có vị ngọt đậm đà, vỏ mỏng và mọng nước. Sản phẩm là món tráng miệng tuyệt vời và cung cấp nhiều chất chống oxy hóa.",
    unit: "hộp 500g",
    origin_address: "Sunview Vineyards, California, USA",
    quantity: 95,
    mfg_date: "2025-10-15",
    exp_date: "2025-11-10",
    certificates: [
      {
        certificate_id: 4,
        name: "GlobalG.A.P.",
        image_url: require("@/assets/certs/globalgap.png"),
      },
    ],
  },
  {
    product_id: 7,
    category_id: 1, // Trái cây
    name: "Nho đen không hạt Mỹ 500g",
    price: 95000.0,
    salePrice: 79000.0, // Thêm salePrice
    rating_avg: 4.8,
    image: require("@/assets/products/grapes.png"),
    images: [
      { image_id: 107, image_url: require("@/assets/products/grapes.png") },
    ],
    description:
      "Nho đen không hạt nhập khẩu có vị ngọt đậm đà, vỏ mỏng và mọng nước. Sản phẩm là món tráng miệng tuyệt vời và cung cấp nhiều chất chống oxy hóa.",
    unit: "hộp 500g",
    origin_address: "Sunview Vineyards, California, USA",
    quantity: 95,
    mfg_date: "2025-10-15",
    exp_date: "2025-11-10",
    certificates: [
      {
        certificate_id: 4,
        name: "GlobalG.A.P.",
        image_url: require("@/assets/certs/globalgap.png"),
      },
    ],
  },
  {
    product_id: 8,
    category_id: 1, // Trái cây
    name: "Nho đen không hạt Mỹ 500g",
    price: 95000.0,
    salePrice: 79000.0, // Thêm salePrice
    rating_avg: 4.8,
    image: require("@/assets/products/grapes.png"),
    images: [
      { image_id: 107, image_url: require("@/assets/products/grapes.png") },
    ],
    description:
      "Nho đen không hạt nhập khẩu có vị ngọt đậm đà, vỏ mỏng và mọng nước. Sản phẩm là món tráng miệng tuyệt vời và cung cấp nhiều chất chống oxy hóa.",
    unit: "hộp 500g",
    origin_address: "Sunview Vineyards, California, USA",
    quantity: 95,
    mfg_date: "2025-10-15",
    exp_date: "2025-11-10",
    certificates: [
      {
        certificate_id: 4,
        name: "GlobalG.A.P.",
        image_url: require("@/assets/certs/globalgap.png"),
      },
    ],
  },
  {
    product_id: 9,
    category_id: 1, // Trái cây
    name: "Nho đen không hạt Mỹ 500g",
    price: 95000.0,
    salePrice: 79000.0, // Thêm salePrice
    rating_avg: 4.8,
    image: require("@/assets/products/grapes.png"),
    images: [
      { image_id: 107, image_url: require("@/assets/products/grapes.png") },
    ],
    description:
      "Nho đen không hạt nhập khẩu có vị ngọt đậm đà, vỏ mỏng và mọng nước. Sản phẩm là món tráng miệng tuyệt vời và cung cấp nhiều chất chống oxy hóa.",
    unit: "hộp 500g",
    origin_address: "Sunview Vineyards, California, USA",
    quantity: 95,
    mfg_date: "2025-10-15",
    exp_date: "2025-11-10",
    certificates: [
      {
        certificate_id: 4,
        name: "GlobalG.A.P.",
        image_url: require("@/assets/certs/globalgap.png"),
      },
    ],
  },
];

export const mockBanners = [
  require("@/assets/banners/b1.jpg"),
  require("@/assets/banners/b2.jpg"), // Sửa lại để không bị trùng
  require("@/assets/banners/b2.jpg"), // Sửa lại để không bị trùng
];

// ## BƯỚC 2: Sửa lại các định nghĩa Type cho nhất quán ##

// Lấy kiểu dữ liệu trực tiếp từ mảng mockProducts đã được hợp nhất
export type ProductType = (typeof mockProducts)[0];

// Dùng ProductType để định nghĩa ProductInfo, loại bỏ trường quantity không cần thiết
export type ProductInfo = Omit<ProductType, "quantity">;

// ======================================================
// PHẦN 2: DỮ LIỆU ĐƠN HÀNG (ĐÃ SỬA LẠI)
// ======================================================
export type OrderStatus = "processing" | "shipping" | "completed" | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus; // <-- Dùng type mới
  totalItems: number;
  items: ProductType[];
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  voucher_code?: string;
  final_total: number;
  ship_address: string;
  order_at: string; // <-- THÊM MỚI: Ngày tạo đơn (dạng ISO String)
};

export const mockHistoryOrders: Order[] = [
  // --- Đơn hàng lịch sử (mới) ---
  {
    id: "DH112233",
    status: "completed",
    items: [mockProducts[1]],
    totalItems: 1,
    subtotal: 35000,
    delivery_fee: 15000,
    tax_amount: 0,
    discount_amount: 0,
    final_total: 50000,
    ship_address: "789 Đường G, Quận 5, TP. Hồ Chí Minh",
    order_at: "2025-11-01T08:00:00.000Z", // <-- Tuần trước
  },
  {
    id: "DH445566",
    status: "cancelled",
    items: [mockProducts[2], mockProducts[0]],
    totalItems: 2,
    subtotal: 101000, // 32k + 69k
    delivery_fee: 15000,
    tax_amount: 0,
    discount_amount: 0,
    final_total: 116000,
    ship_address: "101 Đường H, Quận 7, TP. Hồ Chí Minh",
    order_at: "2025-11-04T11:20:00.000Z", // <-- Ngày hôm qua
  },
];
// ▼▼▼ BƯỚC 2: SỬA LẠI DATA MẪU ▼▼▼
export const mockOngoingOrders: Order[] = [
  // --- Đơn hàng đang giao (từ data cũ) ---
  {
    id: "DH789123",
    status: "processing",
    items: [mockProducts[0], mockProducts[4], mockProducts[2]],
    totalItems: 3,
    subtotal: 129000,
    delivery_fee: 15000,
    tax_amount: 0,
    discount_amount: 20000,
    voucher_code: "GIAM20K",
    final_total: 124000,
    ship_address: "123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh",
    order_at: "2025-11-05T10:30:00.000Z", // <-- Ngày hôm nay
  },
  {
    id: "DH564879",
    status: "shipping",
    items: [mockProducts[3], mockProducts[5]],
    totalItems: 2,
    subtotal: 194000,
    delivery_fee: 15000,
    tax_amount: 10450,
    discount_amount: 0,
    final_total: 219450,
    ship_address: "456 Đường XYZ, Phường 2, Quận 3, TP. Hồ Chí Minh",
    order_at: "2025-11-04T15:00:00.000Z", // <-- Ngày hôm qua
  },
];
export const mockAllOrders: Order[] = [
  ...mockOngoingOrders,
  ...mockHistoryOrders,
];
// ▼▼▼ THÊM MỚI: Định nghĩa cho Khiếu nại ▼▼▼
export type ReturnStatus = "pending" | "approved" | "rejected" | "canceled";
export type ReturnMethod = "refund" | "exchange";

export type ReturnRequest = {
  return_id: string; // Mã khiếu nại (ví dụ: KN12345)
  order_id: string; // Mã đơn hàng gốc
  status: ReturnStatus;
  items: ProductType[]; // Các sản phẩm trong đơn
  totalItems: number;
  reason: string;
  method: ReturnMethod;
  images: ImageSourcePropType[];
  created_at: string; // Ngày tạo khiếu nại
  resolved_at?: string; // Ngày duyệt (quan trọng để lọc)
};

// ▼▼▼ THÊM MỚI: Data mẫu cho Khiếu nại ▼▼▼
// (Chúng ta sẽ dùng lại 'items' từ các đơn hàng đã hoàn thành)
export const mockReturnRequests: ReturnRequest[] = [
  {
    return_id: "KN11223",
    order_id: "DH112233", // Đơn hàng đã hoàn thành
    status: "approved",
    items: mockAllOrders.find((o) => o.id === "DH112233")?.items || [],
    totalItems: 1,
    reason: "Sản phẩm bị hỏng.",
    method: "refund",
    images: [],
    created_at: "2025-11-02T10:00:00.000Z",
    resolved_at: "2025-11-03T09:00:00.000Z", // Đã duyệt
  },
  {
    return_id: "KN44556",
    order_id: "DH445566", // Đơn hàng đã hủy (ví dụ)
    status: "pending",
    items: mockAllOrders.find((o) => o.id === "DH445566")?.items || [],
    totalItems: 2,
    reason: "Giao nhầm sản phẩm.",
    method: "exchange",
    images: [
      require("@/assets/products/pork.png"),
      require("@/assets/products/pork.png"),
    ],
    created_at: "2025-11-05T08:00:00.000Z",
    // resolved_at: undefined (vì đang 'pending')
  },
];
export type VoucherType = "percent" | "fixed_amount" | "freeship";

export type Voucher = {
  voucher_id: string;
  code: string;
  description: string;
  type: VoucherType;
  value: number;
  max_discount_amount?: number;
  min_order_value: number;
  end_date: string;
  quantity: number; // <-- THÊM MỚI
  used_count: number; // <-- THÊM MỚI
};

// ▼▼▼ SỬA 2: Thêm data cho 'quantity' và 'used_count' ▼▼▼
export const mockVouchers: Voucher[] = [
  {
    voucher_id: "v1",
    code: "FREESHIP20K",
    description: "Miễn phí vận chuyển tối đa 20.000 VNĐ",
    type: "freeship",
    value: 20000,
    max_discount_amount: 20000,
    min_order_value: 50000,
    end_date: "2025-12-31T23:59:00.000Z",
    quantity: 100,
    used_count: 50, // (Còn)
  },
  {
    voucher_id: "v2",
    code: "GIAM10PT",
    description: "Giảm 10% cho đơn hàng rau củ",
    type: "percent",
    value: 10,
    max_discount_amount: 30000,
    min_order_value: 100000,
    end_date: "2025-11-30T23:59:00.000Z",
    quantity: 200,
    used_count: 150, // (Còn)
  },
  {
    voucher_id: "v3",
    code: "GIAM50K",
    description: "Giảm 50.000 VNĐ cho đơn từ 250.000 VNĐ",
    type: "fixed_amount",
    value: 50000,
    min_order_value: 250000,
    end_date: "2025-12-15T23:59:00.000Z",
    quantity: 100,
    used_count: 100, // (Hết mã)
  },
  {
    voucher_id: "v4",
    code: "FREESHIPMAX",
    description: "Miễn phí vận chuyển",
    type: "freeship",
    value: 15000,
    max_discount_amount: 15000,
    min_order_value: 0,
    end_date: "2025-12-01T23:59:00.000Z",
    quantity: 50,
    used_count: 50, // (Hết mã)
  },
  {
    voucher_id: "v5",
    code: "HETHAN",
    description: "Giảm 100.000 VNĐ (Đã hết hạn)",
    type: "fixed_amount",
    value: 100000,
    min_order_value: 500000,
    end_date: "2025-11-01T23:59:00.000Z", // (Hết hạn)
    quantity: 100,
    used_count: 10,
  },
];
// ======================================================
// PHẦN 3: DỮ LIỆU CHAT (Giữ nguyên)
// ======================================================
export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
};

export const mockChatHistory: ChatMessage[] = [
  {
    id: "msg1",
    text: "Xin chào! Tôi có thể giúp gì cho bạn?",
    sender: "support",
    timestamp: "10:30 AM",
  },
  {
    id: "msg2",
    text: "Chào bạn, tôi muốn hỏi về tình trạng đơn hàng DH789123.",
    sender: "user",
    timestamp: "10:31 AM",
  },
  {
    id: "msg3",
    text: "Dạ, để tôi kiểm tra. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đi ạ.",
    sender: "support",
    timestamp: "10:32 AM",
  },
];

export interface Review {
  review_id: number;
  product_id: number;
  customer_user_id: number;
  comment: string;
  rating: number;
  create_at: string; // YYYY-MM-DD
}

export const mockReviews: Review[] = [
  // Táo Fuji (product_id: 1)
  {
    review_id: 1,
    product_id: 1,
    customer_user_id: 1,
    rating: 5,
    comment:
      "Táo rất giòn và ngọt, đúng chuẩn hữu cơ. Mua về cả nhà ai cũng khen. Sẽ mua lại lần sau!",
    create_at: "2025-10-22",
  },
  {
    review_id: 2,
    product_id: 1,
    customer_user_id: 2,
    rating: 4,
    comment:
      "Táo tươi, mọng nước nhưng có một vài quả hơi nhỏ. Về tổng thể thì chất lượng vẫn rất tốt.",
    create_at: "2025-10-21",
  },

  // Sữa chua Hy Lạp (product_id: 2)
  {
    review_id: 3,
    product_id: 2,
    customer_user_id: 3,
    rating: 5,
    comment:
      "Sữa chua đặc, sánh mịn và không bị ngọt gắt. Mình hay ăn kèm với hoa quả và granola, rất ngon và bổ dưỡng.",
    create_at: "2025-10-20",
  },

  // Cà rốt baby (product_id: 3)
  {
    review_id: 4,
    product_id: 3,
    customer_user_id: 4,
    rating: 5,
    comment:
      "Cà rốt non nên rất ngọt, bé nhà mình rất thích ăn. Kích thước nhỏ xinh, tiện để chế biến đồ ăn dặm.",
    create_at: "2025-10-22",
  },

  // Thịt ba rọi heo (product_id: 4)
  {
    review_id: 5,
    product_id: 4,
    customer_user_id: 5,
    rating: 5,
    comment:
      "Thịt rất tươi và thơm, không có mùi hôi. Mình dùng để nướng và kho tàu đều ngon tuyệt. Tỷ lệ nạc mỡ hoàn hảo.",
    create_at: "2025-10-23",
  },
  {
    review_id: 6,
    product_id: 4,
    customer_user_id: 6,
    rating: 4,
    comment:
      "Giao hàng nhanh, thịt được đóng gói cẩn thận. Chỉ là giá hơi cao một chút so với thị trường nhưng chất lượng thì không chê được.",
    create_at: "2025-10-22",
  },

  // Cải bó xôi (product_id: 5)
  {
    review_id: 7,
    product_id: 5,
    customer_user_id: 7,
    rating: 5,
    comment:
      "Rau tươi xanh, non mơn mởn. Nấu canh hay xào tỏi đều giữ được độ ngọt. Rất hài lòng.",
    create_at: "2025-10-23",
  },

  // Nho đen Mỹ (product_id: 6, 7)
  {
    review_id: 8,
    product_id: 6,
    customer_user_id: 8,
    rating: 5,
    comment:
      "Nho ngọt lịm, không hạt, vỏ mỏng. Đợt này mua được giá sale nên càng thích. Sẽ ủng hộ shop dài dài.",
    create_at: "2025-10-18",
  },
  {
    review_id: 9,
    product_id: 6,
    customer_user_id: 9,
    rating: 5,
    comment:
      "Trái nho to đều, không bị dập nát. Rửa sạch để tủ lạnh ăn rất đã. Món ăn vặt yêu thích của mình.",
    create_at: "2025-10-19",
  },
  {
    review_id: 10,
    product_id: 7,
    customer_user_id: 10,
    rating: 4,
    comment:
      "Nho ngon, chất lượng ổn. Hộp 500g hơi ít so với gia đình mình, lần sau sẽ mua nhiều hơn.",
    create_at: "2025-10-20",
  },
];
export const mockUsers = [
  {
    user_id: 1,
    name: "Minh Anh",
    avatar_url: "https://i.pravatar.cc/150?u=minhanh",
  },
  {
    user_id: 2,
    name: "Hoàng Long",
    avatar_url: "https://i.pravatar.cc/150?u=hoanglong",
  },
  {
    user_id: 3,
    name: "Thanh Hằng",
    avatar_url: "https://i.pravatar.cc/150?u=thanhhang",
  },
  {
    user_id: 4,
    name: "Gia đình bé Bông",
    avatar_url: "https://i.pravatar.cc/150?u=giadinhbebong",
  },
  {
    user_id: 5,
    name: "Đức Thịnh",
    avatar_url: "https://i.pravatar.cc/150?u=ducthinh",
  },
  {
    user_id: 6,
    name: "Phương Thảo",
    avatar_url: "https://i.pravatar.cc/150?u=phuongthao",
  },
  {
    user_id: 7,
    name: "Anh Khoa",
    avatar_url: "https://i.pravatar.cc/150?u=anhkhoa",
  },
  {
    user_id: 8,
    name: "Ngọc Lan",
    avatar_url: "https://i.pravatar.cc/150?u=ngoclan",
  },
  {
    user_id: 9,
    name: "Bảo Châu",
    avatar_url: "https://i.pravatar.cc/150?u=baochau",
  },
  {
    user_id: 10,
    name: "Tiến Dũng",
    avatar_url: "https://i.pravatar.cc/150?u=tiendung",
  },
];
export type Promotion = {
  promotion_id: number;
  name: string;
  type: "percent" | "fixed_amount";
  value: number;
  is_active: boolean;
};

export type PromotionDetail = {
  promotion_id: number;
  product_id: number; // Sẽ khớp với product_id trong mockProducts
  start_date: string; // Dùng string ISO cho đơn giản
  end_date: string;   // Dùng string ISO
};

// --- 2. Data mẫu cho Promotion ---

export const mockPromotions: Promotion[] = [
  {
    promotion_id: 1,
    name: "Giảm giá trái cây nhập khẩu",
    type: "percent",
    value: 15,
    is_active: true,
  },
  {
    promotion_id: 2,
    name: "Flash Sale rau củ tươi",
    type: "fixed_amount",
    value: 5000,
    is_active: true,
  },
  {
    promotion_id: 3,
    name: "Khuyến mãi sữa chua (Đã hết)",
    type: "percent",
    value: 30,
    is_active: false,
  },
];

// --- 3. Data mẫu cho Promotion_detail ---
// (Liên kết Promotion với mockProducts của bạn)

export const mockPromotionDetails: PromotionDetail[] = [
  // Chi tiết cho "Giảm giá trái cây nhập khẩu" (ID: 1)
  {
    promotion_id: 1,
    product_id: 1, // Táo Fuji hữu cơ 1kg
    start_date: "2025-11-01T00:00:00Z",
    end_date: "2025-11-10T23:59:59Z",
  },
  {
    promotion_id: 1,
    product_id: 6, // Nho đen không hạt Mỹ 500g
    start_date: "2025-11-01T00:00:00Z",
    end_date: "2025-11-10T23:59:59Z",
  },

  // Chi tiết cho "Flash Sale rau củ tươi" (ID: 2)
  {
    promotion_id: 2,
    product_id: 3, // Cà rốt Đà Lạt baby 500g
    start_date: "2025-10-25T00:00:00Z",
    end_date: "2025-11-05T23:59:59Z",
  },
  {
    promotion_id: 2,
    product_id: 5, // Cải bó xôi Baby 300g
    start_date: "2025-10-25T00:00:00Z",
    end_date: "2025-11-05T23:59:59Z",
  },

  // Chi tiết cho "Khuyến mãi sữa chua (Đã hết)" (ID: 3)
  {
    promotion_id: 3,
    product_id: 2, // Sữa chua Hy Lạp nguyên chất 180g
    start_date: "2025-09-01T00:00:00Z",
    end_date: "2025-09-30T23:59:59Z",
  },
];
