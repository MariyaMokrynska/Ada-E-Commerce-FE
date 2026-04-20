import '../css/ProductCard.css'
import type { ProductCardProps } from '../types'
import { useAuth } from '../Hooks/useAuth'
import { useCart } from '../Hooks/useCart'
import { useState } from 'react'

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});



const ProductCard = ({
    id, 
    name,
    price,
    stock,
    deleteProduct,
    updateProduct
}: ProductCardProps) => {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [numItem, setNumItem] = useState(user?.isAdmin? stock: 0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumItem(Number(event.target.value));
    };

    return (
        <div className="product-card">
            <div className="product-card__image-placeholder">No image</div>
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
                        <li><button onClick={()=>updateProduct(id, {"stock":numItem})}>Update Stock</button></li>
                        <li><button onClick={()=>deleteProduct(id)}>Delete Item</button></li>
                    </>
                ) : (
                    <li><button onClick={() => addItem({ productId: id, name, price, quantity: numItem })}>Add to Cart</button></li>
                )}
            </ul>
        </div>
    )
}

export default ProductCard;