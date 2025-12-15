import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateTask } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Priority } from "../../types/task";
import type { Task } from "../../types/task";
import { format } from "date-fns";

const editTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    priority: z.nativeEnum(Priority),
    assignedToId: z.string().min(1, "Assignee is required"),
});

type EditTaskValues = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
    const { mutate: updateTask, isPending } = useUpdateTask();
    const { data: users } = useUsers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditTaskValues>({
        resolver: zodResolver(editTaskSchema),
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                // Format date for datetime-local input
                dueDate: format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm"),
                priority: task.priority,
                assignedToId: task.assignedToId,
            });
        }
    }, [task, reset]);

    const onSubmit = (data: EditTaskValues) => {
        if (!task) return;
        updateTask(
            { id: task._id, updates: data },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input id="edit-title" {...register("title")} placeholder="Task title" />
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <textarea
                        id="edit-description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Task description"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-dueDate">Due Date</Label>
                        <Input type="datetime-local" id="edit-dueDate" {...register("dueDate")} />
                        {errors.dueDate && (
                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-priority">Priority</Label>
                        <select
                            id="edit-priority"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("priority")}
                        >
                            {Object.values(Priority).map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        {errors.priority && (
                            <p className="text-sm text-destructive">{errors.priority.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-assignedTo">Assign To</Label>
                    <select
                        id="edit-assignedTo"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("assignedToId")}
                    >
                        <option value="">Select a user</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {errors.assignedToId && (
                        <p className="text-sm text-destructive">{errors.assignedToId.message}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
