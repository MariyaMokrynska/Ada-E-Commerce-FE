import OrderCard from '../components/OrderCard'
import type { Order } from '../types'

type OrderListProps = {
    orders: Order[];
}

const OrderList = ({ orders }: OrderListProps) => {

    const orderCards = orders.map((order: Order) => {
        return (
            <li key={order.id}>
            <OrderCard
                id={order.id}
                userId={order.userId}
                products={order.products}
            />
            </li>
        );
    });
    return (
        <>
            <ul className="order-list">
                {orderCards}
            </ul>
        </>
    );
};

export default OrderList
