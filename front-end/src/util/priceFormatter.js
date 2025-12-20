/**
 * Format số tiền thành VND
 * @param {number} price - Giá tiền
 * @returns {string} - Giá đã format (VD: "100,000đ")
 */
export const formatPrice = (price) => {
    if (!price && price !== 0) return '0đ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

/**
 * Format số tiền không có ký hiệu
 * @param {number} price 
 * @returns {string} - VD: "100,000"
 */
export const formatPriceNoSymbol = (price) => {
    if (!price && price !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
};

/**
 * Parse string giá tiền về number
 * @param {string} priceStr - "100,000" hoặc "100.000"
 * @returns {number}
 */
export const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.toString().replace(/[.,]/g, ''));
};

/**
 * Tính tổng tiền từ array
 * @param {Array} items - Array chứa items có giá
 * @param {string} priceKey - Key của giá trong object
 * @returns {number}
 */
export const calculateTotal = (items, priceKey = 'thanh_tien') => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + (item[priceKey] || 0), 0);
};

/**
 * Tính thành tiền (đơn giá × số lượng)
 * @param {number} price - Đơn giá
 * @param {number} quantity - Số lượng
 * @returns {number}
 */
export const calculateSubtotal = (price, quantity) => {
    return (price || 0) * (quantity || 0);
};