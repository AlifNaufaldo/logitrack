'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import s from '../warehouse.module.css';

export type ToastType = 'info' | 'success' | 'warning' | 'danger';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={s.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${s.toast} ${s[toast.type]}`}>
            <div className={s.toastIcon}>
              {toast.type === 'danger' && <AlertCircle size={18} color="#EF4444" />}
              {toast.type === 'warning' && <AlertTriangle size={18} color="#F59E0B" />}
              {toast.type === 'success' && <CheckCircle size={18} color="#10B981" />}
              {toast.type === 'info' && <Info size={18} color="#0EA5E9" />}
            </div>
            <div className={s.toastContent}>
              <div className={s.toastTitle}>{toast.title}</div>
              <div className={s.toastMessage}>{toast.message}</div>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
