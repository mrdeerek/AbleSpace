import { useState } from "react";
import { Filter, Clock, AlertTriangle, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { TaskList } from "../components/tasks/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { Priority, Status } from "../types/task";
import type { Task } from "../types/task";

export default function OverdueTasks() {
    // Local filter states - removing Status filter for "Completed" as it contradicts "Overdue" usually, 
    // but keeping others. Actually, overdue tasks are by definition NOT completed.
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Initialize socket listener
    useSocket();

    const { user } = useAuth();

    // Fetch all tasks
    const { data: allTasks, isLoading } = useTasks();

    const filterTasks = (tasks: Task[] | undefined) => {
        if (!tasks) return [];
        const filtered = tasks.filter(task => {
            // Overdue Logic: Due Date < Now AND Status != Completed AND Assigned to Me
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;
            const isAssignedToMe = task.assignedToId === user?.id;

            if (!isOverdue || !isAssignedToMe) return false;

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
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-red-500">
                            <span className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <Clock className="h-8 w-8" />
                            </span>
                            Overdue Tasks
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            These tasks have passed their due date.
                        </p>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    variants={item}
                    className="flex flex-wrap gap-4 p-5 border border-red-500/20 rounded-xl bg-red-500/5 backdrop-blur-xl shadow-sm"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                        <Filter className="h-4 w-4" />
                        Filters
                    </div>
                    <div className="h-4 w-px bg-red-500/20 mx-2 hidden sm:block" />

                    <select
                        className="text-sm bg-background/50 border border-red-500/20 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all hover:bg-background/80"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        className="text-sm bg-background/50 border border-red-500/20 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all hover:bg-background/80"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">Due Date: Soonest</option>
                        <option value="desc">Due Date: Latest</option>
                    </select>

                    {priorityFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPriorityFilter("")}
                            className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-500/10"
                        >
                            Clear Filters
                        </Button>
                    )}
                </motion.div>

                {/* Task List */}
                <motion.div variants={item} className="space-y-6">
                    {overdueTasks.length > 0 ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-base border border-red-500/20 shadow-sm">
                            <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" />
                            <span>
                                <strong>Action Required:</strong> You have {overdueTasks.length} overdue tasks pending. Please resolve them as soon as possible.
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-base border border-green-500/20 shadow-sm">
                            <CheckSquare className="h-5 w-5 shrink-0" />
                            <span>
                                <strong>Great Job!</strong> You have no overdue tasks. Keep up the good work!
                            </span>
                        </div>
                    )}

                    <div className="border-l-4 border-red-500/30 pl-4">
                        <TaskList tasks={overdueTasks} isLoading={isLoading} emptyMessage="No overdue tasks found." />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
