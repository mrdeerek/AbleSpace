import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    CheckSquare,
    Clock,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "My Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Overdue", href: "/overdue", icon: Clock },
        { name: "Profile", href: "/profile", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                    <div className="font-bold text-xl text-primary">TaskMaster</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex flex-col h-full">
                        <div className="h-16 flex items-center px-6 border-b gap-3">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                            <h1 className="text-2xl font-bold text-primary">TaskMaster</h1>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="px-2 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={cn(
                                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                                location.pathname === item.href
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex items-center mb-4 px-2">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                                    {user?.name?.[0] || "U"}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate w-32">{user?.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background/50 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
