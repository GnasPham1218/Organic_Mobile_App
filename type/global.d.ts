// File path: /src/types/global.d.ts

export {};

// =============================================================================
// 1. MODULE DECLARATIONS & ENVIRONMENT
// =============================================================================
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";

declare module "@env" {
  export const BACKEND_URL: string;
  export const AVATAR_URL: string;
}

declare global {
  // =============================================================================
  // 2. CORE API RESPONSES
  // =============================================================================
  interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    statusCode: number | string;
    data?: T;
  }

  // Response dạng phân trang từ Spring Boot
  interface ISpringRawResponse<T> {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  // =============================================================================
  // 3. AUTHENTICATION & USER SYSTEM
  // =============================================================================
  interface IUser {
    id: number;
    email: string;
    name: string;
    role: string;
    phone?: string;
    avatar?: string;
  }

  interface ILogin {
    access_token: string;
    userLogin: IUser;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IRegister {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }

  interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }

  interface IVerifyOtpRequest {
    email: string;
    otp: string;
  }

  interface IResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
  }

  // --- Profiles & Roles ---
  interface ICustomer {
    id: number;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
  }

  // Dùng cho quản lý danh sách khách hàng (Admin)
  interface ICustomerTable {
    id: number;
    member: boolean; // Lưu ý: Có 2 interface ICustomerTable trong bản gốc, mình giữ logic bao gồm cả user
    user: ICustomer;
    // Nếu cần bản flat (id, email, name, phone) hãy đặt tên khác, ví dụ ICustomerFlatTable
  }

  interface ICustomerProfile {
    data: {
      id: number;
      member: boolean;
      userId: number;
    };
  }

  interface IEmployee {
    id: number;
    employeeCode: string;
    address: string;
    hireDate: string;
    salary: number;
    user: ICustomer; // Có thể employee cũng dùng chung base user info
  }

  interface IEmployeeProfile {
    data: {
      id: number;
      employeeCode: string;
      address: string;
      hireDate: string;
      salary: number;
      userId: number;
    };
  }

  // =============================================================================
  // 4. PRODUCT CATALOG (PRODUCTS, CATEGORIES, SUPPLIERS)
  // =============================================================================

  // --- Category ---
  interface ICategory {
    id: number;
    name: string;
    slug: string;
    parentCategory: ICategory | null;
  }

  interface IParentCategory {
    id: number;
    name: string;
    slug: string;
    parentCategory: ICategory | null;
  }

  interface ICategoryTable {
    id: number;
    name: string;
    slug: string;
    parentCategoryId?: number | null;
    parentName?: string | null;
  }

  interface ICreateCategoryDTO {
    name: string;
    slug: string;
    parentCategoryId?: number;
  }

  interface IUpdateCategoryDTO {
    name: string;
    slug: string;
    parentId?: number;
  }

  // --- Supplier ---
  export interface ISupplier {
    id: number;
    name: string;
    code?: string;
    taxNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }

  export interface ICreateSupplierDTO {
    name: string;
    code?: string;
    taxNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }

  // --- Product Entities ---
  interface IProduct {
    id: number;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    origin_address: string;
    description: string;
    rating_avg: number;
    slug: string | null;
    image?: string;
    active: boolean;
    mfgDate: Date;
    expDate: Date;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
    categoryId: number;
  }
  // types/product.d.ts hoặc ngay trong file component
  export interface IDescriptionItem {
    subtitle: string;
    text: string;
  }

  export interface IDescriptionSection {
    heading: string;
    items: IDescriptionItem[];
  }
  // Chi tiết sản phẩm (Response từ API chi tiết)
  interface IProductDetail {
    id: number;
    name: string;
    unit: string;
    price: number;
    origin_address: string;
    /**
     * Trường này là chuỗi JSON hóa (JSON String) chứa thông tin mô tả chi tiết.
     * Cần phải dùng JSON.parse() ở Front-end để chuyển thành IDescriptionItem[].
     */
    description: string;
    rating_avg: number;
    quantity: number;
    slug: string;
    /** Ảnh đại diện chính của sản phẩm (tên file) */
    image: string;
    active: boolean;
    mfgDate: string; // Ngày sản xuất (ISO String)
    expDate: string; // Hạn sử dụng (ISO String)

    // Các trường Metadata (có thể là null)
    createAt: string | null;
    updateAt: string | null;
    createBy: string | null;
    updateBy: string | null;

    categoryId: number;

    /** Mảng các chứng nhận liên quan đến sản phẩm */
    certificates: ICertificate[];

    /** Mảng ảnh phụ (thường là rỗng trong endpoint này, cần dùng getProductImagesAPI) */
    images: IProductImage[];
  }

  // Dùng cho thẻ sản phẩm (Card UI)
  interface IProductCard {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    discount?: IDiscount;
  }

  interface IProductSearchItem {
    id: number;
    name: string;
    price: number;
    slug: string;
    image: string;
    bestPromotion: IBestPromotion | null;
  }
  export interface IBestPromotionProduct {
    id: number;
    name: string;
    unit: string;
    image: string;
    quantity: number;
    originalPrice: number;
    finalPrice: number;
    promotionId: number;
    promotionName: string;
    promotionType: "PERCENT" | "FIXED_AMOUNT";
    promotionValue: number;
    promotionStartDate: string;
    promotionEndDate: string;
  }
  interface IProductImage {
    id: number;
    imgUrl: string;
    product_id: number;
  }

  // Wrapper cho response chứng chỉ
  interface Certificate {
    data: {
      id: number;
      name: string;
    };
  }
  interface ICertificate {
    id: number;
    name: string;
    image: string; // Tên file ảnh logo
    certNo: string; // Số chứng nhận
    imageUrl: string; // URL đầy đủ của ảnh
    date: string; // Ngày cấp (ISO String)
  }
  interface ICertification {
    id: number;
    name: string;
    logo: string;
    imageUrl: string;
    description: string;
  }

  export interface ProductCertificateDetail {
    certificateId: number;
    name: string;
    typeImageUrl: string;
    certNo: string;
    date: string;
    specificImageUrl: string;
  }

  interface IProductTable {
    imageUrl: string;
    certNo: string;
    date: string;
    product: IProduct;
    certificate: ICertificate[]; // Ưu tiên mảng chứng chỉ
  }

  // =============================================================================
  // 5. SHOPPING CART
  // =============================================================================
  interface ICartItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: IDiscount;
    quantity: number;
    maxQuantityAvailable: number;
  }

  interface ICreateCartItemDTO {
    productId: number;
    quantity: number;
  }

  interface IUpdateCartItemDTO {
    quantity: number;
  }

  interface ICartItemResponse {
    id: number;
    quantity: number;
    product: IProductCard;
    originalPrice?: number;
    discount?: number;
  }
  interface IAddCartResponse {
    id: number; // ID của CartItem vừa tạo/update
    quantity: number; // Số lượng mới
    addedAt: string; // Thời gian thêm
    cartId: number; // ID của giỏ hàng
    productId: number; // ID sản phẩm
  }
  interface IUpdateCartResponse {
    id: number;
    quantity: number;
    addedAt: string;
    cartId: number;
    productId: number;
  }
  interface ICartItemDTO {
    id: number;
    productName: string;
    slug: string;
    image: string;
    originalPrice: number;
    price: number;
    quantity: number;
    stock: number;
    promotionId?: number | null;
    promotionType?: "PERCENT" | "FIXED_AMOUNT" | null;
    value?: number | null;
  }

  interface ICartResponse {
    id: number;
    userId: number;
    items: ICartItemResponse[];
    createdAt: string;
    updatedAt: string;
  }

  // =============================================================================
  // 6. ORDER & RETURNS
  // =============================================================================
  export interface IOrder {
    id: number;
    orderAt: string;
    note?: string;
    statusOrder: string;
    shipAddress: string;
    estimatedDate?: string;
    actualDate?: string;
    userId?: number;
    orderDetails?: IOrderDetailFull[];
  }

  export interface IOrderDetailFull {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: IProduct;
    order: IOrder;
  }

  export interface ICreateOrderDetailDTO {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }

  export interface IReturn {
    id: number;
    reason: string;
    status: string;
    returnType: string;
    createdAt: string;
    approvedAt: string;
    processedBy: string;
    processNote: string;
    orderId: number;
    customerName: string;
  }

  export interface ICreateReturnDTO {
    reason: string;
    status: string;
    returnType: string;
    processNote: string;
    orderId: number;
  }

  // =============================================================================
  // 7. PROMOTIONS & VOUCHERS
  // =============================================================================
  interface IDiscount {
    id?: number;
    type: "PERCENT" | "FIXED_AMOUNT";
    value: number;
  }

  interface IBestPromotion {
    id: number;
    promotionName: string;
    value: number;
    type: "PERCENT" | "FIXED_AMOUNT";
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    endDate: string;
  }

  export interface IResVoucherDTO {
    id: number;
    code: string;
    description?: string;
    typeVoucher: "PERCENT" | "FIXED_AMOUNT" | "FREESHIP";
    value: number;
    maxDiscountAmount: number;
    minOrderValue: number;
    startDate: string;
    endDate: string;
    quantity: number;
    usedCount: number;
    active: boolean;
  }

  // =============================================================================
  // 8. ADDRESS & LOCATION (GHN/Administrative)
  // =============================================================================

  // Interface hiển thị (DB Model)
  export interface ICustomerAddress {
    id: number;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note?: string;
    defaultAddress: boolean;
    user?: IUser;
  }

  // Alias dùng cho các component quản lý địa chỉ
  export interface IAddress {
    id: number;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note: string;
    defaultAddress: boolean;
    user?: {
      id: number;
    };
  }

  // API Hành chính
  export interface IWard {
    Name: string;
    Code?: string;
  }

  export interface IDistrict {
    Name: string;
    Wards: IWard[];
  }

  export interface IProvince {
    Name: string;
    Districts: IDistrict[];
  }

  // DTOs
  export interface ICreateCustomerAddressDTO {
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note?: string;
    defaultAddress?: boolean;
    userId?: number;
  }

  export interface IUpdateCustomerAddressDTO {
    receiverName?: string;
    phone?: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
    note?: string;
    defaultAddress?: boolean;
  }

  export interface IAddressPayload {
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note: string;
    defaultAddress: boolean;
    user?: { id: number };
  }

  // =============================================================================
  // 9. REVIEWS & COMMENTS
  // =============================================================================
  export interface IComment {
    id: number;
    userId: number;
    user: string;
    content: string;
    rating: number;
    date?: string;
  }

  export interface IReview {
    id: number;
    comment: string;
    rating: number;
    createdAt: string;
    productId: number;
    userId: number;
  }

  export interface IResReviewDTO {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    userId: number;
    productId: number;
    userName: string;
    userAvatar?: string;
  }

  export interface ICreateReviewDTO {
    productId: number;
    rating: number;
    comment: string;
    userId: number;
  }

  export interface IUpdateReviewDTO {
    rating: number;
    comment: string;
  }
  // =============================================================================
  // 10. VOUCHERS
  // =============================================================================

  export type VoucherType = "PERCENT" | "FIXED_AMOUNT" | "FREESHIP";

  export interface IVoucher {
    id: number;
    code: string;
    description: string;
    typeVoucher: VoucherType;
    value: number;
    maxDiscountAmount: number;
    minOrderValue: number;
    startDate: string;
    endDate: string;
    quantity: number;
    usedCount: number;
    active: boolean;
  }

  // =============================================================================
  // 11. PROMOTIONS
  // =============================================================================
  export type PromotionType = "PERCENT" | "FIXED_AMOUNT";

  export interface IPromotion {
    id: number;
    name: string;
    type: PromotionType;
    value: number;
    active: boolean;
  }
  export interface IPromotionProduct {
    productId: number;
    productName: string;
    slug: string;
    quantity: number;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    promotionStartDate: string;
    promotionEndDate: string;
    promotionType: "PERCENT" | "FIXED_AMOUNT";
    promotionValue: number;
  }
}
