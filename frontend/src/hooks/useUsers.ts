import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface User {
    id: string;
    name: string;
    email: string;
}

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<User[]>("/users");
            return data;
        },
    });
}
