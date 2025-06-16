import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "success", message }) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useCustomToast must be used within ToastProvider");
  }
  return context.addToast;
};

export const useToastState = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastState must be used within ToastProvider");
  }
  return context.toasts;
};
