import React, { createContext, useContext, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormContextType {
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

const FormContext = createContext<FormContextType>({});

const useFormContext = () => {
  return useContext(FormContext);
};

// Main Form Component
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  className?: string;
}

const Form: React.FC<FormProps> & {
  Field: typeof FormField;
  Input: typeof FormInput;
  Label: typeof FormLabel;
  Error: typeof FormError;
  Success: typeof FormSuccess;
  Group: typeof FormGroup;
  Actions: typeof FormActions;
  PasswordInput: typeof FormPasswordInput;
} = ({
  children,
  isSubmitting = false,
  errors = {},
  className = '',
  ...props
}) => {
  return (
    <FormContext.Provider value={{ isSubmitting, errors }}>
      <form className={`space-y-6 ${className}`} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form Group Component
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

// Form Field Component (combines label, input, and error)
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

// Form Label Component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ 
  children, 
  required = false, 
  className = '',
  ...props 
}) => {
  return (
    <label 
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  name,
  error,
  success = false,
  icon,
  className = '',
  ...props
}, ref) => {
  const { errors } = useFormContext();
  const fieldError = error || errors?.[name];
  const hasError = !!fieldError;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      )}
      
      <input
        ref={ref}
        name={name}
        className={`
          input-field
          ${icon ? 'pl-10' : ''}
          ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : ''}
          ${className}
        `}
        {...props}
      />

      {(hasError || success) && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {hasError ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

// Form Password Input Component
interface FormPasswordInputProps extends Omit<FormInputProps, 'type'> {
  showToggle?: boolean;
}

const FormPasswordInput = forwardRef<HTMLInputElement, FormPasswordInputProps>(({
  name,
  error,
  success = false,
  icon,
  showToggle = true,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { errors } = useFormContext();
  const fieldError = error || errors?.[name];
  const hasError = !!fieldError;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      )}
      
      <input
        ref={ref}
        name={name}
        type={showPassword ? 'text' : 'password'}
        className={`
          input-field
          ${icon ? 'pl-10' : ''}
          ${showToggle ? 'pr-10' : ''}
          ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : ''}
          ${className}
        `}
        {...props}
      />

      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      )}
    </div>
  );
});

FormPasswordInput.displayName = 'FormPasswordInput';

// Form Error Component
interface FormErrorProps {
  children?: React.ReactNode;
  name?: string;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ children, name, className = '' }) => {
  const { errors } = useFormContext();
  const error = children || (name && errors?.[name]);

  if (!error) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ${className}`}
    >
      <AlertCircle className="w-4 h-4" />
      {error}
    </motion.p>
  );
};

// Form Success Component
interface FormSuccessProps {
  children: React.ReactNode;
  className?: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ children, className = '' }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-sm text-green-600 dark:text-green-400 flex items-center gap-1 ${className}`}
    >
      <CheckCircle className="w-4 h-4" />
      {children}
    </motion.p>
  );
};

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const FormActions: React.FC<FormActionsProps> = ({ 
  children, 
  className = '',
  align = 'right'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex items-center gap-3 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

// Attach compound components
Form.Field = FormField;
Form.Input = FormInput;
Form.Label = FormLabel;
Form.Error = FormError;
Form.Success = FormSuccess;
Form.Group = FormGroup;
Form.Actions = FormActions;
Form.PasswordInput = FormPasswordInput;

export default Form;
