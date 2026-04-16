import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import VendorCard from '../components/dashboard/VendorCard';
import VendorModal from '../components/dashboard/VendorModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchVendors, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDemo = user?.email === 'demo@vendorvigil.com';

  const handleAddVendor = async (vendorData) => {
    if (isDemo) {
      toast.error('Adding vendors is disabled in Demo Mode');
      setIsModalOpen(false);
      return;
    }
    try {
      await api.post('/vendors', vendorData);
      toast.success('Vendor added successfully');
      fetchVendors(); // Refresh list - faster than waiting for poll
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vendor');
    }
  };

  const handleToggleVendor = async (id) => {
    if (isDemo) {
      return toast.error('Toggling monitors is disabled in Demo Mode');
    }
    try {
      const res = await api.patch(`/vendors/${id}/toggle`);
      setVendors(vendors.map(v => v._id === id ? { ...v, isActive: res.data.isActive } : v));
      toast.success(res.data.isActive ? 'Monitor resumed' : 'Monitor paused');
    } catch (error) {
      toast.error('Failed to toggle monitor');
    }
  };

  const handleDeleteVendor = (id) => {
    if (isDemo) {
      return toast.error('Deleting monitors is disabled in Demo Mode');
    }
    setVendorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/vendors/${vendorToDelete}`);
      toast.success('Vendor deleted');
      setVendors(vendors.filter(v => v._id !== vendorToDelete));
    } catch (error) {
      toast.error('Failed to delete vendor');
    } finally {
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    }
  };

  const [viewMode, setViewMode] = useState('grid');

  const totalVendors = vendors.length;
  const healthyVendors = vendors.filter(v => v.isActive && v.latestLog?.status === 'Healthy').length;
  const degradedVendors = vendors.filter(v => v.isActive && v.latestLog && v.latestLog.latency > 800 && v.latestLog.status === 'Healthy').length;
  const downVendors = vendors.filter(v => v.isActive && v.latestLog && v.latestLog.status !== 'Healthy').length;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-[#050d1a] text-gray-900 dark:text-white p-6 md:p-12 transition-colors duration-300 font-['Space_Grotesk']">
      <div className="max-w-7xl mx-auto border-[#1e293b]">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto items-center">
                <div className="hidden sm:flex bg-gray-200 dark:bg-[#0d1117] p-1 rounded-lg border border-gray-300 dark:border-[#1e293b] mr-4">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                     List
                  </button>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 py-2 bg-[#388bfd] hover:bg-[#2b6fcb] shadow-[0_0_15px_rgba(56,139,253,0.3)]">
                    <Plus size={18} className="flex-shrink-0" />
                    <span className="hidden xs:inline">Add Monitor</span>
                    <span className="xs:hidden">Add</span>
                </Button>
                <Button variant="ghost" onClick={logout} className="flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 py-2 text-gray-500 hover:text-red-400">
                    <LogOut size={18} className="flex-shrink-0" />
                    <span className="hidden xs:inline">Logout</span>
                </Button>
            </div>
        </header>

        {/* Top Level Health Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#1e293b] p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">APIs Monitored</div>
            <div className="text-2xl font-bold font-['JetBrains_Mono'] dark:text-white">{totalVendors}</div>
          </div>
          <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#1e293b] p-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#3fb950] opacity-10 blur-xl"></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Healthy</div>
            <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#3fb950]">{healthyVendors}</div>
          </div>
          <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#1e293b] p-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#d29922] opacity-10 blur-xl"></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Degraded (&gt;800ms)</div>
            <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#d29922]">{degradedVendors}</div>
          </div>
          <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#1e293b] p-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#f85149] opacity-10 blur-xl"></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Incidents Today</div>
            <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f85149]">{downVendors}</div>
          </div>
        </div>

        {loading ? (
             <div className="flex justify-center py-20 text-gray-500">Loading your monitors...</div>
        ) : vendors.length === 0 ? (
            <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No Monitors Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start monitoring your third-party APIs by adding your first vendor.</p>
                <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
                    + Add Your First Monitor
                </Button>
            </div>
        ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <VendorCard 
                        key={vendor._id} 
                        vendor={vendor} 
                        onToggle={handleToggleVendor}
                        onDelete={handleDeleteVendor} 
                    />
                ))}
            </div>
        ) : (
            <div className="bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#1e293b] overflow-hidden shadow-sm">
                <div className="grid grid-cols-6 text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase bg-gray-50 dark:bg-[#0d1117] px-6 py-4 border-b border-gray-200 dark:border-[#1e293b]">
                  <div className="col-span-2">Service</div>
                  <div>Status</div>
                  <div>Latency</div>
                  <div className="text-right col-span-2">Uptime & Last Check</div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-[#1e293b]">
                  {vendors.map((vendor) => {
                    const isHealthy = vendor.latestLog?.status === 'Healthy';
                    const isDown = vendor.latestLog?.status === 'Error';
                    const latency = vendor.latestLog?.latency || 0;
                    const isDegraded = isHealthy && latency > 800;
                    
                    let statusColor = vendor.isActive ? (isDown ? '#f85149' : (isDegraded ? '#d29922' : '#3fb950')) : '#64748b';
                    let statusText = !vendor.isActive ? 'PAUSED' : (isDown ? 'DOWN' : (isDegraded ? 'SLOW' : 'UP'));
                    let latencyText = !vendor.isActive ? '-' : (isDown ? 'timeout' : `${latency}ms`);
                    let rowBgClass = isDown ? 'bg-[#f85149]/5 border-l-2 border-l-[#f85149] hover:bg-[#f85149]/10' : 'hover:bg-gray-50 dark:hover:bg-[#0d1117]';

                    return (
                        <div key={vendor._id} className={`grid grid-cols-6 items-center px-6 py-4 transition-colors ${rowBgClass}`}>
                            <div className="col-span-2 font-medium flex items-center gap-3 dark:text-white">
                                {isDown ? (
                                    <span className="relative flex h-2 w-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{backgroundColor: statusColor}}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2`} style={{backgroundColor: statusColor}}></span>
                                    </span>
                                ) : (
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: statusColor}}></div>
                                )}
                                {vendor.name}
                            </div>
                            <div>
                                <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{backgroundColor: `${statusColor}1A`, color: statusColor}}>
                                    {statusText}
                                </span>
                            </div>
                            <div className="font-['JetBrains_Mono'] text-sm" style={{color: statusText === 'UP' ? 'inherit' : statusColor}}>
                                {latencyText}
                            </div>
                            <div className="text-right col-span-2 flex flex-col items-end gap-1">
                                <div className="flex gap-0.5">
                                    {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}
                                    <div className="w-1.5 h-3 rounded-sm opacity-80" style={{backgroundColor: statusColor}}></div>
                                </div>
                                <div className="text-xs text-gray-500 font-['JetBrains_Mono']">
                                    {vendor.latestLog?.createdAt ? new Date(vendor.latestLog.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No data'}
                                </div>
                            </div>
                        </div>
                    );
                  })}
                </div>
            </div>
        )}

        <VendorModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleAddVendor} 
        />

        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Monitor"
            message="Are you sure you want to delete this monitor? All historical data logs for this vendor will be permanently removed."
            confirmText="Delete Vendor"
            variant="danger"
        />
      </div>
    </div>
  );
};

export default Dashboard;
