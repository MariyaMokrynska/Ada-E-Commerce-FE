import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import type { User } from '../types.ts';

type AuthContextType = {
    user: User | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string): Promise<void> => {
        return axios.get(`http://127.0.0.1:5000/users/`, { params: { email } })
            .then(({ data }) => {
                const fetchedUser = data[0]; // Grab the first item in the array
                setUser({
                    id: String(fetchedUser.id),
                    email: fetchedUser.email,
                    isAdmin: fetchedUser.is_admin // Map snake_case to camelCase
                });
            });
    };
    
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};