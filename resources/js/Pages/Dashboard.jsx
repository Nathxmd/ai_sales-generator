import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ stats }) {
    const user = usePage().props.auth.user;

    const statCards = [
        {
            label: 'Total Pages',
            value: stats?.total ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
            gradient: 'from-accent-violet/20 to-accent-indigo/20',
            iconColor: 'text-accent-violet',
        },
        {
            label: 'Generated',
            value: stats?.generated ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-emerald-500/20 to-teal-500/20',
            iconColor: 'text-emerald-400',
        },
        {
            label: 'Pending',
            value: stats?.pending ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-amber-500/20 to-orange-500/20',
            iconColor: 'text-amber-400',
        },
        {
            label: 'Failed',
            value: stats?.failed ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            ),
            gradient: 'from-red-500/20 to-rose-500/20',
            iconColor: 'text-red-400',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="orb orb-violet w-[500px] h-[500px] -top-64 -right-64 animate-float opacity-50" />
                <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 -left-32 animate-float-slow opacity-30" />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                    {/* Welcome Hero */}
                    <div className="mb-10 animate-fade-in-up">
                        <p className="text-sm font-medium text-accent-violet mb-2">
                            Welcome back
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                            Hello, <span className="gradient-text">{user.name}</span>
                        </h1>
                        <p className="text-dark-200 max-w-lg">
                            Transform your product ideas into high-converting sales pages powered by AI. Ready to create something amazing?
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger-children">
                        {statCards.map((stat, i) => (
                            <div key={i} className="glass-card p-5">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center ${stat.iconColor} mb-3`}>
                                    {stat.icon}
                                </div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-dark-300 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Cards */}
                    <div className="grid sm:grid-cols-2 gap-6 stagger-children">
                        {/* Create New */}
                        <Link
                            href={route("pages.create")}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 transition-all duration-300 hover:border-accent-violet/30 hover:shadow-lg hover:shadow-accent-violet/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 to-accent-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-indigo flex items-center justify-center mb-5 shadow-lg shadow-accent-violet/20 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Create New Page</h3>
                                <p className="text-dark-200 text-sm leading-relaxed mb-4">
                                    Enter your product details and let Gemini AI craft a stunning, high-converting sales page in seconds.
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-violet group-hover:gap-2.5 transition-all">
                                    Get Started
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>

                        {/* View History */}
                        <Link
                            href={route("pages.history")}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 transition-all duration-300 hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center mb-5 shadow-lg shadow-accent-cyan/20 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">My Sales Pages</h3>
                                <p className="text-dark-200 text-sm leading-relaxed mb-4">
                                    Browse, manage, and export your previously generated sales pages. Regenerate or refine anytime.
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan group-hover:gap-2.5 transition-all">
                                    View History
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Keyboard shortcuts hint */}
                    <div className="mt-10 glass-card p-5 animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <svg className="w-5 h-5 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            <h3 className="text-sm font-medium text-white">Quick Tips</h3>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm text-dark-200">
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-dark-100 font-mono">Tip</span>
                                <span>Be specific with product descriptions for better results</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-dark-100 font-mono">Tip</span>
                                <span>Use comma-separated features for clearer AI output</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-dark-100 font-mono">Tip</span>
                                <span>You can regenerate pages anytime for new variations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
