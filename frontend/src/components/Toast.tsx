import { Toaster, toast } from "react-hot-toast";

export function ToastContainer() {
  return <Toaster position="top-right" toastOptions={{ duration: 3000 }} />;
}

export const pushToast = (message: string, type?: "success" | "error") => {
  if (type === "error") return toast.error(message);
  return toast.success(message);
};
