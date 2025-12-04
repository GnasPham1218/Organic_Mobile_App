//Hàm format tiền
export const formatCurrency = (amount: number) => {
  const numberPart = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(amount);

  return `${numberPart}đ`;
};

//Hàm format ngày
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const formatCategoryName = (name: string) => {
  if (!name) return "";

  let str = String(name).trim();
  if (str.length === 0) return "";

  str = str.toLowerCase();

  str = str.charAt(0).toUpperCase() + str.slice(1);

  str = str.replace(/\bviệt\b/g, "Việt");
  str = str.replace(/\bnam\b/g, "Nam");

  return str;
};
/**
 * Hàm chuyển đổi chuỗi định dạng Python/JS Object (dùng 'key') sang JSON chuẩn
 * @param rawString Chuỗi dữ liệu thô (vd: "[{'key': 'value'}]")
 * @returns Chuỗi JSON hợp lệ hoặc null nếu lỗi
 */
export const formatDescriptionToJson = (rawString: string): string | null => {
  try {
    if (!rawString) return null;

    let jsonString = rawString.replace(/'([^']+?)'\s*:/g, '"$1":');

    const jsObject = new Function(`return ${rawString}`)();

    return JSON.stringify(jsObject, null, 2);
  } catch (error) {
    console.error("Lỗi format description:", error);
    return null;
  }
};
/**
 * Format ID thành mã đơn hàng (VD: 13 -> DH000013)
 * @param id - Số ID của đơn hàng
 * @param prefix - Tiền tố (mặc định là DH)
 * @param length - Độ dài phần số (mặc định là 6)
 */
export const formatOrderCode = (
  id: number | string,
  prefix: string = "DH",
  length: number = 6
): string => {
  if (!id) return "";
  return `${prefix}${id.toString().padStart(length, "0")}`;
};
