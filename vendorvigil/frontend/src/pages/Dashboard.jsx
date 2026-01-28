import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import VendorCard from '../components/dashboard/VendorCard';
import VendorModal from '../components/dashboard/VendorModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddVendor = async (vendorData) => {
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
    try {
      const res = await api.patch(`/vendors/${id}/toggle`);
      setVendors(vendors.map(v => v._id === id ? { ...v, isActive: res.data.isActive } : v));
      toast.success(res.data.isActive ? 'Monitor resumed' : 'Monitor paused');
    } catch (error) {
      toast.error('Failed to toggle monitor');
    }
  };

  const handleDeleteVendor = async (id) => {
    if(!window.confirm('Are you sure you want to delete this monitor?')) return;
    try {
      await api.delete(`/vendors/${id}`);
      toast.success('Vendor deleted');
      setVendors(vendors.filter(v => v._id !== id));
    } catch (error) {
      toast.error('Failed to delete vendor');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-4">
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Add Monitor
                </Button>
                <Button variant="danger" onClick={logout} className="flex items-center gap-2">
                    <LogOut size={18} /> Logout
                </Button>
            </div>
        </header>

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
        ) : (
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
        )}

        <VendorModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleAddVendor} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
