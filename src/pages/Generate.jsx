import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateBatchDescriptions } from '../services/aiGenerator';
import { batchUpdateProducts } from '../services/woocommerce';
import { Sparkles, AlertCircle, CheckCircle, Play, RefreshCw } from 'lucide-react';

const Generate = () => {
    const {
        products,
        selectedProducts,
        businessContext,
        autoPush,
        setAutoPush,
        generatedDescriptions,
        setGeneratedDescriptions,
        markAsUpdated
    } = useApp();

    const [generating, setGenerating] = useState(false);
    const [pushing, setPushing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    const hasBusinessContext = businessContext.companyName && businessContext.description;

    const handlePush = async () => {
        if (!generatedDescriptions || Object.keys(generatedDescriptions).length === 0) {
            setError('No descriptions to push');
            return;
        }

        setPushing(true);
        setError('');

        try {
            const updates = Object.entries(generatedDescriptions).map(([productId, desc]) => ({
                productId: parseInt(productId),
                longDescription: desc.longDescription,
                shortDescription: desc.shortDescription
            }));

            await batchUpdateProducts(updates, (prog) => {
                setProgress({
                    current: prog.current,
                    total: prog.total,
                    product: 'Pushing to WooCommerce...'
                });
            });

            updates.forEach(update => {
                markAsUpdated(update.productId);
            });

            setResults(prev => ({
                ...prev,
                pushed: true
            }));
        } catch (err) {
            setError(err.message || 'Failed to push descriptions');
        } finally {
            setPushing(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    const handleGenerate = async () => {
        if (!hasBusinessContext) {
            setError('Please complete your business context before generating descriptions');
            return;
        }

        if (selectedProducts.length === 0) {
            setError('Please select at least one product from the Products page');
            return;
        }

        setGenerating(true);
        setError('');
        setResults(null);

        try {
            // Generate descriptions
            const descriptions = await generateBatchDescriptions(
                selectedProductsData,
                businessContext,
                (prog) => setProgress(prog)
            );

            setGeneratedDescriptions(descriptions);

            // Auto-push if enabled
            if (autoPush) {
                const updates = Object.entries(descriptions).map(([productId, desc]) => ({
                    productId: parseInt(productId),
                    longDescription: desc.longDescription,
                    shortDescription: desc.shortDescription
                }));

                await batchUpdateProducts(updates, (prog) => {
                    setProgress({
                        current: prog.current,
                        total: prog.total,
                        product: 'Updating products...'
                    });
                });

                updates.forEach(update => {
                    markAsUpdated(update.productId);
                });
            }

            setResults({
                success: true,
                count: Object.keys(descriptions).length,
                pushed: autoPush
            });
        } catch (err) {
            setError(err.message || 'Failed to generate descriptions');
        } finally {
            setGenerating(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Generate Descriptions</h2>
                    <p className="card-description">
                        AI-powered product descriptions for your WooCommerce store
                    </p>
                </div>

                <div className="card-content">
                    {!hasBusinessContext && (
                        <div className="alert alert-danger flex gap-sm">
                            <AlertCircle size={20} />
                            <div>
                                <strong>Business context required</strong>
                                <p style={{ margin: 0, marginTop: '0.25rem' }}>
                                    Please complete your business information in the Business Context page before generating descriptions.
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedProducts.length === 0 ? (
                        <div className="alert alert-info flex gap-sm">
                            <AlertCircle size={20} />
                            <div>
                                <strong>No products selected</strong>
                                <p style={{ margin: 0, marginTop: '0.25rem' }}>
                                    Go to the Products page and select products to generate descriptions for.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info flex gap-sm">
                            <Sparkles size={20} />
                            <div>
                                <strong>{selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected</strong>
                                <p style={{ margin: 0, marginTop: '0.25rem' }}>
                                    Ready to generate comprehensive, SEO-optimized descriptions
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="autoPush"
                                className="checkbox"
                                checked={autoPush}
                                onChange={(e) => setAutoPush(e.target.checked)}
                            />
                            <label htmlFor="autoPush" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Automatically push descriptions to WooCommerce after generation
                            </label>
                        </div>
                    </div>

                    {generating && (
                        <div className="alert alert-info">
                            <div className="flex gap-sm" style={{ alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div className="spinner"></div>
                                <strong>Generating descriptions...</strong>
                            </div>
                            <p style={{ margin: 0 }}>
                                Processing {progress.current} of {progress.total}
                                {progress.product && `: ${progress.product}`}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger flex gap-sm">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {results && (
                        <div className="alert alert-success flex gap-sm">
                            <CheckCircle size={20} />
                            <div>
                                <strong>Success!</strong>
                                <p style={{ margin: 0, marginTop: '0.25rem' }}>
                                    Generated descriptions for {results.count} product{results.count !== 1 ? 's' : ''}.
                                    {results.pushed && ' Descriptions have been pushed to WooCommerce.'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-md" style={{ width: '100%' }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleGenerate}
                            disabled={generating || !hasBusinessContext || selectedProducts.length === 0}
                            style={{ flex: 1 }}
                        >
                            <Play size={20} />
                            {generating ? 'Generating...' : 'Generate Descriptions'}
                        </button>

                        {Object.keys(generatedDescriptions).length > 0 && !generating && (
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={handlePush}
                                disabled={pushing}
                                style={{ flex: 1 }}
                            >
                                <RefreshCw size={20} className={pushing ? 'spinner' : ''} />
                                {pushing ? 'Pushing...' : 'Push to WooCommerce'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {Object.keys(generatedDescriptions).length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Generated Descriptions Preview</h3>
                        <p className="card-description">
                            Review the AI-generated content below
                        </p>
                    </div>

                    <div className="card-content">
                        {selectedProductsData.slice(0, 2).map((product) => {
                            const desc = generatedDescriptions[product.id];
                            if (!desc) return null;

                            return (
                                <div
                                    key={product.id}
                                    style={{
                                        marginBottom: 'var(--spacing-xl)',
                                        padding: 'var(--spacing-lg)',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-lg)'
                                    }}
                                >
                                    <h4 style={{ marginBottom: 'var(--spacing-md)' }}>{product.name}</h4>

                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            Short Description:
                                        </strong>
                                        <div
                                            style={{
                                                marginTop: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-md)',
                                                background: 'var(--color-bg-secondary)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: desc.shortDescription }}
                                        />
                                    </div>

                                    <div>
                                        <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            Long Description ({desc.wordCount} words):
                                        </strong>
                                        <div
                                            style={{
                                                marginTop: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-md)',
                                                background: 'var(--color-bg-secondary)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--font-size-sm)',
                                                maxHeight: '300px',
                                                overflow: 'auto'
                                            }}
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: desc.longDescription }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {selectedProductsData.length > 2 && (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                Showing 2 of {selectedProductsData.length} generated descriptions
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Generate;
