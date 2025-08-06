import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'soft' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  rounded = 'lg',
  showPasswordToggle = false,
  className,
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const baseClasses = 'w-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
    soft: 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-soft-inset',
    glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const paddingWithIcon = {
    left: {
      sm: 'pl-10',
      md: 'pl-12',
      lg: 'pl-14',
    },
    right: {
      sm: 'pr-10',
      md: 'pr-12',
      lg: 'pr-14',
    },
  };

  const iconPositionClasses = {
    left: {
      sm: 'left-3',
      md: 'left-4',
      lg: 'left-5',
    },
    right: {
      sm: 'right-3',
      md: 'right-4',
      lg: 'right-5',
    },
  };

  const inputClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    icon && iconPosition === 'left' && paddingWithIcon.left[size],
    (icon && iconPosition === 'right') || showPasswordToggle ? paddingWithIcon.right[size] : '',
    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <motion.label
          className={cn(
            'block text-sm font-medium mb-2 transition-colors duration-200',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
            isFocused && !error && 'text-blue-600 dark:text-blue-400'
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute inset-y-0 flex items-center pointer-events-none z-10',
            iconPosition === 'left' ? iconPositionClasses.left[size] : iconPositionClasses.right[size]
          )}>
            <span className={cn(
              iconSizeClasses[size],
              error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500',
              isFocused && !error && 'text-blue-500'
            )}>
              {icon}
            </span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          {...(props as any)}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className={cn(
              'absolute inset-y-0 flex items-center z-10',
              iconPositionClasses.right[size],
              'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200'
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className={iconSizeClasses[size]} />
            ) : (
              <Eye className={iconSizeClasses[size]} />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
