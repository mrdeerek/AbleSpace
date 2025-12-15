import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/task";

export interface TaskFilters {
    type?: 'assigned' | 'created';
    status?: string;
    priority?: string;
    overdue?: boolean;
}

export function useTasks(filters?: TaskFilters) {
    return useQuery({
        queryKey: ["tasks", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.type) params.append("type", filters.type);
            if (filters?.status) params.append("status", filters.status);
            if (filters?.priority) params.append("priority", filters.priority);
            if (filters?.overdue) params.append("overdue", "true");

            const { data } = await api.get<Task[]>(`/tasks?${params.toString()}`);
            return data;
        },
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask: CreateTaskDto) => {
            const { data } = await api.post<Task>("/tasks", newTask);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: UpdateTaskDto }) => {
            const { data } = await api.patch<Task>(`/tasks/${id}`, updates);
            return data;
        },
        // 🚀 Optimistic UI Update
        onMutate: async ({ id, updates }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks", undefined]); // Note: This might be partial if we have filters. 
            // Better strategy: Invalidate all 'tasks' keys, but we can try to update strictly.
            // For simplicity in this demo, accessing specific keys is hard without context, 
            // so we'll access the active query if possible, or just standard "tasks".

            // We'll iterate over all "tasks" queries in the cache to update them
            queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: Task[] | undefined) => {
                if (!old) return [];
                return old.map(task =>
                    task._id === id ? { ...task, ...updates } : task
                );
            });

            return { previousTasks };
        },
        onError: (_err, _newTodo, context) => {
            // Rollback on error
            // We can't easily rollback all queries with specific previous data without a more complex structure,
            // but commonly we just invalidate. For true optimistic rollback:
            if (context?.previousTasks) {
                // This assumes only the main list was modified. 
                // In a production app with many filter keys, we'd need a more robust rollback map.
                // Resetting to base state:
                queryClient.setQueriesData({ queryKey: ["tasks"] }, context.previousTasks);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}
