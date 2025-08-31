import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  setToast: (toast: ToastMessage) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, setToast }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (toast) {
      setAnimationClass('toast-in');
      const timer = setTimeout(() => {
        setAnimationClass('toast-out');
        setTimeout(() => setToast(null), 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertTriangle;
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm p-4 rounded-lg shadow-2xl text-white ${bgColor} ${animationClass}`}>
      <div className="flex items-center">
        <Icon className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="font-semibold">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
