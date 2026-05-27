import '../css/Home.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Product, APIProduct, NewProduct } from '../types';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../Hooks/useAuth';


const productUrl = import.meta.env.VITE_PRODUCT_URL;

const addStock = (product: Product, newStock: number) => {
    return { ...product, stock: newStock};
};

const getAllProductsAPI = () => {
    return axios.get(`${productUrl}/products/`)
        .then(response => response.data)
};
const updateProductAPI = (id: string, updateData: Partial<Product>) => {
    return axios.patch(`${productUrl}/products/${id}`, updateData)
}
const deleteProductAPI = (id : string) => {
    return axios.delete(`${productUrl}/products/${id}`)
};
const convertFromAPI = (apiProduct: APIProduct): Product => {
    return {
        ...apiProduct,
        id: apiProduct.product_key,
        imageUrl: apiProduct.image_url,
    };

};
const addProductAPI = (newProduct: NewProduct) => {
    return axios.post(`${productUrl}/products/`, newProduct)
        .then(response => response.data)
};

const Home = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllProductsAPI()
            .then(products => {
                const newProducts = products.map(convertFromAPI);
                setProducts(newProducts);
            })
            .catch(() => setError('Failed to load products'));
    }, []);

    const deleteProduct = (id: string) => {
        return deleteProductAPI(id)
            .then(() => {
                return setProducts(products => {
                    return products.filter(product => product.id !== id);
                });
            })
            .catch(() => setError('Failed to delete product'));
    }
    const addProduct = (data: NewProduct, file: File) => {
        return addProductAPI(data)
            .then((result) => {
                const tempImageUrl = URL.createObjectURL(file);
                return setProducts((prevProducts) => [convertFromAPI({...result, image_url:tempImageUrl}), ...prevProducts]);
            })
            .catch(() => setError('Failed to add product'));
    }
    const updateProduct = (id: string, data: Partial<Product>) => {
        return updateProductAPI(id, data)
            .then(() => {
                return setProducts(productData => {
                    return productData.map(product => product.id === id && data.stock !== undefined ? addStock(product, data.stock) : product);
            });
        })
        .catch(() => setError('Failed to update product'));
    }

    return (
        <div>
            <h1 className="product-list__title">Products</h1>
            {error && <p>{error}</p>}
            {products.length === 0
                ? <p>No products available.</p>
                :<ProductList products = {products} removeProduct = {deleteProduct} updateProduct = {updateProduct}/>
            }
            {user?.isAdmin && <ProductForm addProduct = {addProduct}/>}

        </div>
    );
};

export default Home;