import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../context/ToastContext";
import { useState } from "react";

import { motion } from "framer-motion";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function Profile() {
    const { user, login, token } = useAuth();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data: ProfileValues) => {
        setIsSaving(true);
        try {
            // Direct API call since we don't have a specific hook for this yet, 
            // ensuring we use the 'token' from context if needed, though axios interceptor handles it.
            const response = await api.put("/users/profile", data);

            // Update local context
            if (token && response.data) {
                login(token, response.data);
            }

            addToast({
                title: "Profile Updated",
                description: "Your profile information has been successfully updated.",
                type: "success",
            });
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update profile",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-full pb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto pt-10 px-4"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details here. Changes will be reflected across the workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        {...register("name")}
                                        className="bg-background/50"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="bg-background/50"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border/50">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="min-w-[120px]"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
