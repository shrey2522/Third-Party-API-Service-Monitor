import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Play, Pause, AlertCircle, CheckCircle2, BarChart2 } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

const VendorCard = ({ vendor, onToggle, onDelete }) => {
  const navigate = useNavigate();
  const { isActive, latestLog } = vendor;
  
  // Logic to determine display status
  let statusColor = 'bg-gray-500';
  let statusText = 'Paused';
  let latency = latestLog?.latency || 0;
  let statusCode = latestLog?.statusCode || '-';
  
  if (isActive) {
      if (!latestLog) {
          statusColor = 'bg-yellow-500';
          statusText = 'Pending...';
      } else if (latestLog.status === 'Healthy') {
          statusColor = 'bg-green-500';
          statusText = 'Operational';
      } else {
          statusColor = 'bg-red-500';
          statusText = latestLog.errorMessage || 'Error';
      }
  }

  // Latency Color Logic
  const getLatencyColor = (ms) => {
      if (!ms) return 'bg-gray-700';
      if (ms < 300) return 'bg-green-500';
      if (ms < 800) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={!isActive ? 'grayscale opacity-75' : ''}
    >
      <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-colors bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800">
        <div className={`absolute top-0 left-0 w-1 h-full ${statusColor} transition-colors duration-300`} />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors" onClick={() => navigate(`/vendor/${vendor._id}`)}>
            {vendor.name}
            <a 
                href={vendor.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
                title="Visit API"
            >
                <ExternalLink size={16} />
            </a>
          </CardTitle>
          <div className="flex items-center gap-2">
             <span className={`flex h-3 w-3 rounded-full ${statusColor} shadow-[0_0_8px] shadow-${statusColor.replace('bg-', '')}/50 ${isActive && latestLog ? 'animate-pulse' : ''}`} />
             <span className={`text-xs font-medium ${statusColor.replace('bg-', 'text-').replace('500', '400')}`}>
                {statusText}
             </span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 cursor-pointer" onClick={() => navigate(`/vendor/${vendor._id}`)}>
             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Code</span>
                    <div className="flex items-center gap-2">
                         {statusCode >= 200 && statusCode < 300 ? (
                             <CheckCircle2 size={16} className="text-green-500" />
                         ) : statusCode >= 400 ? (
                             <AlertCircle size={16} className="text-red-500" />
                         ) : (
                             <span className="w-4 h-4 block" />
                         )}
                         <span className={`font-mono font-bold ${statusCode >= 400 ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                            {statusCode}
                         </span>
                    </div>
                </div>
                <div className="flex flex-col">
                     <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latency</span>
                     <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {latestLog ? `${latency}ms` : '-'}
                     </span>
                </div>
             </div>
             
             {/* Latency Visual Bar */}
             <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((latency / 2000) * 100, 100)}%` }}
                        className={`h-full ${getLatencyColor(latency)}`}
                    />
                </div>
             </div>

             <div className="pt-2 flex justify-between items-center text-xs text-gray-500">
                <span>Check every {vendor.checkFrequency}m</span>
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); navigate(`/vendor/${vendor._id}`); }}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 p-2"
                        title="View Analytics"
                    >
                        <BarChart2 size={18} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onToggle(vendor._id); }}
                        className={`p-2 ${isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                        title={isActive ? "Pause Monitoring" : "Resume Monitoring"}
                    >
                        {isActive ? <Pause size={18} /> : <Play size={18} />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onDelete(vendor._id); }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                        title="Delete Vendor"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VendorCard;
