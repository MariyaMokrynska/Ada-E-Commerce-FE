import '../css/ProductForm.css';
import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import axios from 'axios';
import type { NewProduct } from '../types';

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

const formDefault = {
    name: '',
    price: 0,
    stock: 0,
    file: null as File | null,
};

type ProductFormProps = {
    addProduct: (data: NewProduct, file: File) => Promise<void>;
}

const ProductForm = ({addProduct}: ProductFormProps) => {
    const [formState, setFormState] = useState(formDefault);
    const [status, setStatus] = useState('idle')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const inputName = event.target.name;

        setFormState(prev => ({...prev, 
            [inputName]: inputName ==='price'|| inputName === 'stock'? Number(inputValue) : inputValue}));
        
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setFormState(prev => ({ ...prev, file }));
    };

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formState.file) return;

        axios.get(`${LAMBDA_URL}?key=${formState.file.name}`)
        .then(response => {
            const UPLOAD_URL = response.data.presigned_url;
            axios.put(UPLOAD_URL, formState.file, {
                headers: { 'Content-Type': 'image/jpeg' }
            })
            .then(() => setStatus('success'))
        })
        .catch(() => {
            setStatus('error')
        })

        addProduct({
            name: formState.name,
            price: formState.price,
            stock: formState.stock,
            s3_key: formState.file.name,
        }, formState.file);

        setFormState(formDefault);
    };

    const makeControlledInput = (inputName, type) => {
        return (
            <input
            type={type}
            name={inputName}
            id={`input-${inputName}`}
            value={formState[inputName]}
            onChange={handleChange}
            />
        );
    };

return (
        <div className="products">
            <h1 className="products__title">Add Product</h1>
            <form onSubmit={handleSubmit} className="products__form">
                <label htmlFor="name">Product Name</label>
                { makeControlledInput('name', "text") }
                <label htmlFor="price">Price</label>
                { makeControlledInput('price', "number") }
                <label htmlFor="stock">Stock</label>
                { makeControlledInput('stock', "number") }
                <label htmlFor="image">Image</label>
                <input type="file" name="file" accept="image/*" onChange={handleFileChange} />
                <input type="submit" value="Add Product" />
            </form>
            {status}
        </div>
    );
};

export default ProductForm;