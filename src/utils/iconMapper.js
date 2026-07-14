// Icon mapper for products based on category
import customersLogo from '../icons/customers.png';
import productsLogo from '../icons/products.png';
import purchasesLogo from '../icons/purchases.png';
import suppliersLogo from '../icons/supplier.png';
import expenseLogo from '../icons/expense.png';
import stockLogo from '../icons/stock.png';
import salesLogo from '../icons/sales.png';

const categoryIconMap = {
  'Electronics': productsLogo,
  'Accessories': productsLogo,
  'Hardware': productsLogo,
  'Software': productsLogo,
  'Supplies': productsLogo,
  'Furniture': productsLogo,
  'default': productsLogo,
};

const getProductIcon = (category) => {
  return categoryIconMap[category] || categoryIconMap['default'];
};

export { getProductIcon, categoryIconMap };
