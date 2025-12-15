import { useState } from "react";
import { format } from "date-fns";
import { Calendar, User as UserIcon, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { Priority, Status } from "../../types/task";
import type { Task } from "../../types/task";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { EditTaskModal } from "./EditTaskModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TaskCardProps {
    task: Task;
}

const priorityColors = {
    [Priority.LOW]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [Priority.MEDIUM]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [Priority.HIGH]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [Priority.URGENT]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusColors = {
    [Status.TODO]: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    [Status.IN_PROGRESS]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    [Status.REVIEW]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [Status.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export function TaskCard({ task }: TaskCardProps) {
    const { mutate: updateTask } = useUpdateTask();
    const { mutate: deleteTask } = useDeleteTask();
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleStatusChange = (newStatus: Status) => {
        updateTask({ id: task._id, updates: { status: newStatus } });
    };

    const isCreator = user?.id === task.creatorId;

    return (
        <>
            <Card className="hover:shadow-md transition-shadow group relative">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1 pr-8">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", priorityColors[task.priority])}>
                                {task.priority}
                            </span>
                            <CardTitle className="text-lg font-bold leading-tight mt-2">{task.title}</CardTitle>
                        </div>
                    </div>
                    {/* Action Menu (Top Right) */}
                    {isCreator && (
                        <div className="absolute top-3 right-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteTask(task._id)} className="text-red-600 focus:text-red-500">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3rem]">
                        {task.description}
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.dueDate), "MMM d, yyyy h:mm a")}
                        </div>
                        <div className="flex items-center gap-2">
                            <UserIcon className="h-3 w-3" />
                            {task.assignedToId === user?.id ? "Assigned to You" : "Assigned to others"}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0 justify-between items-center">
                    <div className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[task.status])}>
                        {task.status.replace("_", " ")}
                    </div>

                    <select
                        className="text-xs border rounded p-1 bg-transparent focus:ring-1 focus:ring-primary"
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value as Status)}
                    >
                        {Object.values(Status).map(s => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                    </select>
                </CardFooter>
            </Card>

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={task}
            />
        </>
    );
}
