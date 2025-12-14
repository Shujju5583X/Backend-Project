import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

const Dashboard = () => {
    const { user } = useAuth();
    const { toasts, success, error: showError, ToastContainer } = useToast();

    // State
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
    });

    // Modals
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.search) params.search = filters.search;

            const [tasksRes, statsRes] = await Promise.all([
                tasksAPI.getAll(params),
                tasksAPI.getStats(),
            ]);

            setTasks(tasksRes.data.data.tasks);
            setStats(statsRes.data.data.stats);
        } catch (err) {
            showError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Create/Update task
    const handleTaskSubmit = async (data) => {
        setActionLoading(true);
        try {
            if (editingTask) {
                await tasksAPI.update(editingTask.id, data);
                success('Task updated successfully');
            } else {
                await tasksAPI.create(data);
                success('Task created successfully');
            }
            setTaskModalOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete task
    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        setActionLoading(true);
        try {
            await tasksAPI.delete(taskToDelete.id);
            success('Task deleted successfully');
            setDeleteModalOpen(false);
            setTaskToDelete(null);
            fetchTasks();
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to delete task');
        } finally {
            setActionLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (task) => {
        setEditingTask(task);
        setTaskModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        const classes = {
            PENDING: 'badge-pending',
            IN_PROGRESS: 'badge-in-progress',
            COMPLETED: 'badge-completed',
        };
        return classes[status] || '';
    };

    // Get priority badge class
    const getPriorityClass = (priority) => {
        const classes = {
            LOW: 'badge-low',
            MEDIUM: 'badge-medium',
            HIGH: 'badge-high',
        };
        return classes[priority] || '';
    };

    return (
        <>
            <Navbar />
            <ToastContainer />

            <main className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="text-muted">Welcome back, {user?.name}!</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingTask(null);
                            setTaskModalOpen(true);
                        }}
                    >
                        + New Task
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ '--stat-color': 'var(--color-primary)' }}>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                    <div className="stat-card" style={{ '--stat-color': 'var(--color-warning)' }}>
                        <div className="stat-value">{stats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card" style={{ '--stat-color': 'var(--color-info)' }}>
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                    <div className="stat-card" style={{ '--stat-color': 'var(--color-success)' }}>
                        <div className="stat-value">{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-lg">
                    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label className="form-label">Search</label>
                            <input
                                type="text"
                                name="search"
                                className="form-input"
                                placeholder="Search tasks..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div style={{ width: '150px' }}>
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <div style={{ width: '150px' }}>
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                className="form-select"
                                value={filters.priority}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setFilters({ status: '', priority: '', search: '' })}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📝</div>
                            <div className="empty-state-title">No tasks found</div>
                            <p>Create your first task to get started!</p>
                            <button
                                className="btn btn-primary mt-md"
                                onClick={() => {
                                    setEditingTask(null);
                                    setTaskModalOpen(true);
                                }}
                            >
                                + Create Task
                            </button>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Due Date</th>
                                    <th>Created</th>
                                    <th style={{ width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <div>
                                                <strong>{task.title}</strong>
                                                {task.description && (
                                                    <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                        {task.description.length > 50
                                                            ? `${task.description.substring(0, 50)}...`
                                                            : task.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusClass(task.status)}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getPriorityClass(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td>{formatDate(task.dueDate)}</td>
                                        <td>{formatDate(task.createdAt)}</td>
                                        <td>
                                            <div className="task-actions">
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => openEditModal(task)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => openDeleteModal(task)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Task Modal */}
            <TaskModal
                isOpen={taskModalOpen}
                onClose={() => {
                    setTaskModalOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleTaskSubmit}
                task={editingTask}
                loading={actionLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Task"
                message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
                loading={actionLoading}
            />
        </>
    );
};

export default Dashboard;
