export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
