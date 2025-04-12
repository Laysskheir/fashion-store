import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'secondary';
  size?: 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const CoolButton: React.FC<CoolButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  size = 'lg', 
  className, 
  icon = <ArrowRight className="ml-2 h-4 w-4" />,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 hover:border-white/40",
        className
      )}
      {...props}
    >
      {children}
      {icon}
    </Button>
  );
};