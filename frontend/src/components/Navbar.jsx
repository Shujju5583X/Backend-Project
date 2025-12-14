import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <span>📋</span>
                    TaskManager
                </Link>

                <div className="navbar-nav">
                    {isAuthenticated ? (
                        <div className="navbar-user">
                            <div className="navbar-user-info">
                                <div className="navbar-user-name">{user?.name}</div>
                                <div className="navbar-user-role">{user?.role}</div>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-sm">
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
