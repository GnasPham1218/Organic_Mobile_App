// ...existing code...
import { AppConfig } from "@/constants/AppConfig"; // Import vào
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: AppConfig.BASE_URL, // Sử dụng
  timeout: AppConfig.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

export const loginAPI = (emailOrPhone: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";

  return api.post<IBackendRes<ILogin>>(
    urlBackend,
    {
      // ✅ CHÍNH XÁC: Map giá trị nhập vào thành key "username"
      username: emailOrPhone,
      password: password,
    },
    {
      headers: { delay: 2000 }, // Option
    }
  );
};
export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return api.post<IBackendRes<null>>(urlBackend);
};
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * API Đăng ký tài khoản mới
 * Endpoint: /api/v1/auth/register
 * Lưu ý: API này sẽ tạo user và tự động kích hoạt gửi OTP trong backend
 */
export const registerUserAPI = (data: IRegisterRequest) => {
  const urlBackend = "/api/v1/auth/register";
  return api.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Xác thực OTP (Dùng sau khi đăng ký xong)
 * Endpoint: /api/v1/auth/verify-otp
 */
export const verifyOtpAPI = (data: IVerifyOtpRequest) => {
  const urlBackend = "/api/v1/auth/verify-otp";
  return api.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Gửi lại mã OTP (Dùng khi hết hạn hoặc user không nhận được mail)
 * Endpoint: /api/v1/auth/send-otp
 */
export const resendOtpAPI = (email: string) => {
  const urlBackend = "/api/v1/auth/send-otp";
  return api.post<IBackendRes<void>>(urlBackend, { email });
};

/**
 * API Gửi yêu cầu lấy lại mật khẩu (Gửi OTP qua email)
 * Endpoint: /api/v1/auth/forgot-password
 */
export const sendForgotPasswordOtpAPI = (email: string) => {
  const urlBackend = "/api/v1/auth/forgot-password";
  return api.post<IBackendRes<string>>(urlBackend, { email });
};

/**
 * API Đặt lại mật khẩu mới (Kèm OTP xác thực)
 * Endpoint: /api/v1/auth/reset-password
 */
export const resetPasswordAPI = (data: IResetPasswordRequest) => {
  const urlBackend = "/api/v1/auth/reset-password";
  return api.post<IBackendRes<string>>(urlBackend, data);
};
export const getAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return api.get<IBackendRes<IFetchAccount>>(urlBackend);
};
// =============================================================================
//  CUSTOMER ADDRESS API
// =============================================================================

/**
 * Lấy danh sách tất cả địa chỉ (Thường dùng cho Admin)
 */
export const getAllAddressesAPI = () => {
  const urlBackend = "/api/v1/address";
  return api.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Lấy chi tiết một địa chỉ theo ID
 */
export const getAddressByIdAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}`;
  return api.get<IBackendRes<ICustomerAddress>>(urlBackend);
};

/**
 * Lấy danh sách địa chỉ của một User cụ thể
 */
export const getAddressesByUserIdAPI = (userId: number) => {
  const urlBackend = `/api/v1/address/user/${userId}`;
  return api.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Tạo mới một địa chỉ
 * @param data DTO tạo mới
 */
export const createAddressAPI = (data: ICreateCustomerAddressDTO) => {
  const urlBackend = "/api/v1/address";
  return api.post<IBackendRes<ICustomerAddress>>(urlBackend, data);
};

/**
 * Cập nhật một địa chỉ
 * @param id ID của địa chỉ cần sửa
 * @param data DTO cập nhật (chỉ gửi các trường cần sửa)
 */
export const updateAddressAPI = (
  id: number,
  data: IUpdateCustomerAddressDTO
) => {
  const urlBackend = `/api/v1/address/${id}`;
  // Controller Java dùng @PatchMapping
  return api.patch<IBackendRes<ICustomerAddress>>(urlBackend, data);
};

/**
 * Xóa một địa chỉ
 * @param id ID của địa chỉ cần xóa
 */
export const deleteAddressAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}`;
  return api.delete<IBackendRes<void>>(urlBackend);
};

/**
 * Cập nhật địa chỉ mặc định
 * @param id ID của địa chỉ muốn đặt làm mặc định
 */
export const setDefaultAddressAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}/default`;
  return api.patch<IBackendRes<ICustomerAddress>>(urlBackend);
};
/**
 * Lấy danh sách đơn hàng theo User ID
 * Endpoint: /api/v1/orders/user-order/{userId}
 */
export const getOrdersByUserIdAPI = (userId: number) => {
  const urlBackend = `/api/v1/orders/user-order/${userId}`;
  return api.get<IBackendRes<IOrder[]>>(urlBackend);
};
/**
 * Lấy chi tiết đầy đủ của một đơn hàng (bao gồm thông tin sản phẩm)
 * Endpoint: /api/v1/order-details/order/{orderId}/full
 */
export const getOrderDetailFullAPI = (orderId: number) => {
  const urlBackend = `/api/v1/order-details/order/${orderId}/full`;
  // Backend trả về data là một mảng danh sách sản phẩm trong đơn
  return api.get<IBackendRes<IOrderDetailFull[]>>(urlBackend);
};
/**
 * Lấy danh sách sản phẩm có khuyến mãi tốt nhất (Phân trang)
 * Endpoint: /api/v1/products/best-promotion
 */
export const getBestPromotionProductsAPI = (page: number, size: number) => {
  const urlBackend = "/api/v1/products/best-promotion";

  // Truyền tham số page và size qua params
  return api.get<IBackendRes<ISpringRawResponse<IBestPromotionProduct>>>(
    urlBackend,
    {
      params: {
        page: page,
        size: size,
      },
    }
  );
};
/**
 * Lấy danh sách sản phẩm mới về
 * Endpoint: /api/v1/products/new-arrivals
 */
export const getNewArrivalsAPI = (page: number, size: number) => {
  const urlBackend = "/api/v1/products/new-arrivals";

  // Truyền tham số page và size qua params
  return api.get<IBackendRes<ISpringRawResponse<IBestPromotionProduct>>>(
    urlBackend,
    {
      params: {
        page: page,
        size: size,
      },
    }
  );
};

/**
 * Lấy giỏ hàng của User hiện tại
 * Endpoint: /api/v1/cart/my-cart
 * Token: Tự động được gắn bởi Interceptor
 */
export const getMyCartAPI = () => {
  const urlBackend = "/api/v1/cart/my-cart";
  // Trả về IBackendRes chứa mảng các món hàng (ICartItemDTO[])
  return api.get<IBackendRes<ICartItemDTO[]>>(urlBackend);
};

/**
 * Thêm sản phẩm vào giỏ hàng (Chỉ dùng cho TẠO MỚI HOẶC CỘNG DỒN)
 * Endpoint: /api/v1/items
 * Method: POST
 */
export const addToCartAPI = (productId: number, quantity: number) => {
  const urlBackend = "/api/v1/items";

  // Payload gửi đi
  const data = {
    productId: productId,
    quantity: quantity,
  };

  // ✅ CHỈ GỌI POST VÀ TRẢ VỀ KẾT QUẢ THÀNH CÔNG
  return api.post<IBackendRes<IAddCartResponse>>(urlBackend, data);
};
/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng (SET CỨNG số lượng, hoặc XÓA nếu quantity=0)
 * Endpoint: /api/v1/items
 * Method: PUT
 */
export const updateCartAPI = (productId: number, quantity: number) => {
  const urlBackend = "/api/v1/items";
  const data = { productId: productId, quantity: quantity };

  // 💡 LƯU Ý: Không cần if/else ở đây. Ta để cho Context quyết định
  // Context sẽ gọi hàm này khi:
  // 1. Giảm số lượng (update: 4 -> 3)
  // 2. Xóa hẳn (update: quantity -> 0)

  // ✅ CHỈ GỌI PUT
  return api.put<IBackendRes<void>>(urlBackend, data); // Trả về void (hoặc DTO nếu Backend trả 200)
};
// =============================================================================
//  PRODUCT DETAIL & IMAGE API
// =============================================================================

/**
 * Lấy chi tiết một sản phẩm theo ID
 * Endpoint: /api/v1/products/{id}
 * Dữ liệu trả về tương ứng với JSON bạn đã cung cấp (data: {...})
 */
export const getProductDetailAPI = (id: number) => {
  const urlBackend = `/api/v1/products/${id}`;
  // IProductDetail là kiểu dữ liệu cho object sản phẩm chi tiết
  return api.get<IBackendRes<IProductDetail>>(urlBackend);
};

/**
 * Lấy danh sách ảnh phụ của một sản phẩm
 * Endpoint: /api/v1/product-images/product/{productId}
 * Dữ liệu trả về tương ứng với JSON bạn đã cung cấp (data: [{}, {}, ...])
 */
export const getProductImagesAPI = (productId: number) => {
  const urlBackend = `/api/v1/product-images/product/${productId}`;
  // IProductImage[] là kiểu dữ liệu cho mảng các đối tượng ảnh phụ
  return api.get<IBackendRes<IProductImage[]>>(urlBackend);
};
export const getBestPromotionByProductId = (id: number) => {
  const urlBackend = `/api/v1/promotion-details/${id}/best-promotion`;
  return api.get<IBackendRes<IBestPromotion>>(urlBackend);
};
// =============================================================================
//  REVIEW API
// =============================================================================

/**
 * Lấy danh sách reviews theo productId (có phân trang)
 * @param productId ID của sản phẩm
 * @param page Trang hiện tại (mặc định 0)
 * @param size Số lượng items mỗi trang (mặc định 10)
 */
export const getReviewsByProductIdAPI = (
  productId: number,
  page: number = 0,
  size: number = 10
) => {
  const urlBackend = `/api/v1/reviews/product/${productId}?page=${page}&size=${size}`;
  return api.get<IBackendRes<ISpringRawResponse<IResReviewDTO>>>(urlBackend);
};

/**
 * Lấy chi tiết một review theo ID
 * @param id ID của review
 */
export const getReviewByIdAPI = (id: number) => {
  const urlBackend = `/api/v1/reviews/${id}`;
  return api.get<IBackendRes<IResReviewDTO>>(urlBackend);
};

/**
 * Tạo mới một review
 * @param data DTO tạo review
 *
 * Lưu ý:
 * - Backend sẽ kiểm tra user đã review sản phẩm này chưa
 * - Backend sẽ kiểm tra user đã mua, thanh toán và nhận hàng thành công chưa
 * - Nếu không đủ điều kiện sẽ throw RuntimeException
 */
export const createReviewAPI = (data: ICreateReviewDTO) => {
  const urlBackend = "/api/v1/reviews";

  // --- BƯỚC MAPPING: Chuyển từ phẳng (Flat) sang lồng nhau (Nested) ---
  const payload = {
    rating: data.rating,
    comment: data.comment,
    product: {
      id: data.productId,
    },
    user: {
      id: data.userId,
    },
  };

  // Gửi payload (đã lồng nhau) đi thay vì data gốc
  return api.post<IBackendRes<IResReviewDTO>>(urlBackend, payload);
};
/**
 * Cập nhật một review
 * @param id ID của review cần sửa
 * @param data DTO cập nhật (chỉ gửi các trường cần sửa)
 */
export const updateReviewAPI = (id: number, data: IUpdateReviewDTO) => {
  // Nối id vào URL: /api/v1/reviews/10
  const urlBackend = `/api/v1/reviews/${id}`;

  // Dùng api.patch tương ứng với @PatchMapping của backend
  return api.patch<IBackendRes<IResReviewDTO>>(urlBackend, data);
};

/**
 * Xóa một review
 * @param id ID của review cần xóa
 */
export const deleteReviewAPI = (id: number) => {
  const urlBackend = `/api/v1/reviews/${id}`;
  return api.delete<IBackendRes<void>>(urlBackend);
};

export const searchProductsAPI = (query: string) => {
  const urlBackend = `/api/v1/products/search?query=${encodeURIComponent(
    query
  )}&size=10`;

  return api.get<IBackendRes<any[]>>(urlBackend).then((res) => {
    if (!res.data.data) return [];

    const mapped: IProductSearchItem[] = res.data.data.map((item) => {
      const p = item.product;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        slug: p.slug,
        image: p.image,
        bestPromotion: item.bestPromotion || null,
      };
    });

    return mapped;
  });
};
export const getAllCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories?size=1000";
  return api.get<IBackendRes<ISpringRawResponse<ICategory>>>(urlBackend);
};
// Hàm helper để map key sort từ UI sang string sort của Spring Boot
const getSortString = (sortKey: string): string | undefined => {
  switch (sortKey) {
    case "price_asc":
      return "price,asc";
    case "price_desc":
      return "price,desc";
    case "name_asc":
      return "name,asc";
    default:
      return undefined; // Mặc định của BE (thường là id,desc hoặc created_at,desc)
  }
};

// 1. Lấy tất cả sản phẩm (cho mục "Tất cả sản phẩm")
export const getProductCardListAPI = (
  page: number,
  size: number,
  sortKey?: string
) => {
  let urlBackend = `/api/v1/products?page=${page}&size=${size}`;
  const sortParam = getSortString(sortKey || "");

  if (sortParam) {
    urlBackend += `&sort=${sortParam}`;
  }

  return api.get<IBackendRes<ISpringRawResponse<IProductCard>>>(urlBackend);
};

// 2. Lấy sản phẩm theo Category ID
export const getProductsByCategoryAPI = (
  id: number,
  page: number,
  size: number,
  sortKey?: string
) => {
  let urlBackend = `/api/v1/product/category/${id}?page=${page}&size=${size}`;
  const sortParam = getSortString(sortKey || "");

  if (sortParam) {
    urlBackend += `&sort=${sortParam}`;
  }

  return api.get<IBackendRes<ISpringRawResponse<IProductCard>>>(urlBackend);
};
export const getParentCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories/parents";
  return api.get<IBackendRes<IParentCategory>>(urlBackend);
};
