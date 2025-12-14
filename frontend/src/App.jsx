import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Fallback */}
                    <Route
                        path="*"
                        element={
                            <div className="auth-container">
                                <div className="auth-card" style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🔍</div>
                                    <h1 style={{ marginBottom: 'var(--space-sm)' }}>404</h1>
                                    <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                                        Page not found
                                    </p>
                                    <a href="/" className="btn btn-primary">Go Home</a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
