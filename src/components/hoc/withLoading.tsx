import React from 'react';
import { motion } from 'framer-motion';

interface WithLoadingOptions {
  loadingComponent?: React.ComponentType;
  className?: string;
  showSpinner?: boolean;
  spinnerSize?: 'sm' | 'md' | 'lg';
  message?: string;
}

interface WithLoadingProps {
  isLoading?: boolean;
}

const DefaultLoadingComponent: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  message?: string;
  className?: string;
}> = ({ 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div className={`${sizeClasses[size]} border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4`} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </motion.div>
  );
};

const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithLoadingOptions = {}
) => {
  const {
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    className = '',
    showSpinner = true,
    spinnerSize = 'md',
    message = 'Loading...'
  } = options;

  const WithLoadingComponent: React.FC<P & WithLoadingProps> = ({ 
    isLoading = false, 
    ...props 
  }) => {
    if (isLoading) {
      return showSpinner ? (
        <LoadingComponent 
          size={spinnerSize} 
          message={message} 
          className={className}
        />
      ) : (
        <div className={`opacity-50 pointer-events-none ${className}`}>
          <WrappedComponent {...(props as P)} />
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };

  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithLoadingComponent;
};

export default withLoading;
