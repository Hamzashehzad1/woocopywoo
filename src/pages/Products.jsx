import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchProducts } from '../services/woocommerce';
import { ChevronLeft, ChevronRight, Package, RefreshCw, Eye, ExternalLink, CheckCircle } from 'lucide-react';

const Products = () => {
    const { products, setProducts, selectedProducts, toggleProductSelection, selectAllProducts, deselectAllProducts, recentlyUpdated } = useApp();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchProducts(page, 20);
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadProducts(currentPage);
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            deselectAllProducts();
        } else {
            selectAllProducts();
        }
    };

    const allSelected = products.length > 0 && selectedProducts.length === products.length;

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="flex-between">
                        <div>
                            <h2 className="card-title">Products</h2>
                            <p className="card-description">Select products to generate descriptions</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <RefreshCw size={20} className={loading ? 'spinner' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="card-content" style={{ padding: 0 }}>
                    {loading && products.length === 0 ? (
                        <div className="flex-center" style={{ padding: '3rem' }}>
                            <div className="spinner"></div>
                            <span style={{ marginLeft: '1rem' }}>Loading products...</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem' }}>
                            <Package size={48} style={{ color: 'var(--color-text-tertiary)' }} />
                            <p style={{ color: 'var(--color-text-secondary)' }}>No products found</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50px' }}>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={allSelected}
                                                    title={allSelected ? 'Deselect all' : 'Select all'}
                                                />
                                            </th>
                                            <th>PRODUCT</th>
                                            <th>CATEGORY</th>
                                            <th>PRICE</th>
                                            <th>STATUS</th>
                                            <th style={{ width: '100px' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => toggleProductSelection(product.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="flex gap-md" style={{ alignItems: 'center' }}>
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0].src}
                                                                alt={product.name}
                                                                className="product-image"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="product-image"
                                                                style={{
                                                                    background: 'var(--color-bg-tertiary)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <Package size={20} style={{ color: 'var(--color-text-tertiary)' }} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{product.name}</div>
                                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                                SKU: {product.sku}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {product.categories && product.categories.length > 0
                                                        ? product.categories[0].name
                                                        : 'Uncategorized'}
                                                </td>
                                                <td style={{ fontWeight: 500 }}>{product.price}</td>
                                                <td>
                                                    <span className={`badge badge-${product.status === 'publish' ? 'success' : 'warning'}`}>
                                                        {product.status === 'publish' ? 'Published' : product.status}
                                                    </span>
                                                    {recentlyUpdated.includes(product.id) && (
                                                        <span className="badge badge-success flex gap-xs" style={{ marginLeft: 'var(--spacing-xs)' }}>
                                                            <CheckCircle size={12} />
                                                            Updated
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-sm">
                                                        <button className="icon-btn" title="View product">
                                                            <Eye size={16} />
                                                        </button>
                                                        <a
                                                            href={product.permalink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="icon-btn"
                                                            title="Open in store"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <div>
                                    {products.length} products
                                    {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
                                </div>
                                <div>Page {currentPage} of {totalPages}</div>
                                <div className="flex gap-sm">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => loadProducts(currentPage - 1)}
                                        disabled={loading || currentPage <= 1}
                                        title="Previous Page"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => loadProducts(currentPage + 1)}
                                        disabled={loading || currentPage >= totalPages}
                                        title="Next Page"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
