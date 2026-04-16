import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // danger, warning, primary
}) => {
  if (!isOpen) return null;

  const variantColors = {
    danger: "text-red-500 bg-red-500/10 border-red-500/20",
    warning: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    primary: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  };

  const buttonVariants = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-500/20",
    warning: "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/20",
    primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl border ${variantColors[variant]}`}>
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 dark:border-[#30363d] dark:text-gray-300"
              >
                {cancelText}
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-2.5 text-white font-bold shadow-lg ${buttonVariants[variant]}`}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
