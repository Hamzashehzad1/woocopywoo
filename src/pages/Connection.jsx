import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initializeWooCommerce, testConnection } from '../services/woocommerce';
import { Link2, CheckCircle, AlertCircle } from 'lucide-react';

const Connection = () => {
    const { connection, updateConnection } = useApp();
    const [formData, setFormData] = useState({
        siteUrl: connection.siteUrl,
        consumerKey: connection.consumerKey,
        consumerSecret: connection.consumerSecret
    });
    const [testing, setTesting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleConnect = async (e) => {
        e.preventDefault();
        setTesting(true);
        setError('');
        setSuccess('');

        try {
            // Validate inputs
            if (!formData.siteUrl || !formData.consumerKey || !formData.consumerSecret) {
                throw new Error('Please fill in all fields');
            }

            // Initialize WooCommerce API
            initializeWooCommerce(
                formData.siteUrl,
                formData.consumerKey,
                formData.consumerSecret
            );

            // Test connection
            await testConnection();

            // Update connection state
            updateConnection({
                ...formData,
                isConnected: true
            });

            setSuccess('Successfully connected to WooCommerce!');
        } catch (err) {
            setError(err.message || 'Failed to connect. Please check your credentials.');
            updateConnection({ isConnected: false });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="flex-between">
                        <div>
                            <h2 className="card-title">WooCommerce Connection</h2>
                            <p className="card-description">Connect your WooCommerce store to get started</p>
                        </div>
                        {connection.isConnected && (
                            <div className="badge badge-success flex gap-sm">
                                <CheckCircle size={16} />
                                Connected
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-content">
                    <form onSubmit={handleConnect}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="siteUrl">
                                WordPress Site URL
                            </label>
                            <input
                                type="url"
                                id="siteUrl"
                                name="siteUrl"
                                className="form-input"
                                placeholder="https://your-store.com"
                                value={formData.siteUrl}
                                onChange={handleChange}
                            />
                            <p className="form-hint">Your WordPress/WooCommerce store URL</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="consumerKey">
                                Consumer Key
                            </label>
                            <input
                                type="text"
                                id="consumerKey"
                                name="consumerKey"
                                className="form-input"
                                placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={formData.consumerKey}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="consumerSecret">
                                Consumer Secret
                            </label>
                            <input
                                type="password"
                                id="consumerSecret"
                                name="consumerSecret"
                                className="form-input"
                                placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={formData.consumerSecret}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger flex gap-sm">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success flex gap-sm">
                                <CheckCircle size={20} />
                                <span>{success}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={testing}
                        >
                            <Link2 size={20} />
                            {testing ? 'Testing Connection...' : 'Connect to WooCommerce'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">How to get API credentials:</h3>
                </div>
                <div className="card-content">
                    <ol style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Go to WooCommerce → Settings → Advanced → REST API</li>
                        <li style={{ marginBottom: '0.5rem' }}>Click "Add key" and enter a description</li>
                        <li style={{ marginBottom: '0.5rem' }}>Set permissions to "Read/Write"</li>
                        <li style={{ marginBottom: '0.5rem' }}>Click "Generate API key"</li>
                        <li style={{ marginBottom: '0.5rem' }}>Copy the Consumer Key and Consumer Secret</li>
                    </ol>
                </div>
            </div>


        </div>
    );
};

export default Connection;
