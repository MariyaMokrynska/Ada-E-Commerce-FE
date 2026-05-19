import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Home from '../pages/Home';
import { AuthContext } from '../Hooks/useAuth';
import { CartContext } from '../Hooks/useCart';
import type { AuthContextType, CartContextType } from '../types';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const mockAuthUser: AuthContextType = {
    user: { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@lovelace.com', isAdmin: false },
    login: vi.fn(),
    logout: vi.fn(),
};

const mockAuthAdmin: AuthContextType = {
    user: { id: '2', firstName: 'Alan', lastName: 'Turing', email: 'alan@turing.com', isAdmin: true },
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

const mockApiProducts = [
    { productId: 'p1', name: 'Widget', price: 9.99, stock: 10, quantity: 0 },
    { productId: 'p2', name: 'Gadget', price: 24.99, stock: 5, quantity: 0 },
];

const renderHome = (authValue: AuthContextType) =>
    render(
        <MemoryRouter>
            <AuthContext.Provider value={authValue}>
                <CartContext.Provider value={mockCart}>
                    <Home />
                </CartContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    );

describe('Home', () => {
    it('renders products after a successful fetch', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockApiProducts });
        renderHome(mockAuthUser);
        await waitFor(() => {
            expect(screen.getByText('Widget')).toBeInTheDocument();
            expect(screen.getByText('Gadget')).toBeInTheDocument();
        });
    });

    it('shows "No products available" before fetch resolves', () => {
        mockedAxios.get.mockReturnValueOnce(new Promise(() => {}));
        renderHome(mockAuthUser);
        expect(screen.getByText('No products available.')).toBeInTheDocument();
    });

    it('shows an error message when the fetch fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
        renderHome(mockAuthUser);
        await waitFor(() => {
            expect(screen.getByText('Failed to load products')).toBeInTheDocument();
        });
    });

    it('shows the ProductForm for admin users', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockApiProducts });
        renderHome(mockAuthAdmin);
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Add Product' })).toBeInTheDocument();
        });
    });

    it('hides the ProductForm for non-admin users', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockApiProducts });
        renderHome(mockAuthUser);
        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Add Product' })).not.toBeInTheDocument();
        });
    });
});
