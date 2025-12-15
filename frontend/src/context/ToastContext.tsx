import { useState, createContext, useContext } from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

interface Toast {
    id: string;
    title: string;
    description?: string;
    type?: "success" | "error" | "info";
    duration?: number; // Duration in ms, 0 for persistent
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { ...toast, id }]);

        // Default duration 5000ms. If duration is 0, it's persistent (no timeout).
        const duration = toast.duration !== undefined ? toast.duration : 5000;

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex w-80 items-start gap-4 rounded-lg bg-background p-4 shadow-lg border animate-in slide-in-from-right-full",
                            toast.type === "error" && "border-red-500",
                            toast.type === "success" && "border-green-500"
                        )}
                    >
                        <div className="flex-1">
                            <h3 className="font-semibold">{toast.title}</h3>
                            {toast.description && (
                                <p className="text-sm text-muted-foreground">{toast.description}</p>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};
