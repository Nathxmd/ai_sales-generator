import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Decorative background orbs */}
            <div className="orb orb-violet w-[400px] h-[400px] -top-48 -left-48 animate-float" />
            <div className="orb orb-indigo w-[350px] h-[350px] -bottom-40 -right-40 animate-float-slow" />
            <div className="orb orb-cyan w-[200px] h-[200px] top-1/3 right-1/4 animate-float" style={{ animationDelay: '2s' }} />

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="w-full max-w-md relative z-10 animate-scale-in">
                <div className="glass-card overflow-hidden">
                    <div className="px-8 pt-10 pb-8">
                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <Link href="/" className="group">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-indigo flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-accent-violet/20 group-hover:shadow-accent-violet/40 transition-shadow duration-300">
                                    AI
                                </div>
                            </Link>
                            <h2 className="mt-4 text-xl font-bold text-white">AI Sales Generator</h2>
                            <p className="mt-1 text-sm text-dark-200">Create stunning sales pages with AI</p>
                        </div>

                        <div className="space-y-6">{children}</div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] text-center">
                        <p className="text-xs text-dark-300">
                            Built with Laravel • Inertia • React • Gemini AI
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
