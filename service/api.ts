import { AppConfig } from "@/constants/AppConfig"; // Import vào
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: AppConfig.BASE_URL, // Sử dụng
  timeout: AppConfig.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const loginAPI = (emailOrPhone: string, password: string) => {
  const urlBackend = "/auth/login";

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
  const urlBackend = "/auth/logout";
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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Nếu Backend trả về lỗi 401 (Unauthorized) -> Token hết hạn hoặc sai
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn hoặc không hợp lệ. Đang logout...");

      // 1. Xóa token cũ
      await AsyncStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);
/**
 * API Đăng ký tài khoản mới
 * Endpoint: /auth/register
 * Lưu ý: API này sẽ tạo user và tự động kích hoạt gửi OTP trong backend
 */
export const registerUserAPI = (data: IRegisterRequest) => {
  const urlBackend = "/auth/register";
  return api.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Xác thực OTP (Dùng sau khi đăng ký xong)
 * Endpoint: /auth/verify-otp
 */
export const verifyOtpAPI = (data: IVerifyOtpRequest) => {
  const urlBackend = "/auth/verify-otp";
  return api.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Gửi lại mã OTP (Dùng khi hết hạn hoặc user không nhận được mail)
 * Endpoint: /auth/send-otp
 */
export const resendOtpAPI = (email: string) => {
  const urlBackend = "/auth/send-otp";
  return api.post<IBackendRes<void>>(urlBackend, { email });
};

/**
 * API Gửi yêu cầu lấy lại mật khẩu (Gửi OTP qua email)
 * Endpoint: /auth/forgot-password
 */
export const sendForgotPasswordOtpAPI = (email: string) => {
  const urlBackend = "/auth/forgot-password";
  return api.post<IBackendRes<string>>(urlBackend, { email });
};

/**
 * API Đặt lại mật khẩu mới (Kèm OTP xác thực)
 * Endpoint: /auth/reset-password
 */
export const resetPasswordAPI = (data: IResetPasswordRequest) => {
  const urlBackend = "/auth/reset-password";
  return api.post<IBackendRes<string>>(urlBackend, data);
};
export const getAccountAPI = () => {
  const urlBackend = "/auth/account";
  return api.get<IBackendRes<IFetchAccount>>(urlBackend);
};
// =============================================================================
//  CUSTOMER ADDRESS API
// =============================================================================

/**
 * Lấy danh sách tất cả địa chỉ (Thường dùng cho Admin)
 */
export const getAllAddressesAPI = () => {
  const urlBackend = "/address";
  return api.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Lấy chi tiết một địa chỉ theo ID
 */
export const getAddressByIdAPI = (id: number) => {
  const urlBackend = `/address/${id}`;
  return api.get<IBackendRes<ICustomerAddress>>(urlBackend);
};

/**
 * Lấy danh sách địa chỉ của một User cụ thể
 */
export const getAddressesByUserIdAPI = (userId: number) => {
  const urlBackend = `/address/user/${userId}`;
  return api.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Tạo mới một địa chỉ
 * @param data DTO tạo mới
 */
export const createAddressAPI = (data: ICreateCustomerAddressDTO) => {
  const urlBackend = "/address";
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
  const urlBackend = `/address/${id}`;
  // Controller Java dùng @PatchMapping
  return api.patch<IBackendRes<ICustomerAddress>>(urlBackend, data);
};

/**
 * Xóa một địa chỉ
 * @param id ID của địa chỉ cần xóa
 */
export const deleteAddressAPI = (id: number) => {
  const urlBackend = `/address/${id}`;
  return api.delete<IBackendRes<void>>(urlBackend);
};

/**
 * Cập nhật địa chỉ mặc định
 * @param id ID của địa chỉ muốn đặt làm mặc định
 */
export const setDefaultAddressAPI = (id: number) => {
  const urlBackend = `/address/${id}/default`;
  return api.patch<IBackendRes<ICustomerAddress>>(urlBackend);
};
/**
 * Lấy danh sách đơn hàng theo User ID
 * Endpoint: /orders/user-order/{userId}
 */
export const getOrdersByUserIdAPI = (userId: number) => {
  const urlBackend = `/orders/user-order/${userId}`;
  return api.get<IBackendRes<IOrder[]>>(urlBackend);
};
/**
 * Lấy chi tiết đầy đủ của một đơn hàng (bao gồm thông tin sản phẩm)
 * Endpoint: /order-details/order/{orderId}/full
 */
export const getOrderDetailFullAPI = (orderId: number) => {
  const urlBackend = `/order-details/order/${orderId}/full`;
  // Backend trả về data là một mảng danh sách sản phẩm trong đơn
  return api.get<IBackendRes<IOrderDetailFull[]>>(urlBackend);
};
/**
 * Lấy danh sách sản phẩm có khuyến mãi tốt nhất (Phân trang)
 * Endpoint: /products/best-promotion
 */
export const getBestPromotionProductsAPI = (page: number, size: number) => {
  const urlBackend = "/products/best-promotion";

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
 * Endpoint: /products/new-arrivals
 */
export const getNewArrivalsAPI = (page: number, size: number) => {
  const urlBackend = "/products/new-arrivals";

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
 * Endpoint: /cart/my-cart
 * Token: Tự động được gắn bởi Interceptor
 */
export const getMyCartAPI = () => {
  const urlBackend = "/cart/my-cart";
  // Trả về IBackendRes chứa mảng các món hàng (ICartItemDTO[])
  return api.get<IBackendRes<ICartItemDTO[]>>(urlBackend);
};

/**
 * Thêm sản phẩm vào giỏ hàng (Chỉ dùng cho TẠO MỚI HOẶC CỘNG DỒN)
 * Endpoint: /items
 * Method: POST
 */
export const addToCartAPI = (productId: number, quantity: number) => {
  const urlBackend = "/items";

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
 * Endpoint: /items
 * Method: PUT
 */
export const updateCartAPI = (productId: number, quantity: number) => {
  const urlBackend = "/items";
  const data = { productId: productId, quantity: quantity };

  // 💡 LƯU Ý: Không cần if/else ở đây. Ta để cho Context quyết định
  // Context sẽ gọi hàm này khi:
  // 1. Giảm số lượng (update: 4 -> 3)
  // 2. Xóa hẳn (update: quantity -> 0)

  // ✅ CHỈ GỌI PUT
  return api.put<IBackendRes<void>>(urlBackend, data); // Trả về void (hoặc DTO nếu Backend trả 200)
};
export const clearCartAPI = (userId: number) => {
  return api.delete(`/api/v1/cart/clear/${userId}`);
};
// =============================================================================
//  PRODUCT DETAIL & IMAGE API
// =============================================================================

/**
 * Lấy chi tiết một sản phẩm theo ID
 * Endpoint: /products/{id}
 * Dữ liệu trả về tương ứng với JSON bạn đã cung cấp (data: {...})
 */
export const getProductDetailAPI = (id: number) => {
  const urlBackend = `/products/${id}`;
  // IProductDetail là kiểu dữ liệu cho object sản phẩm chi tiết
  return api.get<IBackendRes<IProductDetail>>(urlBackend);
};

/**
 * Lấy danh sách ảnh phụ của một sản phẩm
 * Endpoint: /product-images/product/{productId}
 * Dữ liệu trả về tương ứng với JSON bạn đã cung cấp (data: [{}, {}, ...])
 */
export const getProductImagesAPI = (productId: number) => {
  const urlBackend = `/product-images/product/${productId}`;
  // IProductImage[] là kiểu dữ liệu cho mảng các đối tượng ảnh phụ
  return api.get<IBackendRes<IProductImage[]>>(urlBackend);
};
export const getBestPromotionByProductId = (id: number) => {
  const urlBackend = `/promotion-details/${id}/best-promotion`;
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
  const urlBackend = `/reviews/product/${productId}?page=${page}&size=${size}`;
  return api.get<IBackendRes<ISpringRawResponse<IResReviewDTO>>>(urlBackend);
};

/**
 * Lấy chi tiết một review theo ID
 * @param id ID của review
 */
export const getReviewByIdAPI = (id: number) => {
  const urlBackend = `/reviews/${id}`;
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
  const urlBackend = "/reviews";

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
  // Nối id vào URL: /reviews/10
  const urlBackend = `/reviews/${id}`;

  // Dùng api.patch tương ứng với @PatchMapping của backend
  return api.patch<IBackendRes<IResReviewDTO>>(urlBackend, data);
};

/**
 * Xóa một review
 * @param id ID của review cần xóa
 */
export const deleteReviewAPI = (id: number) => {
  const urlBackend = `/reviews/${id}`;
  return api.delete<IBackendRes<void>>(urlBackend);
};

export const searchProductsAPI = (query: string) => {
  const urlBackend = `/products/search?query=${encodeURIComponent(
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
  const urlBackend = "/categories?size=1000";
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
  let urlBackend = `/products?page=${page}&size=${size}`;
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
  let urlBackend = `/product/category/${id}?page=${page}&size=${size}`;
  const sortParam = getSortString(sortKey || "");

  if (sortParam) {
    urlBackend += `&sort=${sortParam}`;
  }

  return api.get<IBackendRes<ISpringRawResponse<IProductCard>>>(urlBackend);
};
export const getParentCategoriesAPI = () => {
  const urlBackend = "/categories/parents";
  return api.get<IBackendRes<IParentCategory>>(urlBackend);
};
/**
 * API Lấy danh sách Voucher

 */
export const getVouchersAPI = () => {
  return api.get<IBackendRes<IVoucher[]>>("/vouchers");
};
/**
 * API Lấy danh sách Khuyến mãi (Promotions)

 */
export const getPromotionsAPI = () => {
  return api.get<IBackendRes<IPromotion[]>>("/promotions");
};
/**
 * API Lấy danh sách sản phẩm theo Promotion ID
 * Kết quả trả về: IBackendRes < ISpringRawResponse < IPromotionProduct > >
 */
export const getProductsByPromotionIdAPI = (
  id: number,
  page: number = 1,
  size: number = 10
) => {
  return api.get<IBackendRes<ISpringRawResponse<IPromotionProduct>>>(
    `/products/promotion/${id}`,
    {
      params: { page, size },
    }
  );
};
/**
 * Lấy chi tiết một voucher theo mã code.
 * Endpoint: GET /api/v1/vouchers/code/{code}
 * @param code Mã code của voucher
 */
export const getVoucherByCodeAPI = (code: string) => {
  const urlBackend = `/vouchers/code/${code}`;
  // Giả định backend trả về IBackendRes chứa IResVoucherDTO
  return api.get<IBackendRes<IResVoucherDTO>>(urlBackend);
};

export const PaymentAPI = {
  // 1. Tạo link thanh toán
  createPayment: async (data: CreatePaymentRequest) => {
    const response = await api.post<IBackendRes<IPaymentResponse>>(
      `/payments/create`,
      data
    );
    return response.data;
  },

  // 2. Check trạng thái
  checkStatus: async (paymentId: number) => {
    const response = await api.get<IBackendRes<IPaymentStatus>>(
      `/payments/status/${paymentId}`
    );
    return response.data;
  },
  // 3. Hủy thanh toán
  cancelPayment: async (paymentId: number) => {
    const response = await api.patch<IBackendRes<any>>(
      `/payments/${paymentId}`,
      {
        status: "CANCELLED",
      }
    );
    return response.data;
  },
};

/**
 * API Đặt hàng dành cho User (Checkout)
 * Endpoint: POST /api/v1/orders/place-order
 * Xử lý: Tạo Order -> Trừ kho -> Tạo Invoice -> Trả về kết quả để thanh toán
 */
export const placeOrderAPI = (data: IReqPlaceOrder) => {
  const urlBackend = `/orders/place-order`;
  return api.post<IBackendRes<IResPlaceOrder>>(urlBackend, data);
};
/**
 * Lấy chi tiết đơn hàng (Dành cho User - Success Page)
 * Endpoint: GET /api/v1/orders/user/{id}
 */
export const getOrderByIdV2API = (id: number) => {
  const urlBackend = `/orders/user/${id}`;
  return api.get<IBackendRes<IResOrderDTO>>(urlBackend);
};
