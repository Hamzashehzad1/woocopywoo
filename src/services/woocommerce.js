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
        // Return sample data for demo purposes
        return getSampleProducts();
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

// Sample data for demo purposes
const getSampleProducts = () => {
    return {
        products: [
            {
                id: 1,
                name: 'Hyalgan',
                sku: 'HYA-001',
                price: '$49.00',
                regularPrice: '$49.00',
                categories: [{ id: 1, name: 'Orthopaedic Injections' }],
                attributes: {
                    'Volume': '2ml',
                    'Type': 'Viscosupplement'
                },
                images: [{ src: 'https://via.placeholder.com/150/3b82f6/ffffff?text=Hyalgan' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 2,
                name: 'Botox 200u Allergan',
                sku: 'BTX-200',
                price: '$759.00',
                regularPrice: '$759.00',
                categories: [{ id: 2, name: 'Neurotoxins' }],
                attributes: {
                    'Units': '200',
                    'Brand': 'Allergan'
                },
                images: [{ src: 'https://via.placeholder.com/150/10b981/ffffff?text=Botox' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 3,
                name: 'Supartz (Non-Refrigerated)',
                sku: 'SUP-NR',
                price: '$60.00',
                regularPrice: '$60.00',
                categories: [{ id: 1, name: 'Orthopaedic Injections' }],
                attributes: {
                    'Storage': 'Room Temperature',
                    'Volume': '2.5ml'
                },
                images: [{ src: 'https://via.placeholder.com/150/f59e0b/ffffff?text=Supartz' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 4,
                name: 'Wegovy 0.25mg',
                sku: 'WGV-025',
                price: '$439.00',
                regularPrice: '$439.00',
                categories: [{ id: 3, name: 'Weight Loss' }],
                attributes: {
                    'Dosage': '0.25mg',
                    'Type': 'Injectable'
                },
                images: [{ src: 'https://via.placeholder.com/150/ef4444/ffffff?text=Wegovy' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 5,
                name: 'Saxenda',
                sku: 'SAX-001',
                price: '$495.00',
                regularPrice: '$495.00',
                categories: [{ id: 3, name: 'Weight Loss' }],
                attributes: {
                    'Volume': '3ml',
                    'Type': 'Injectable'
                },
                images: [{ src: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=Saxenda' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 6,
                name: 'Ozempic',
                sku: 'OZM-001',
                price: '$399.00',
                regularPrice: '$399.00',
                categories: [{ id: 3, name: 'Weight Loss' }],
                attributes: {
                    'Type': 'Injectable',
                    'Brand': 'Novo Nordisk'
                },
                images: [{ src: 'https://via.placeholder.com/150/06b6d4/ffffff?text=Ozempic' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 7,
                name: 'Sculptra',
                sku: 'SCP-001',
                price: '$549.00',
                regularPrice: '$549.00',
                categories: [{ id: 4, name: 'Dermal Fillers' }],
                attributes: {
                    'Type': 'Poly-L-lactic acid',
                    'Volume': '5ml'
                },
                images: [{ src: 'https://via.placeholder.com/150/ec4899/ffffff?text=Sculptra' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            },
            {
                id: 8,
                name: 'Radiesse (+)',
                sku: 'RAD-PLUS',
                price: '$264.00',
                regularPrice: '$264.00',
                categories: [{ id: 4, name: 'Dermal Fillers' }],
                attributes: {
                    'Type': 'Calcium Hydroxylapatite',
                    'Volume': '1.5ml'
                },
                images: [{ src: 'https://via.placeholder.com/150/14b8a6/ffffff?text=Radiesse' }],
                status: 'publish',
                permalink: '#',
                description: '',
                shortDescription: ''
            }
        ],
        totalPages: 1,
        total: 8
    };
};
