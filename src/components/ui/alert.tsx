import React from 'react';
import cn from 'classnames';

interface AlertProps {
  message: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
  childClassName?: string;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  message,
  variant = 'info',
  className,
  childClassName,
  children,
}) => {
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  };

  return (
    <div className={cn('border p-4', variants[variant], className)}>
      <div className={cn(childClassName)}>
        <span>{message}</span>
        {children}
      </div>
    </div>
  );
};

export default Alert;