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
        <div
            className="min-h-full bg-cover bg-fixed bg-center animate-in fade-in duration-500 pb-10"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.7)), url("/profile-bg.png")',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-2xl mx-auto pt-10 px-4">
                <Card className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" {...register("name")} />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" {...register("email")} />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
