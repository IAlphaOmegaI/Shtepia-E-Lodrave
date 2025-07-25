interface PriceOptions {
  amount: number;
  baseAmount?: number;
  currencyCode?: string;
}

interface PriceReturn {
  price: string;
  basePrice?: string;
  discount?: string;
}

export default function usePrice({
  amount,
  baseAmount,
  currencyCode = 'Lekë'
}: PriceOptions): PriceReturn {
  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} ${currencyCode}`;
  };

  const price = formatPrice(amount);
  const basePrice = baseAmount ? formatPrice(baseAmount) : undefined;
  
  let discount = undefined;
  if (baseAmount && baseAmount > amount) {
    const discountPercent = Math.round(((baseAmount - amount) / baseAmount) * 100);
    discount = `${discountPercent}% OFF`;
  }

  return {
    price,
    basePrice,
    discount
  };
}