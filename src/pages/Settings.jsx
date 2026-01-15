import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Trash2, AlertTriangle } from 'lucide-react';

const Settings = () => {
    const { clearAllData } = useApp();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClearData = () => {
        clearAllData();
        setShowConfirm(false);
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Settings</h2>
                    <p className="card-description">Manage your application settings</p>
                </div>

                <div className="card-content">
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
                            <SettingsIcon size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            About WooCopy
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                            WooCopy is an AI-powered product description generator designed specifically for WooCommerce stores.
                            It helps manufacturers, wholesalers, and retailers create comprehensive, SEO-optimized product
                            descriptions that drive conversions and improve search rankings.
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: 'var(--spacing-md)' }}>
                            Our advanced AI generates long-form descriptions (800-1200 words) with structured sections including
                            product overviews, technical specifications, use cases, FAQs, and more. Each description is tailored
                            to your business type and target audience for maximum relevance and impact.
                        </p>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
                            Features
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                            <li>Connect to any WooCommerce store via REST API</li>
                            <li>Customize business context for personalized descriptions</li>
                            <li>Bulk product description generation</li>
                            <li>800-1200 word comprehensive descriptions</li>
                            <li>SEO-optimized content with structured sections</li>
                            <li>Automatic push to WooCommerce</li>
                            <li>Multiple writing tones (Professional, Technical, Sales-Focused, Neutral)</li>
                            <li>Support for manufacturers, wholesalers, and retailers</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title" style={{ color: 'var(--color-danger)' }}>
                        <AlertTriangle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Danger Zone
                    </h3>
                    <p className="card-description">Irreversible actions that affect your data</p>
                </div>

                <div className="card-content">
                    <div
                        style={{
                            padding: 'var(--spacing-lg)',
                            border: '2px solid var(--color-danger)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-danger-light)'
                        }}
                    >
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-danger)' }}>
                            Clear All Data
                        </h4>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                            This will permanently delete all stored data including connection credentials, business context,
                            and generated descriptions. This action cannot be undone.
                        </p>

                        {!showConfirm ? (
                            <button
                                className="btn btn-danger"
                                onClick={() => setShowConfirm(true)}
                            >
                                <Trash2 size={20} />
                                Clear All Data
                            </button>
                        ) : (
                            <div>
                                <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)', color: 'var(--color-danger)' }}>
                                    Are you absolutely sure? This action cannot be undone.
                                </p>
                                <div className="flex gap-md">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleClearData}
                                    >
                                        Yes, Delete Everything
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    WooCopy v1.0.0 • Built with React & WooCommerce REST API
                </p>
            </div>
        </div>
    );
};

export default Settings;
