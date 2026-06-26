import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this? This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-danger to-red-400" />

            <div className="p-6">
              {/* Icon */}
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-danger" />
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border-subtle text-text-muted hover:text-text-main hover:bg-white/5 transition-all text-sm font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-danger hover:bg-danger/80 text-white transition-all text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  {isLoading ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>{confirmLabel}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
