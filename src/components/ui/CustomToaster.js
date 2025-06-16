import React from "react";
import { useToastState } from "./toast-context";

const CustomToaster = () => {
  const toasts = useToastState();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default CustomToaster;
