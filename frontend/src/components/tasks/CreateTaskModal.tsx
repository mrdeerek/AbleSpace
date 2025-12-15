import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTask } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Priority } from "../../types/task";

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    priority: z.nativeEnum(Priority),
    assignedToId: z.string().min(1, "Assignee is required"),
});

type CreateTaskValues = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
    const { mutate: createTask, isPending } = useCreateTask();
    const { data: users } = useUsers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            priority: Priority.MEDIUM,
        }
    });

    const onSubmit = (data: CreateTaskValues) => {
        createTask(data, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} placeholder="Task title" />
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
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
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input type="datetime-local" id="dueDate" {...register("dueDate")} />
                        {errors.dueDate && (
                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <select
                            id="priority"
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
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <select
                        id="assignedTo"
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
                        {isPending ? "Creating..." : "Create Task"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
