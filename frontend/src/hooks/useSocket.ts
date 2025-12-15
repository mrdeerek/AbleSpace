import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const useSocket = () => {
    const { token, isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isAuthenticated && token) {
            // Backend is localhost:5000.
            const socketUrl = import.meta.env.VITE_API_URL
                ? import.meta.env.VITE_API_URL.replace('/api', '')
                : "http://localhost:5000";

            socketRef.current = io(socketUrl, {
                auth: { token },
            });

            const socket = socketRef.current;

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });

            socket.on("task:created", (newTask) => {
                console.log("Task created event:", newTask);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            });

            socket.on("task:updated", (data) => {
                console.log("Task updated event:", data);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            });

            socket.on("task:deleted", (data) => {
                console.log("Task deleted event:", data);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            });

            socket.on("task:assigned", (data) => {
                console.log("Task assigned to you:", data);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                addToast({
                    title: "New Task Assigned",
                    description: data.message,
                    type: "info",
                    duration: 0, // Persistent notification
                });
            });

            return () => {
                if (socket) socket.disconnect();
            };
        }
    }, [isAuthenticated, token, queryClient, addToast]);

    return socketRef.current;
};
