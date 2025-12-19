import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckSquare, Clock, LayoutDashboard, Shield, Zap, Users, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navigation */}
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        {/* You might want to use the actual Logo component or img here if available */}
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center relative shadow-sm overflow-hidden border border-gray-200">
                            <Hexagon className="h-6 w-6 text-primary fill-primary/10" strokeWidth={2.5} />
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-primary pt-0.5">T</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">AbleSpace</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link to="/register">
                            <Button>Sign up</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
                    <div className="container max-w-5xl mx-auto text-center space-y-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Master Your Workflow <br /> with AbleSpace
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            Streamline your tasks, collaborate with your team, and never miss a deadline again.
                            The modern space for able teams.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        >
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                                    Get Started for Free
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                                    Live Demo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Abstract UI representation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="mt-16 mx-auto max-w-4xl p-2 bg-gradient-to-b from-border to-background rounded-xl"
                        >
                            <div className="bg-card rounded-lg border shadow-2xl overflow-hidden aspect-video relative group">
                                <img
                                    src="/dashboard-preview.png"
                                    alt="Dashboard Preview"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                    <p className="text-white font-medium bg-primary/90 px-4 py-2 rounded-full backdrop-blur-sm">
                                        Experience the future of work
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-card/50">
                    <div className="container max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold mb-4"
                            >
                                Everything you need to succeed
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-muted-foreground text-lg max-w-2xl mx-auto"
                            >
                                AbleSpace provides all the tools you need to manage your projects effectively without the clutter.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<LayoutDashboard className="h-10 w-10 text-primary" />}
                                title="Intuitive Dashboard"
                                description="Get a bird's eye view of your projects with our customizable dashboard."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<CheckSquare className="h-10 w-10 text-primary" />}
                                title="Task Management"
                                description="Create, assign, and track tasks with ease. Drag and drop to organize."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Clock className="h-10 w-10 text-primary" />}
                                title="Real-time Tracking"
                                description="Monitor progress in real-time and stay ahead of your deadlines."
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={<Users className="h-10 w-10 text-primary" />}
                                title="Team Collaboration"
                                description="Work together seamlessly with built-in comments and file sharing."
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={<Zap className="h-10 w-10 text-primary" />}
                                title="Lightning Fast"
                                description="Built for speed and performance, so you can focus on what matters."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={<Shield className="h-10 w-10 text-primary" />}
                                title="Secure & Reliable"
                                description="Enterprise-grade security to keep your data safe and accessible."
                                delay={0.6}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="container max-w-5xl mx-auto bg-primary rounded-3xl p-12 md:p-24 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to boost your productivity?</h2>
                            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of teams who trust AbleSpace to deliver projects on time.
                            </p>
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                    Start Your Free Trial
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="border-t py-12 bg-background">
                <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-white flex items-center justify-center relative shadow-sm overflow-hidden border border-gray-200">
                            <Hexagon className="h-5 w-5 text-primary fill-primary/10" strokeWidth={2.5} />
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-primary pt-0.5">T</span>
                        </div>
                        <span className="font-bold text-lg">AbleSpace</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AbleSpace. All rights reserved.
                    </p>

                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors group"
        >
            <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    );
}
