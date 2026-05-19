import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../Hooks/useAuth';
import { CartContext } from '../Hooks/useCart';
import type { AuthContextType, CartContextType } from '../types';

const mockAuthAdmin: AuthContextType = {
    user: { id: '1', firstName: 'Adrian', lastName: 'Prado', email: 'a@a.com', isAdmin: true },
    login: vi.fn(),
    logout: vi.fn(),
};

const mockAuthUser: AuthContextType = {
    user: { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'j@j.com', isAdmin: false },
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

const mockProduct = {
    id: 'p1',
    name: 'Widget',
    price: 9.99,
    stock: 50,
    imageUrl: '',
    deleteProduct: vi.fn(),
    updateProduct: vi.fn(),
};

const renderCard = (authValue: AuthContextType) =>
    render(
        <MemoryRouter>
            <AuthContext.Provider value={authValue}>
                <CartContext.Provider value={mockCart}>
                    <ProductCard {...mockProduct} />
                </CartContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    );

describe('ProductCard', () => {
    it('renders the product name', () => {
        renderCard(mockAuthUser);
        expect(screen.getByText('Widget')).toBeInTheDocument();
    });

    it('renders the formatted price', () => {
        renderCard(mockAuthUser);
        expect(screen.getByText(/Price: \$9\.99/)).toBeInTheDocument();
    });

    it('shows Add to Cart button for non-admin users', () => {
        renderCard(mockAuthUser);
        expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
    });

    it('shows admin buttons for admin users', () => {
        renderCard(mockAuthAdmin);
        expect(screen.getByRole('button', { name: 'Update Stock' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete Item' })).toBeInTheDocument();
    });

    it('does not show Add to Cart for admin users', () => {
        renderCard(mockAuthAdmin);
        expect(screen.queryByRole('button', { name: 'Add to Cart' })).not.toBeInTheDocument();
    });

    it('calls addItem with correct data when Add to Cart is clicked', async () => {
        renderCard(mockAuthUser);
        await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
        expect(mockCart.addItem).toHaveBeenCalledWith({
            productId: 'p1',
            name: 'Widget',
            price: 9.99,
            quantity: 0,
        });
    });

    it('calls deleteProduct with the product id when Delete Item is clicked', async () => {
        renderCard(mockAuthAdmin);
        await userEvent.click(screen.getByRole('button', { name: 'Delete Item' }));
        expect(mockProduct.deleteProduct).toHaveBeenCalledWith('p1');
    });
});
