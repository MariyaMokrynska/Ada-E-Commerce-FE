import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import type{ Order, APIOrder, CartItem } from '../types';
import { useAuth } from '../Hooks/useAuth';
import OrderList from '../components/OrderList'

const orderUrl = import.meta.env.VITE_ORDER_URL;

const getAllOrdersAPI = (data: object) => {
    return axios.get(`${orderUrl}/orders/`, {params: data})
        .then(response => response.data)
};
const convertFromAPI = (order: APIOrder): Order => {
    return {
        ...order,
        userId: order.user_id,
        products: order.items.map((item): CartItem => {
            return {
                ...item,
                productId: item.product_id,
                name: item.product_name,
                price: item.product_price,
            }
        })
    };

};

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = user?.isAdmin ? {} : { user_id: user?.id };
        getAllOrdersAPI(params)
            .then(orders => {
                const newOrders = orders.map(convertFromAPI);
                setOrders(newOrders);
            })
            .catch(() => setError('Failed to load products'));
    }, [user]);

    return (
        <div>
            <Navbar />
            <h1>{user?.isAdmin ? 'All Orders' : 'My Orders'}</h1>
            {error && <p>{error}</p>}
            <OrderList orders={orders} />
        </div>
    );
};

export default Orders;