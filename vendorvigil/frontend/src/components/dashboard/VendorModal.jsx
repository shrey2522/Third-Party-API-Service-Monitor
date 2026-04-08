import { useState, useEffect } from 'react';
import { X, ChevronDown, Plus, Trash2, Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const VendorModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [name, setName] = useState('');
    const [protocol, setProtocol] = useState('https://');
    const [domain, setDomain] = useState('');
    const [frequency, setFrequency] = useState(5);
    const [slackWebhook, setSlackWebhook] = useState('');
    const [alertEmail, setAlertEmail] = useState('');
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData && initialData.url) {
                setName(initialData.name || '');
                setFrequency(initialData.checkFrequency || 5);
                
                // Parse URL into protocol and domain
                const url = initialData.url;
                if (url.startsWith('https://')) {
                    setProtocol('https://');
                    setDomain(url.replace('https://', ''));
                } else if (url.startsWith('http://')) {
                    setProtocol('http://');
                    setDomain(url.replace('http://', ''));
                } else {
                    setProtocol('https://');
                    setDomain(url);
                }
                setSlackWebhook(initialData.slackWebhook || '');
                setAlertEmail(initialData.alertEmail || '');
                setHeaders(initialData.headers || []);
            } else {
                setName('');
                setProtocol('https://');
                setDomain('');
                setFrequency(5);
                setSlackWebhook('');
                setAlertEmail('');
                setHeaders([]);
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fullUrl = `${protocol}${domain}`;
            await onSubmit({ 
                name, 
                url: fullUrl, 
                checkFrequency: Number(frequency),
                slackWebhook,
                alertEmail,
                headers
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '', isSecret: false }]);
    };

    const updateHeader = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const removeHeader = (index) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    const isEdit = !!initialData;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-700">
                        <h3 className="text-xl font-bold text-white">
                            {isEdit ? 'Edit Monitor' : 'Add New Monitor'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. Google API"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">API Endpoint URL</label>
                            <div className="flex rounded-lg bg-gray-900 border border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden transition-all">
                                <div className="relative border-r border-gray-700 bg-gray-800">
                                    <select
                                        value={protocol}
                                        onChange={(e) => setProtocol(e.target.value)}
                                        className="h-full px-3 py-2 bg-transparent text-gray-300 font-medium outline-none appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="https://">https://</option>
                                        <option value="http://">http://</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    required
                                    className="flex-1 px-4 py-2 bg-transparent text-white outline-none placeholder:text-gray-600"
                                    placeholder="api.example.com/health"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Check Frequency</label>
                            <div className="relative">
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                                >
                                    <option value={1}>Every 1 minute</option>
                                    <option value={5}>Every 5 minutes</option>
                                    <option value={10}>Every 10 minutes</option>
                                    <option value={30}>Every 30 minutes</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Notifications (Optional)</h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Slack Webhook URL</label>
                                    <input
                                        type="url"
                                        value={slackWebhook}
                                        onChange={(e) => setSlackWebhook(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-600"
                                        placeholder="https://hooks.slack.com/services/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Alert Email Address</label>
                                    <input
                                        type="email"
                                        value={alertEmail}
                                        onChange={(e) => setAlertEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-600"
                                        placeholder="alerts@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Custom Headers / Secrets</h4>
                                <button 
                                    type="button" 
                                    onClick={addHeader}
                                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={14} /> Add Header
                                </button>
                            </div>
                            
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                                {headers.length === 0 && (
                                    <p className="text-xs text-gray-500 italic">No custom headers added. Add one for authenticated APIs (AWS, Razorpay, etc.)</p>
                                )}
                                {headers.map((header, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-gray-900/50 p-2 rounded-lg border border-gray-700/50">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={header.key}
                                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                                className="w-full px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-blue-500"
                                                placeholder="Key (e.g. x-api-key)"
                                            />
                                            <div className="relative">
                                                <input
                                                    type={header.isSecret ? "password" : "text"}
                                                    value={header.value}
                                                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                                    className="w-full px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-blue-500 pr-8"
                                                    placeholder="Value (or Secret Key)"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateHeader(index, 'isSecret', !header.isSecret)}
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${header.isSecret ? 'text-blue-400' : 'text-gray-500'} hover:text-white transition-colors`}
                                                    title={header.isSecret ? "Secret Key (Encrypted)" : "Public Header"}
                                                >
                                                    {header.isSecret ? <Lock size={12} /> : <Eye size={12} />}
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeHeader(index)}
                                            className="text-gray-500 hover:text-red-400 transition-colors pt-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Monitor')}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default VendorModal;
