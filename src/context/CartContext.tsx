import { useState, useMemo } from 'react';
import axios from 'axios';
import type { CartItem } from '../types';
import { CartContext } from '../Hooks/useCart';
import { useAuth } from '../Hooks/useAuth';

const TAX_RATE = 0.0825;
const orderUrl = import.meta.env.VITE_ORDER_URL;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const total = useMemo(() => subtotal * (1 + TAX_RATE), [subtotal]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                return prev.map(i =>
                    i.name === item.name
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const updateQuantity = (name: string, delta: number) => {
        setItems(prev => prev
            .map(i => i.name === name ? { ...i, quantity: i.quantity + delta } : i)
            .filter(i => i.quantity > 0)
        );
    };

    const removeItem = (name: string) => {
        setItems(prev => prev.filter(i => i.name !== name));
    };

    const submitOrder = async (): Promise<void> => {
        return axios.post(`${orderUrl}/orders/`, {
            user_id: user?.id,
            items: items.map(({ productId, name, price, quantity }) => ({
                product_id: productId,
                product_name: name,
                product_price: price,
                quantity,
            })),
        })
        .then(() => setItems([]))        
    };

    return (
        <CartContext.Provider value={{
            userId: user?.id ?? '',
            userEmail: user?.email ?? '',
            items,
            subtotal,
            total,
            addItem,
            updateQuantity,
            removeItem,
            submitOrder,
        }}>
            {children}
        </CartContext.Provider>
    );
};
