import { useState } from "react";
import { Filter, CheckSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { TaskList } from "../components/tasks/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { Priority, Status } from "../types/task";
import type { Task } from "../types/task";

export default function MyTasks() {
    const { user } = useAuth();

    // Local filter states
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Initialize socket listener
    useSocket();

    // Fetch all tasks
    const { data: allTasks, isLoading } = useTasks();

    const filterTasks = (tasks: Task[] | undefined) => {
        if (!tasks) return [];
        const filtered = tasks.filter(task => {
            const matchesStatus = statusFilter ? task.status === statusFilter : true;
            const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
            return matchesStatus && matchesPriority;
        });

        return filtered.sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    };

    // Filter for My Tasks (Assigned to current user)
    const myTasks = filterTasks(allTasks?.filter(t => t.assignedToId === user?.id));

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
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <CheckSquare className="h-8 w-8 text-primary" />
                            My Tasks
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Tasks assigned specifically to you.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card/30">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        Filters:
                    </div>

                    <select
                        className="text-sm bg-background border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(Status).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">Due Date: Soonest</option>
                        <option value="desc">Due Date: Latest</option>
                    </select>

                    {(statusFilter || priorityFilter) && (
                        <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(""); setPriorityFilter(""); }}>
                            Clear
                        </Button>
                    )}
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {myTasks.length} tasks
                    </div>
                    <TaskList tasks={myTasks} isLoading={isLoading} emptyMessage="You have no tasks assigned to you. Enjoy the free time!" />
                </div>
            </div>
        </div>
    );
}
