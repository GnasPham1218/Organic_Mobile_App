// Dựa trên bảng Promotion của bạn
export type TPromotion = {
  promotion_id: number;
  name: string;
  type: "percent" | "fixed_amount";
  value: number; 
  is_active: boolean;
};

// Kiểu dữ liệu cho một sản phẩm trong trang chi tiết
export type TPromotionProduct = {
  product_id: number;
  product_name: string;
  product_image_url: string; 
  original_price: number; 
  start_date: string; // Dạng ISO date string
  end_date: string; // Dạng ISO date string
};

// Kiểu dữ liệu đầy đủ cho trang chi tiết
export type TPromotionDetail = {
  promotion: TPromotion;
  products: TPromotionProduct[];
};