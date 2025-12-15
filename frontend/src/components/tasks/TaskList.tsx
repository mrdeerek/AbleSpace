import type { Task } from "../../types/task";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    emptyMessage?: string;
}

export function TaskList({ tasks, isLoading, emptyMessage = "No tasks found." }: TaskListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse bg-muted" />
                ))}
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-card/50 border-dashed">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
            ))}
        </div>
    );
}
