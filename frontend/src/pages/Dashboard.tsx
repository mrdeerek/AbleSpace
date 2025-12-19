import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
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
    const overdueTasks = filterTasks(allTasks?.filter(t => new Date(t.dueDate) < new Date() && t.status !== Status.COMPLETED && t.assignedToId === user?.id));

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-10 min-h-full"
        >
            <div className="p-6 md:p-8 space-y-8">
                <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Here's your overview.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="shrink-0 bg-primary/90 hover:bg-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                        size="lg"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Create Task
                    </Button>
                </motion.div>

                {/* Filters */}
                <motion.div
                    variants={item}
                    className="flex flex-wrap gap-4 p-5 border border-border/50 rounded-xl bg-card/30 backdrop-blur-xl shadow-sm"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <Filter className="h-4 w-4" />
                        Filters
                    </div>
                    <div className="h-4 w-px bg-border/50 mx-2 hidden sm:block" />

                    <select
                        className="text-sm bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-background/80"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(Status).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-background/80"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-background/80"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">Due Date: Soonest</option>
                        <option value="desc">Due Date: Latest</option>
                    </select>

                    {(statusFilter || priorityFilter) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setStatusFilter(""); setPriorityFilter(""); }}
                            className="ml-auto hover:bg-destructive/10 hover:text-destructive"
                        >
                            Clear Filters
                        </Button>
                    )}
                </motion.div>

                <div className="space-y-10">
                    {/* Overdue Section - High Priority Visibility */}
                    {overdueTasks.length > 0 && (
                        <motion.div variants={item} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    Attention Needed
                                </h2>
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                                    {overdueTasks.length} Overdue
                                </span>
                            </div>
                            <div className="border-l-2 border-red-500/50 pl-4 py-1">
                                <TaskList tasks={overdueTasks} isLoading={isLoading} emptyMessage="No overdue tasks." />
                            </div>
                        </motion.div>
                    )}

                    {/* My Tasks Section */}
                    <motion.div variants={item} className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                {assignedTasks.length}
                            </span>
                        </div>
                        <TaskList tasks={assignedTasks} isLoading={isLoading} emptyMessage="You have no tasks assigned to you. Enjoy the free time!" />
                    </motion.div>

                    {/* Created By Me Section */}
                    <motion.div variants={item} className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">Created By Me</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-semibold border border-border/50">
                                {createdTasks.length}
                            </span>
                        </div>
                        <div className="opacity-90 hover:opacity-100 transition-opacity">
                            <TaskList tasks={createdTasks} isLoading={isLoading} emptyMessage="You haven't created any tasks yet." />
                        </div>
                    </motion.div>
                </div>

                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </div>
        </motion.div>
    );
}
