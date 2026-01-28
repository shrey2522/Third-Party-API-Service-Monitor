import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const VendorModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [name, setName] = useState('');
    const [protocol, setProtocol] = useState('https://');
    const [domain, setDomain] = useState('');
    const [frequency, setFrequency] = useState(5);
    const [slackWebhook, setSlackWebhook] = useState('');
    const [alertEmail, setAlertEmail] = useState('');
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
            } else {
                setName('');
                setProtocol('https://');
                setDomain('');
                setFrequency(5);
                setSlackWebhook('');
                setAlertEmail('');
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
                alertEmail
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
