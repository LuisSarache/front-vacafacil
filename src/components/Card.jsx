export const Card = ({ children, className = '', variant = "default", ...props }) => {
  const variants = {
    default: "bg-white backdrop-blur-sm border border-medium/20 shadow-xl",
    dark: "bg-dark text-white",
    amber: "bg-accent/10 border border-accent/20",
  };

  return (
    <div
      className={`shadow-lg p-4 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
