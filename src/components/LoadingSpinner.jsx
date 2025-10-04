export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-16 h-16',
    }
  
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div
          className={`${sizes[size]} border-4 border-medium/20 border-t-accent rounded-full animate-spin`}
        ></div>
      </div>
    )
  }
  