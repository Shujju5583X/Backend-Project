import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <Navbar />
            <main style={{
                minHeight: 'calc(100vh - 70px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-xl)',
                background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 50%, var(--color-bg) 100%)'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                    {/* Hero Icon */}
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: 'var(--space-lg)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        📋
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        marginBottom: 'var(--space-md)',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Task Management
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'var(--font-size-lg)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-xl)',
                        lineHeight: 1.7
                    }}>
                        A powerful, scalable REST API with JWT authentication and role-based access control.
                        Organize your tasks, track progress, and boost productivity.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Features */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginTop: 'var(--space-2xl)',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🔐</div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-xs)' }}>Secure Auth</h3>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>JWT + bcrypt</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>👥</div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-xs)' }}>Role Based</h3>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>User & Admin</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📊</div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-xs)' }}>Task CRUD</h3>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Full Control</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📚</div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-xs)' }}>API Docs</h3>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Swagger UI</p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </>
    );
};

export default Home;
