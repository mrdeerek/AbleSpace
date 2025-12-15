import { useState } from "react";
import { Filter, Clock, AlertTriangle, CheckSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { TaskList } from "../components/tasks/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useSocket } from "../hooks/useSocket";
import { Priority, Status } from "../types/task";
import type { Task } from "../types/task";

export default function OverdueTasks() {
    // Local filter states - removing Status filter for "Completed" as it contradicts "Overdue" usually, 
    // but keeping others. Actually, overdue tasks are by definition NOT completed.
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Initialize socket listener
    useSocket();

    // Fetch all tasks
    const { data: allTasks, isLoading } = useTasks();

    const filterTasks = (tasks: Task[] | undefined) => {
        if (!tasks) return [];
        const filtered = tasks.filter(task => {
            // Overdue Logic: Due Date < Now AND Status != Completed
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;
            if (!isOverdue) return false;

            const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
            return matchesPriority;
        });

        return filtered.sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    };

    const overdueTasks = filterTasks(allTasks);

    return (
        <div
            className="space-y-8 animate-in fade-in duration-500 pb-10 min-h-full bg-cover bg-fixed bg-center"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.7)), url("/dashboard-bg.png")',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="p-6 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-red-600 dark:text-red-500">
                            <Clock className="h-8 w-8" />
                            Overdue Tasks
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            These tasks have passed their due date and require immediate attention.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                        <Filter className="h-4 w-4" />
                        Filters:
                    </div>

                    <select
                        className="text-sm bg-background border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">Due Date: Soonest</option>
                        <option value="desc">Due Date: Latest</option>
                    </select>

                    {priorityFilter && (
                        <Button variant="ghost" size="sm" onClick={() => setPriorityFilter("")} className="text-red-600 hover:text-red-700 hover:bg-red-100">
                            Clear
                        </Button>
                    )}
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    {overdueTasks.length > 0 ? (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm border border-red-200 dark:border-red-800">
                            <AlertTriangle className="h-4 w-4" />
                            <strong>Action Required:</strong> You have {overdueTasks.length} overdue tasks pending.
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm border border-green-200 dark:border-green-800">
                            <CheckSquare className="h-4 w-4" />
                            <strong>Great Job!</strong> You have no overdue tasks.
                        </div>
                    )}

                    <TaskList tasks={overdueTasks} isLoading={isLoading} emptyMessage="No overdue tasks found." />
                </div>
            </div>
        </div>
    );
}
