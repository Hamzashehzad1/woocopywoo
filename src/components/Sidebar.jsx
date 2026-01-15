import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Link as LinkIcon, FileText, Package, Sparkles, Settings as SettingsIcon } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { connection } = useApp();

    const navItems = [
        { path: '/connection', label: 'Connection', icon: LinkIcon },
        { path: '/business-context', label: 'Business Context', icon: FileText },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/generate', label: 'Generate', icon: Sparkles },
        { path: '/settings', label: 'Settings', icon: SettingsIcon }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L7.5 5L10 7.5L7.5 10L5 7.5Z" fill="currentColor" />
                            <path d="M10 7.5L12.5 5L15 7.5L12.5 10L10 7.5Z" fill="currentColor" opacity="0.7" />
                            <path d="M7.5 11.25L10 8.75L12.5 11.25L10 13.75L7.5 11.25Z" fill="currentColor" opacity="0.5" />
                        </svg>
                    </div>
                    <div className="sidebar-logo-text">
                        <h1>WooCopy</h1>
                        <p>AI Product Writer</p>
                    </div>
                </Link>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-nav-list">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path} className="sidebar-nav-item">
                                <Link
                                    to={item.path}
                                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <Icon className="sidebar-nav-icon" size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="connection-status">
                    <span className={`connection-status-dot ${connection.isConnected ? 'connected' : ''}`}></span>
                    <span>{connection.isConnected ? 'Connected to WooCommerce' : 'Not connected'}</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
