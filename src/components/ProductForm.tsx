import '../css/ProductForm.css';
import { useState } from 'react';
import type { Product } from '../types'

const formDefault = {
    name: '',
    price: 0,
    stock: 0
}
type ProductFormProps = {
    addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
}

const ProductForm = ({addProduct}: ProductFormProps) => {
    const [formState, setFormState] = useState(formDefault);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const inputName = event.target.name;

        setFormState(prev => ({...prev, 
            [inputName]: inputValue ==='price'|| inputValue === 'stock'? Number(inputValue) : inputValue}));
        
    };
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        addProduct(formState);
        setFormState(formDefault);
    };

return (
        <div className="products">
            <h1 className="products__title">Add Product</h1>
            <form onSubmit={handleSubmit} className="products__form">
                <label htmlFor="name">Product Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={formState.name}
                    onChange={handleChange}
                />
                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formState.price}
                    onChange={handleChange}
                />
                <label htmlFor="stock">Stock</label>
                <input
                    id="stock"
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formState.stock}
                    onChange={handleChange}
                />
                <input type="submit" value="Add Product" />
            </form>
        </div>
    );
};

export default ProductForm;