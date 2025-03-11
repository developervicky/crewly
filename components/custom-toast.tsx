"use client";

import { toast } from "react-hot-toast";

type ToastVariant = "success" | "error" | "info" | "warning";

interface CustomToastProps {
  variant: ToastVariant;
  message: string;
}

const CustomToast = ({ variant, message }: CustomToastProps) => {
  const showToast = () => {
    switch (variant) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast(message, { icon: "ℹ️" });
        break;
      case "warning":
        toast(message, { icon: "⚠️" });
        break;
      default:
        toast(message);
    }
  };

  return showToast(), null;
};

export default CustomToast;
