import { useState } from "react";
import { Filter, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
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
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary">
                                <CheckSquare className="h-8 w-8" />
                            </span>
                            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                My Tasks
                            </span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Stay on top of your assigned work.
                        </p>
                    </div>
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

                {/* Task List */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 p-2 rounded-lg border border-border/40">
                        <span className="pl-2">Showing {myTasks.length} tasks assigned to you</span>
                    </div>
                    <TaskList tasks={myTasks} isLoading={isLoading} emptyMessage="You have no tasks assigned to you. Enjoy the free time!" />
                </motion.div>
            </div>
        </motion.div>
    );
}
