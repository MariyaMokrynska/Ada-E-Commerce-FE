import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../Hooks/useCart';

const Cart = () => {
    const { userId, userEmail, items, subtotal, total, updateQuantity, removeItem, submitOrder } = useCart();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

    const handleSubmit = () => {
        setStatus('submitting');
        submitOrder()
            .then(() => setStatus('submitted'))
            .catch(() => setStatus('error'));
    };

    return (
        <div>
            <Navbar />
            <h1>Cart</h1>
            <p>User ID: {userId}</p>
            <p>Email: {userEmail}</p>

            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Line Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.productId}>
                                    <td>{item.name}</td>
                                    <td>${Number(item.price).toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => updateQuantity(item.name, -1)}>-</button>
                                        {item.quantity}
                                        <button onClick={() => updateQuantity(item.name, 1)}>+</button>
                                    </td>
                                    <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                    <td><button onClick={() => removeItem(item.name)}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p>Subtotal: ${Number(subtotal).toFixed(2)}</p>
                    <p>Tax (8.25%): ${Number(total - subtotal).toFixed(2)}</p>
                    <p>Total: ${Number(total).toFixed(2)}</p>

                    <button onClick={handleSubmit} disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Placing Order...' : 'Place Order'}
                    </button>
                    {status === 'submitted' && <p>Order placed successfully!</p>}
                    {status === 'error' && <p>Failed to place order. Please try again.</p>}
                </>
            )}
        </div>
    );
};

export default Cart;
