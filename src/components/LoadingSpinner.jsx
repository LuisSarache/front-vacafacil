export const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-16 h-16',
    }
  
    return (
      <div className={`flex flex-col justify-center items-center gap-3 ${className}`}>
        <div
          className={`${sizes[size]} border-4 border-medium/20 border-t-accent rounded-full animate-spin`}
        ></div>
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    )
  }
  