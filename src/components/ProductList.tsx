import '../css/ProductList.css'
import ProductCard from './ProductCard';
import type { Product } from '../types';

type ProductListProps = {
    products: Product[];
    removeProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, data: object) => Promise<void>;
}

const ProductList = ({ products, removeProduct, updateProduct }: ProductListProps) => {
  const productCards = products.map((product: Product) => {
    return (
      <li key={product.id}>
        <ProductCard
          id={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
          imageUrl={product.imageUrl}
          deleteProduct={removeProduct}
          updateProduct={updateProduct}
        />
      </li>
    );
  });

  return (
    <>
      <ul className="product-list">
        {productCards}
      </ul>
    </>
  );
};

export default ProductList;