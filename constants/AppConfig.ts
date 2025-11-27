// File: src/constants/AppConfig.ts

// Bạn chỉ cần thay IP ở đây mỗi khi IP máy tính đổi
const IP_ADDRESS = "192.168.1.15";
const PORT = "8080";

export const AppConfig = {
  // Đường dẫn gốc API
  BASE_URL: `http://${IP_ADDRESS}:${PORT}`,

  // Đường dẫn hiển thị ảnh
  AVATAR_URL: `http://${IP_ADDRESS}:${PORT}/storage/images/avatar/`,
  PRODUCTS_URL: `http://${IP_ADDRESS}:${PORT}/storage/images/products/`,
  CERT_URL: `http://${IP_ADDRESS}:${PORT}/storage/images/certs/`,

  // Các config khác nếu cần
  TIMEOUT: 30000,
};
