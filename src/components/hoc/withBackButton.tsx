import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '../ui/BackButton';

interface WithBackButtonOptions {
  to?: string;
  label?: string;
  variant?: 'default' | 'home' | 'minimal';
  position?: 'top-left' | 'top-right' | 'header';
  showInHeader?: boolean;
  className?: string;
}

const withBackButton = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithBackButtonOptions = {}
) => {
  const {
    to = '/home',
    label = 'Back to Home',
    variant = 'home',
    position = 'top-left',
    showInHeader = true,
    className = ''
  } = options;

  const WithBackButtonComponent: React.FC<P> = (props) => {
    return (
      <div className={`relative ${className}`}>
        {/* Back Button */}
        {showInHeader && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute z-50 ${
              position === 'top-left'
                ? 'top-4 left-4'
                : position === 'top-right'
                ? 'top-4 right-4'
                : 'top-4 left-4'
            }`}
          >
            <BackButton
              to={to}
              label={label}
              variant={variant}
            />
          </motion.div>
        )}

        {/* Wrapped Component */}
        <WrappedComponent {...props} />
      </div>
    );
  };

  WithBackButtonComponent.displayName = `withBackButton(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithBackButtonComponent;
};

export default withBackButton;
