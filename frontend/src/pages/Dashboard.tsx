import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { TaskList } from "../components/tasks/TaskList";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { useTasks } from "../hooks/useTasks";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { Priority, Status } from "../types/task";
import type { Task } from "../types/task";

export default function Dashboard() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    const assignedTasks = filterTasks(allTasks?.filter(t => t.assignedToId === user?.id));
    const createdTasks = filterTasks(allTasks?.filter(t => t.creatorId === user?.id));
    const overdueTasks = filterTasks(allTasks?.filter(t => new Date(t.dueDate) < new Date() && t.status !== Status.COMPLETED));

    return (
        <div
            className="space-y-8 animate-in fade-in duration-500 pb-10 min-h-full bg-cover bg-fixed bg-center"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.7)), url("/dashboard-bg.png")',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {user?.name}. Here's what's happening.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
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

                <div className="space-y-10">
                    {/* Overdue Section - High Priority Visibility */}
                    {overdueTasks.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                                ⚠️ Overdue Tasks <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">{overdueTasks.length}</span>
                            </h2>
                            <TaskList tasks={overdueTasks} isLoading={isLoading} emptyMessage="No overdue tasks." />
                        </div>
                    )}

                    {/* My Tasks Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            My Tasks <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{assignedTasks.length}</span>
                        </h2>
                        <TaskList tasks={assignedTasks} isLoading={isLoading} emptyMessage="You have no tasks assigned to you. Enjoy the free time!" />
                    </div>

                    {/* Created By Me Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Created By Me <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{createdTasks.length}</span>
                        </h2>
                        <TaskList tasks={createdTasks} isLoading={isLoading} emptyMessage="You haven't created any tasks yet." />
                    </div>
                </div>

                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </div>
        </div>
    );
}
