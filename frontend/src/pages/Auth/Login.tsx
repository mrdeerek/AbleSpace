import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setSuccessMessage("Registration successful! Please sign in.");
        }
    }, [searchParams]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginValues) => {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            const response = await api.post("/auth/login", data);
            // Expected response: { user: { ... }, token: "..." }
            const { user, token } = response.data;
            login(token, user);
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: 'url("/auth-bg.png")' }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            <Card className="w-full max-w-md shadow-2xl relative z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-muted/40">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                            <span className="font-bold text-2xl text-primary">AbleSpace</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {successMessage && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                                {successMessage}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground justify-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-semibold text-primary hover:underline ml-1">
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
