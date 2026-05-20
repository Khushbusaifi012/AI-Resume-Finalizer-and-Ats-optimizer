"use client";

import { useEffect } from "react";

interface AlertToastProps {
  message: string;
  onClose: () => void;
}

export default function AlertToast({ message, onClose }: AlertToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      role="alert"
      className="toast-pop fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-3.5 shadow-lg shadow-red-200/50 dark:border-red-800 dark:bg-red-950 dark:shadow-red-950/50"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        !
      </span>
      <p className="flex-1 pt-0.5 text-sm font-medium text-red-800 dark:text-red-200">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 rounded-lg p-1 text-red-500 transition hover:bg-red-100 dark:hover:bg-red-900"
      >
        ✕
      </button>
    </div>
  );
}
