import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className = '' 
}) => {
  return (
    <div className={`bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 mb-8 ${className}`}>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="text-gray-500 mt-1 text-sm">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormSection;