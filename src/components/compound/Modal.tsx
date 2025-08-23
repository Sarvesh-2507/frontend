import React, { createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Portal from '../ui/Portal';

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within Modal');
  }
  return context;
};

// Main Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  Title: typeof ModalTitle;
  CloseButton: typeof ModalCloseButton;
} = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    if (closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, closeOnEscape, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <ModalContext.Provider value={{ isOpen, onClose, size }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeOnOverlayClick ? onClose : undefined}
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`
                  relative w-full ${sizeClasses[size]} 
                  bg-white dark:bg-gray-800 
                  rounded-2xl shadow-2xl 
                  max-h-[90vh] overflow-hidden
                  ${className}
                `}
              >
                {children}
              </motion.div>
            </motion.div>
          </ModalContext.Provider>
        )}
      </AnimatePresence>
    </Portal>
  );
};

// Modal Header Component
interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  className = '',
  showCloseButton = true 
}) => {
  const { onClose } = useModalContext();

  return (
    <div className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="ml-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// Modal Title Component
interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h2>
  );
};

// Modal Body Component
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

const ModalBody: React.FC<ModalBodyProps> = ({ 
  children, 
  className = '',
  scrollable = true 
}) => {
  return (
    <div className={`p-6 ${scrollable ? 'overflow-y-auto' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Modal Footer Component
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Modal Close Button Component
interface ModalCloseButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ 
  children = 'Close',
  className = '',
  variant = 'secondary'
}) => {
  const { onClose } = useModalContext();

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
  };

  return (
    <button
      onClick={onClose}
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Attach compound components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Title = ModalTitle;
Modal.CloseButton = ModalCloseButton;

export default Modal;
