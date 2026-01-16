import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Users, FileText, Plus, X, Globe, Wand2, Loader2 } from 'lucide-react';
import { analyzeCompanyWebsite } from '../services/aiGenerator';

const BusinessContext = () => {
    const { businessContext, updateBusinessContext, addUSP, removeUSP, grokApiKey } = useApp();
    const [newUSP, setNewUSP] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState('');

    const handleChange = (e) => {
        updateBusinessContext({
            [e.target.name]: e.target.value
        });
    };

    const handleAddUSP = () => {
        if (newUSP.trim()) {
            addUSP(newUSP.trim());
            setNewUSP('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddUSP();
        }
    };

    const handleAnalyzeWebsite = async () => {
        if (!websiteUrl) return;
        if (!grokApiKey) {
            setAnalysisError('Please enter your Grok/Groq API Key in the Connection page first.');
            return;
        }

        setAnalyzing(true);
        setAnalysisError('');

        try {
            // Use allorigins as CORS proxy
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(websiteUrl)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (!data.contents) {
                throw new Error('Could not fetch website content');
            }

            // Extract text from HTML (simple strip tags)
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');

            // Remove scripts and styles
            const scripts = doc.querySelectorAll('script, style');
            scripts.forEach(script => script.remove());

            const textContent = doc.body.innerText || doc.body.textContent;

            // Analyze with Grok
            const analysis = await analyzeCompanyWebsite(textContent, grokApiKey);

            // Update context
            updateBusinessContext({
                companyName: analysis.companyName || businessContext.companyName,
                targetAudience: analysis.targetAudience || businessContext.targetAudience,
                description: analysis.description || businessContext.description,
                businessType: analysis.businessType || 'wholesaler',
                writingTone: analysis.writingTone || 'professional'
            });

            // Add new USPs
            if (analysis.usps && Array.isArray(analysis.usps)) {
                analysis.usps.forEach(usp => addUSP(usp));
            }

        } catch (err) {
            console.error('Website analysis error:', err);
            setAnalysisError('Failed to analyze website. Please check the URL.');
        } finally {
            setAnalyzing(false);
        }
    };

    const businessTypes = [
        { value: 'manufacturer', label: 'Manufacturer' },
        { value: 'wholesaler', label: 'Wholesaler' },
        { value: 'distributor', label: 'Distributor' },
        { value: 'retailer', label: 'Retailer' },
        { value: 'supplier', label: 'Supplier' }
    ];

    const writingTones = [
        { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
        { value: 'technical', label: 'Technical', description: 'Detailed and specification-heavy' },
        { value: 'sales', label: 'Sales-Focused', description: 'Persuasive and conversion-oriented' },
        { value: 'neutral', label: 'Neutral', description: 'Balanced and informative' }
    ];

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Business Information</h2>
                    <p className="card-description">Tell us about your business to personalize product descriptions</p>
                </div>

                <div className="card-content">
                    {/* Auto-fill Section */}
                    <div className="bg-secondary p-md mb-md rounded-md">
                        <label className="form-label flex gap-sm items-center" style={{ marginBottom: '0.5rem' }}>
                            <Globe size={16} />
                            Auto-fill from Website
                        </label>
                        <div className="flex gap-sm">
                            <input
                                type="url"
                                className="form-input"
                                placeholder="https://yourwebsite.com"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleAnalyzeWebsite}
                                disabled={analyzing || !websiteUrl}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {analyzing ? <Loader2 className="spin" size={16} /> : <Wand2 size={16} />}
                                {analyzing ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                        {analysisError && <p className="text-danger u-text-small mt-xs">{analysisError}</p>}
                        {!grokApiKey && <p className="text-warning u-text-small mt-xs">Requires Groq API Key (set in Connection page)</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="companyName">
                            <Building2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className="form-input"
                            placeholder="Your company name"
                            value={businessContext.companyName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="targetAudience">
                            <Users size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Target Audience
                        </label>
                        <input
                            type="text"
                            id="targetAudience"
                            name="targetAudience"
                            className="form-input"
                            placeholder="e.g., Retail pharmacies, beauty clinics, hospitals"
                            value={businessContext.targetAudience}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">
                            <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Business Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-textarea"
                            placeholder="Describe your business, what you do, and what makes you unique..."
                            value={businessContext.description}
                            onChange={handleChange}
                            rows={4}
                        />
                        <p className="form-hint">This context helps generate more relevant product descriptions</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="businessType">
                            Business Type
                        </label>
                        <select
                            id="businessType"
                            name="businessType"
                            className="form-select"
                            value={businessContext.businessType}
                            onChange={handleChange}
                        >
                            {businessTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Unique Selling Points (USPs)</h3>
                    <p className="card-description">Add key differentiators that set your business apart</p>
                </div>

                <div className="card-content">
                    <div className="form-group">
                        <div className="flex gap-sm">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Add a unique selling point..."
                                value={newUSP}
                                onChange={(e) => setNewUSP(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddUSP}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {businessContext.usps.length > 0 && (
                        <div className="gap-sm" style={{ display: 'flex', flexDirection: 'column' }}>
                            {businessContext.usps.map((usp, index) => (
                                <div
                                    key={index}
                                    className="flex-between"
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                >
                                    <span>{usp}</span>
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => removeUSP(index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Writing Tone</h3>
                    <p className="card-description">Select the tone for your product descriptions</p>
                </div>

                <div className="card-content">
                    <div className="selection-cards">
                        {writingTones.map(tone => (
                            <div
                                key={tone.value}
                                className={`selection-card ${businessContext.writingTone === tone.value ? 'selected' : ''}`}
                                onClick={() => updateBusinessContext({ writingTone: tone.value })}
                            >
                                <h4 className="selection-card-title">{tone.label}</h4>
                                <p className="selection-card-description">{tone.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessContext;
