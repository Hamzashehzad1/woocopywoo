import { createContext, useContext, useState, useEffect } from 'react';
import { initializeWooCommerce } from '../services/woocommerce';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // WooCommerce Connection
  const [connection, setConnection] = useState(() => {
    const saved = localStorage.getItem('woo_connection');
    return saved ? JSON.parse(saved) : {
      siteUrl: '',
      consumerKey: '',
      consumerSecret: '',
      isConnected: false
    };
  });

  // Grok API Key
  const [grokApiKey, setGrokApiKey] = useState(() => {
    return localStorage.getItem('grok_api_key') || '';
  });

  // Business Context
  const [businessContext, setBusinessContext] = useState(() => {
    const saved = localStorage.getItem('business_context');
    return saved ? JSON.parse(saved) : {
      companyName: '',
      targetAudience: '',
      description: '',
      businessType: 'wholesaler',
      usps: [],
      writingTone: 'professional'
    };
  });

  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  // Generated Descriptions
  const [generatedDescriptions, setGeneratedDescriptions] = useState({});

  // Recently Updated Products (for status indicator)
  const [recentlyUpdated, setRecentlyUpdated] = useState([]);

  // Auto-push setting
  const [autoPush, setAutoPush] = useState(true);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('woo_connection', JSON.stringify(connection));
  }, [connection]);

  useEffect(() => {
    if (grokApiKey) {
      localStorage.setItem('grok_api_key', grokApiKey);
    }
  }, [grokApiKey]);

  useEffect(() => {
    localStorage.setItem('business_context', JSON.stringify(businessContext));
  }, [businessContext]);

  // Re-initialize WooCommerce API on load if connection details exist
  useEffect(() => {
    if (connection.siteUrl && connection.consumerKey && connection.consumerSecret) {
      console.log('Initializing WooCommerce API from stored credentials...');
      initializeWooCommerce(
        connection.siteUrl,
        connection.consumerKey,
        connection.consumerSecret
      );
    }
  }, [connection.siteUrl, connection.consumerKey, connection.consumerSecret]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Update connection
  const updateConnection = (data) => {
    setConnection(prev => ({ ...prev, ...data }));
  };

  // Update business context
  const updateBusinessContext = (data) => {
    setBusinessContext(prev => ({ ...prev, ...data }));
  };

  // Add USP
  const addUSP = (usp) => {
    setBusinessContext(prev => ({
      ...prev,
      usps: [...prev.usps, usp]
    }));
  };

  // Remove USP
  const removeUSP = (index) => {
    setBusinessContext(prev => ({
      ...prev,
      usps: prev.usps.filter((_, i) => i !== index)
    }));
  };

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Mark product as updated
  const markAsUpdated = (productId) => {
    setRecentlyUpdated(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  // Select all products
  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p.id));
  };

  // Deselect all products
  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  // Clear all data
  const clearAllData = () => {
    localStorage.clear();
    setConnection({
      siteUrl: '',
      consumerKey: '',
      consumerSecret: '',
      isConnected: false
    });
    setGrokApiKey(''); // Clear Grok Key
    setBusinessContext({
      companyName: '',
      targetAudience: '',
      description: '',
      businessType: 'wholesaler',
      usps: [],
      writingTone: 'professional'
    });
    setProducts([]);
    setProducts([]);
    setSelectedProducts([]);
    setRecentlyUpdated([]);
    setGeneratedDescriptions({});
  };

  const value = {
    connection,
    updateConnection,
    grokApiKey,
    setGrokApiKey,
    businessContext,
    updateBusinessContext,
    addUSP,
    removeUSP,
    products,
    setProducts,
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    deselectAllProducts,
    generatedDescriptions,
    setGeneratedDescriptions,
    recentlyUpdated,
    markAsUpdated,
    autoPush,
    setAutoPush,
    clearAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
