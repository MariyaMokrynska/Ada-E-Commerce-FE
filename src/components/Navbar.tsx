import '../css/Navbar.css'
import { useAuth } from '../Hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <span className="navbar__brand">ADA E-Commerce</span>
            <span className="navbar__welcome">Welcome, {user?.firstName}!</span>
            <div className="navbar__links">
                <Link to="/home">Home</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/account">Account</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;