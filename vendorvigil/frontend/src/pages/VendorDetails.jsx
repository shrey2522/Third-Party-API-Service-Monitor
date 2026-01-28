import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, CheckCircle, Edit2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import Button from '../components/ui/Button';
import VendorModal from '../components/dashboard/VendorModal';
import toast from 'react-hot-toast';

const VendorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [vendorRes, logsRes] = await Promise.all([
                api.get(`/vendors/${id}`),
                api.get(`/vendors/${id}/logs`)
            ]);
            setVendor(vendorRes.data);
            
            // Format logs for chart
            const formattedLogs = logsRes.data.map(log => ({
                ...log,
                time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fullTime: new Date(log.timestamp).toLocaleString()
            }));
            setLogs(formattedLogs);
        } catch (error) {
            toast.error('Failed to load vendor details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [id, navigate]);

    const handleUpdateVendor = async (data) => {
        try {
            const res = await api.put(`/vendors/${id}`, data);
            setVendor(res.data);
            toast.success('Monitor updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update monitor');
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading analytics...</div>;
    if (!vendor) return null;

    // Calculate Analytics
    const uptime = logs.length > 0 ? ((logs.filter(l => l.status === 'Healthy').length / logs.length) * 100).toFixed(1) : 0;
    const avgLatency = logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.latency, 0) / logs.length) : 0;
    const maxLatency = logs.length > 0 ? Math.max(...logs.map(l => l.latency)) : 0;

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <ArrowLeft size={24} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                {vendor.name}
                                <span className={`px-3 py-1 text-sm rounded-full ${vendor.isActive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {vendor.isActive ? 'Monitoring Active' : 'Paused'}
                                </span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <a href={vendor.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                    {vendor.url}
                                </a>
                                <span className="text-gray-500 text-sm">• Check every {vendor.checkFrequency} min</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2">
                        <Edit2 size={16} /> Edit
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                            <Activity size={20} /> <span className="text-sm">Avg Latency</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgLatency}ms</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                             <Clock size={20} /> <span className="text-sm">Max Latency</span>
                        </div>
                         <p className="text-3xl font-bold text-gray-900 dark:text-white">{maxLatency}ms</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                         <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                            <CheckCircle size={20} /> <span className="text-sm">Uptime (Last 50)</span>
                         </div>
                         <p className="text-3xl font-bold text-green-600 dark:text-green-400">{uptime}%</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Latency History</h2>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={logs}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#9ca3af' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="latency" 
                                    stroke="#3b82f6" 
                                    fillOpacity={1} 
                                    fill="url(#colorLatency)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg transition-colors duration-300">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Checks</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                                <tr className="text-sm uppercase tracking-wider">
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Latency</th>
                                    <th className="p-4">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.slice(0, 10).map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 text-gray-700 dark:text-gray-300 font-mono text-sm">{log.fullTime}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${log.status === 'Healthy' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                {log.statusCode || log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-blue-600 dark:text-blue-300">{log.latency}ms</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate" title={log.errorMessage}>{log.errorMessage || 'OK'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <VendorModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSubmit={handleUpdateVendor}
                    initialData={vendor}
                />
            </div>
        </div>
    );
};

export default VendorDetails;
