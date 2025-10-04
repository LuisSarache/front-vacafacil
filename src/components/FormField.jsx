import React from 'react';

export const FormField = ({
    label,
    value,
    onChange,
    placeholder = '',
    required = false,
    as = 'input',
    type = 'text',
    className = '',
    error = '',
    disabled = false,
    options = [],
    ...props
}) => {
    const Tag = as;
    const inputId = `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-dark mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {as === 'select' ? (
                <select
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`w-full px-4 py-3 bg-white border border-medium/30 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${error ? 'border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option, index) => (
                        <option key={index} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </select>
            ) : (
                <Tag
                    id={inputId}
                    type={Tag === 'input' ? type : undefined}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={Tag === 'textarea' ? 4 : undefined}
                    className={`w-full px-4 py-3 bg-white border border-medium/30 rounded-lg text-dark placeholder-medium/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${Tag === 'textarea' ? 'resize-none' : ''} ${error ? 'border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                    {...props}
                />
            )}
            
            {error && (
                <p className="text-sm text-red-600 mt-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};