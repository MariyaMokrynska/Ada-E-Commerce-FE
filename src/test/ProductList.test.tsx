import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { AuthContext } from '../Hooks/useAuth';
import { CartContext } from '../Hooks/useCart';
import type { AuthContextType, CartContextType } from '../types';

const mockAuth: AuthContextType = {
    user: { id: '1', firstName: 'Adrian', lastName: 'Prado', email: 'a@a.com', isAdmin: false },
    login: vi.fn(),
    logout: vi.fn(),
};

const mockCart: CartContextType = {
    items: [],
    subtotal: 0,
    total: 0,
    addItem: vi.fn(),
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    submitOrder: vi.fn(),
    clearCart: vi.fn()
};

const mockProducts = [
    { id: 'p1', name: 'Widget', price: 9.99, stock: 10, imageUrl: '' },
    { id: 'p2', name: 'Gadget', price: 24.99, stock: 5, imageUrl: '' },
    { id: 'p3', name: 'Doohickey', price: 4.99, stock: 20, imageUrl: '' }
];

const removeProduct = vi.fn();
const updateProduct = vi.fn();

const renderList = (products = mockProducts) =>
    render(
        <MemoryRouter>
            <AuthContext.Provider value={mockAuth}>
                <CartContext.Provider value={mockCart}>
                    <ProductList
                        products={products}
                        removeProduct={removeProduct}
                        updateProduct={updateProduct}
                    />
                </CartContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    );

describe('ProductList', () => {
    it('renders a card for each product', () => {
        renderList();
        expect(screen.getByText('Widget')).toBeInTheDocument();
        expect(screen.getByText('Gadget')).toBeInTheDocument();
        expect(screen.getByText('Doohickey')).toBeInTheDocument();
    });

    it('renders nothing when the products array is empty', () => {
        renderList([]);
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('renders the correct number of Add to Cart buttons', () => {
        renderList();
        expect(screen.getAllByRole('button', { name: 'Add to Cart' })).toHaveLength(3);
    });
});
