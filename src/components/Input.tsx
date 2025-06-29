import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'center' | 'large';
  icon?: LucideIcon;
  actionButton?: {
    icon: LucideIcon;
    onClick: () => void;
    title?: string;
  };
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = 'default', className = '', icon: Icon, actionButton, ...props }, ref) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50";
    
    const variantClasses = {
      default: "",
      center: "text-center text-2xl font-bold tracking-widest",
      large: "text-xl"
    };

    const hasRightElement = Icon || actionButton;
    const rightPadding = hasRightElement ? (variant === 'center' ? 'px-12' : 'pr-12') : '';

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-white text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`${baseClasses} ${variantClasses[variant]} ${rightPadding} ${className}`}
            {...props}
          />
          {Icon && (
            <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          )}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-md p-1.5 transition-colors"
              title={actionButton.title}
            >
              <actionButton.icon className="w-4 h-4 text-white/80" />
            </button>
          )}
        </div>
        {error && (
          <div className="bg-red-500 border border-none rounded-lg p-3">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 