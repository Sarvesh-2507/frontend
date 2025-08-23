import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  pulse?: boolean;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'sm',
  rounded = 'full',
  removable = false,
  onRemove,
  icon,
  pulse = false,
  dot = false
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-sm'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    pulse && 'animate-pulse',
    className
  );

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={combinedClasses}
    >
      {dot && (
        <span className={cn(
          'w-2 h-2 rounded-full mr-1.5',
          variant === 'primary' && 'bg-blue-500',
          variant === 'success' && 'bg-green-500',
          variant === 'warning' && 'bg-yellow-500',
          variant === 'danger' && 'bg-red-500',
          variant === 'info' && 'bg-cyan-500',
          (variant === 'default' || variant === 'secondary' || variant === 'outline') && 'bg-gray-500'
        )} />
      )}
      
      {icon && (
        <span className={cn('flex items-center', children && 'mr-1')}>
          {icon}
        </span>
      )}
      
      {children}
      
      {removable && (
        <button
          onClick={onRemove}
          className={cn(
            'ml-1 flex items-center hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors',
            size === 'xs' && 'ml-0.5',
            size === 'lg' && 'ml-1.5'
          )}
        >
          <X className={cn(
            size === 'xs' && 'w-2.5 h-2.5',
            size === 'sm' && 'w-3 h-3',
            size === 'md' && 'w-3.5 h-3.5',
            size === 'lg' && 'w-4 h-4'
          )} />
        </button>
      )}
    </motion.span>
  );
};

export default Badge;
