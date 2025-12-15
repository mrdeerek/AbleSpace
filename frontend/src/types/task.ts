export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export enum Status {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    COMPLETED = "COMPLETED",
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    assignedToId: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
    status?: Status;
    assignedToId?: string;
}
