import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  as?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  as,
  rows,
  required = false,
  className = '',
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        {as === 'textarea' ? (
          <Field
            as="textarea"
            id={name}
            name={name}
            rows={rows || 3}
            placeholder={placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                    transition-all duration-150 ease-in-out
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                    placeholder:text-gray-400"
          />
        ) : (
          <Field
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                    transition-all duration-150 ease-in-out
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                    placeholder:text-gray-400"
          />
        )}
      </div>
      
      <ErrorMessage 
        name={name} 
        component="div" 
        className="text-red-500 text-xs mt-1 font-medium" 
      />
    </div>
  );
};

export default FormField;