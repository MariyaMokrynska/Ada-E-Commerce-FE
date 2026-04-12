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
    quantity: number;
    stock: number;
}

export type Order = {
    id: number;
    userId: number;
    products: Product[];
    total: number
}

export type CartContextType = {
    products: Product[];
    subtotal: number
    
}

export type AuthContextType = {
    user: User | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
}