// data/mockData.ts

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
];

export const mockBanners = [
  require("@/assets/banners/b1.jpg"),
  require("@/assets/banners/b2.jpg"),// Sửa lại để không bị trùng
  require("@/assets/banners/b2.jpg"),// Sửa lại để không bị trùng
];

// ## BƯỚC 2: Sửa lại các định nghĩa Type cho nhất quán ##

// Lấy kiểu dữ liệu trực tiếp từ mảng mockProducts đã được hợp nhất
type ProductType = (typeof mockProducts)[0];

// Dùng ProductType để định nghĩa ProductInfo, loại bỏ trường quantity không cần thiết
export type ProductInfo = Omit<ProductType, "quantity">;

// ======================================================
// PHẦN 2: DỮ LIỆU ĐƠN HÀNG (ĐÃ SỬA LẠI)
// ======================================================

export type Order = {
  id: string;
  status: "processing" | "shipping";
  totalItems: number;
  totalPrice: string;
  items: ProductType[]; // Sử dụng ProductType đã định nghĩa
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// ## BƯỚC 3: Sửa lại logic tính toán trong mockOngoingOrders ##
export const mockOngoingOrders: Order[] = [
  {
    id: "DH789123",
    status: "processing",
    items: [mockProducts[0], mockProducts[4], mockProducts[2]], // Táo, Cải bó xôi, Cà rốt
    totalItems: 3,
    totalPrice: formatCurrency(
      (mockProducts[0].salePrice ?? mockProducts[0].price) +
        (mockProducts[4].salePrice ?? mockProducts[4].price) +
        (mockProducts[2].salePrice ?? mockProducts[2].price)
    ), // 69k + 28k + 32k = 129.000đ
  },
  {
    id: "DH564879",
    status: "shipping",
    items: [mockProducts[3], mockProducts[5]], // Thịt ba rọi, Nho đen
    totalItems: 2,
    totalPrice: formatCurrency(
      (mockProducts[3].salePrice ?? mockProducts[3].price) +
        (mockProducts[5].salePrice ?? mockProducts[5].price)
    ), // 115k + 79k = 194.000đ (Sửa lại comment cho đúng)
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
