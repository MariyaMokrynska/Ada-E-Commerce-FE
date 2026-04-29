import '../css/ProductCard.css'
import type { Product } from '../types'
import { useAuth } from '../Hooks/useAuth'
import { useCart } from '../Hooks/useCart'
import { useState } from 'react'

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export type ProductCardProps = Product & {
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
}


const ProductCard = ({
    id, 
    name,
    price,
    stock,
    imageUrl,
    deleteProduct,
    updateProduct
}: ProductCardProps) => {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [numItem, setNumItem] = useState(user?.isAdmin? stock: 0);
    const [success, setSuccess] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumItem(Number(event.target.value));
    };

    const handleUpdateItem = () => {
        updateProduct(id, {"stock":numItem})
        .then(() => setSuccess('Item Updated'))
        .catch(() => setSuccess('Item not updated'))

    }

    const handleDeleteItem = () => {
        deleteProduct(id)
        .then(() => setSuccess('Item Deleted'))
        .catch(() => setSuccess('Item not deleted'))
    }

    const handleAddItem = () => {
        addItem({ productId: id, name, price, quantity: numItem })
        setSuccess('Item added to cart')
    }

    return (
        <div className="product-card">
            <div className="product-card__image-placeholder">
                {
                    imageUrl === ''? 
                    "No Image" :
                    <img src={imageUrl} />
                }
            </div>
            <h2 className="product-card__name">{name}</h2>
            <div className="product-card__meta">
                <span>Price: ${formatter.format(price)}</span>
                <form>
                    <label htmlFor="quantity">{user?.isAdmin ? "Stock" : "Quantity" }</label>
                        <input
                            id="quantity"
                            type="number"
                            name={user?.isAdmin ? "stock" : "quantity" }
                            value={numItem? numItem : 0}
                            onChange={handleChange}
                        />
                </form>  
            </div>
            <ul className="product-card__actions">
                {user?.isAdmin ? (
                    <>
                        <li><button onClick={handleUpdateItem}>Update Stock</button></li>
                        <li><button onClick={handleDeleteItem}>Delete Item</button></li>
                    </>
                ) : (
                    <li><button onClick={handleAddItem}>Add to Cart</button></li>
                )}
            </ul>
            {success}
        </div>
    )
}

export default ProductCard;