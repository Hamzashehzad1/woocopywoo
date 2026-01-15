import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

let wooApi = null;

export const initializeWooCommerce = (siteUrl, consumerKey, consumerSecret) => {
    try {
        wooApi = new WooCommerceRestApi({
            url: siteUrl,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            version: 'wc/v3'
        });
        return true;
    } catch (error) {
        console.error('Failed to initialize WooCommerce API:', error);
        return false;
    }
};

export const testConnection = async () => {
    if (!wooApi) {
        throw new Error('WooCommerce API not initialized');
    }

    try {
        const response = await wooApi.get('products', { per_page: 1 });
        return response.status === 200;
    } catch (error) {
        console.error('Connection test failed:', error);
        throw error;
    }
};

export const fetchProducts = async (page = 1, perPage = 20) => {
    if (!wooApi) {
        // Return empty data if not connected
        return { products: [], totalPages: 1, total: 0 };
    }

    try {
        const response = await wooApi.get('products', {
            page,
            per_page: perPage,
            status: 'publish'
        });

        return {
            products: response.data.map(product => ({
                id: product.id,
                name: product.name,
                sku: product.sku || 'N/A',
                price: product.price,
                regularPrice: product.regular_price,
                salePrice: product.sale_price,
                categories: product.categories,
                attributes: product.attributes,
                images: product.images,
                status: product.status,
                permalink: product.permalink,
                description: product.description,
                shortDescription: product.short_description
            })),
            totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
            total: parseInt(response.headers['x-wp-total'] || '0')
        };
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
};

export const updateProductDescription = async (productId, longDescription, shortDescription) => {
    if (!wooApi) {
        // Simulate success for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    }

    try {
        const response = await wooApi.put(`products/${productId}`, {
            description: longDescription,
            short_description: shortDescription
        });

        return {
            success: response.status === 200,
            product: response.data
        };
    } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
    }
};

export const batchUpdateProducts = async (updates, onProgress) => {
    const results = [];

    for (let i = 0; i < updates.length; i++) {
        const { productId, longDescription, shortDescription } = updates[i];

        try {
            const result = await updateProductDescription(productId, longDescription, shortDescription);
            results.push({ productId, success: true, result });
        } catch (error) {
            results.push({ productId, success: false, error: error.message });
        }

        if (onProgress) {
            onProgress({
                current: i + 1,
                total: updates.length
            });
        }
    }

    return results;
};

// Sample data removed as requested
