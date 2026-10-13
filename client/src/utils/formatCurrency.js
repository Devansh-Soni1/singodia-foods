export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN');
};

export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

