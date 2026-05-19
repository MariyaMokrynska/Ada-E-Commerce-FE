import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../Hooks/useAuth';

const userUrl = import.meta.env.VITE_USER_URL;

const CreateUserForm = () => {

    const { user } = useAuth();

    const [formData, setFormData] = useState({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        isAdmin: user?.isAdmin ?? false,
    });

    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        setStatus('saving');

        if(user === null){
            axios.post(`${userUrl}/users/`, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                is_admin: formData.isAdmin,
            })
            .then(() => setStatus('saved'))
            .catch(() => setStatus('error'));
        }
        else {
            axios.put(`${userUrl}/users/${user?.id}`, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                is_admin: formData.isAdmin,
            })
            .then(() => setStatus('saved'))
            .catch(() => setStatus('error'));
        }
        setFormData({
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
            isAdmin: user?.isAdmin ?? false,
        });
        
    };

    const makeControlledInput = (inputName: Exclude<keyof typeof formData, 'isAdmin'>) => {
        return (
            <input
            type={'text'}
            name={inputName}
            id={`input-${inputName}`}
            value={formData[inputName]}
            onChange={handleChange}
            />
        );
    };

    return (
        <div>
            <h1> Add User </h1>
        
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                { makeControlledInput('firstName') }
                <label htmlFor="lastName">Last Name</label>
                { makeControlledInput('lastName') }
                <label htmlFor="email">Email</label>
                { makeControlledInput('email') }

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                        />
                        Admin
                    </label>
                </div>
                {
                    user? 
                    <button type="submit">
                        Update User
                    </button>
                    :
                    <button type="submit">
                        Add User
                    </button>
                }

                {status === 'saved' && <p>Changes saved.</p>}
                {status === 'error' && <p>Failed to save changes.</p>}
            </form>
        </div>
    );
};

export default CreateUserForm;