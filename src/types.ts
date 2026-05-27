export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
}

export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export type NewProduct = {
    name: string;
    price: number;
    stock: number;
    s3_key: string;
}

export type Order = {
    id: number;
    userId: number;
    products: CartItem[];
}

export type CartItem = {
    productId: string,
    name: string;
    price: number;
    quantity: number;
}

export type CartContextType = {
    items: CartItem[];
    subtotal: number;
    total: number;
    addItem: (item: CartItem) => void;
    updateQuantity: (name: string, delta: number) => void;
    removeItem: (name: string) => void;
    submitOrder: (user: User) => Promise<void>;
    clearCart: () => void;
}

export type AuthContextType = {
    user: User | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

export type APIProduct = {
    product_key: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    image_url: string
}
export type APIOrder = {
    id: number,
    user_id: number,
    items: APIOrderItem[],
}
export type APIOrderItem = {
    product_id: string,
    product_name: string,
    product_price: number,
    quantity: number
}