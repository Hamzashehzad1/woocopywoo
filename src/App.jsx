import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Connection from './pages/Connection';
import BusinessContext from './pages/BusinessContext';
import Products from './pages/Products';
import Generate from './pages/Generate';
import Settings from './pages/Settings';
import './index.css';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/connection" replace />} />
                            <Route path="/connection" element={<Connection />} />
                            <Route path="/business-context" element={<BusinessContext />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/generate" element={<Generate />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
