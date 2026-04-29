import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Toast from "@/Components/Toast";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const currentRoute = route().current();

    const navLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        )},
        { name: 'Create', route: 'pages.create', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
        )},
        { name: 'History', route: 'pages.history', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
    ];

    return (
        <div className="min-h-screen bg-dark-900">
            <Toast />

            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-indigo flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-accent-violet/20 group-hover:shadow-accent-violet/40 transition-all duration-300 group-hover:scale-105">
                                    AI
                                </div>
                                <span className="text-base font-semibold text-white hidden sm:block">
                                    Sales<span className="text-dark-200 font-normal ml-0.5">Gen</span>
                                </span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => {
                                    const isActive = currentRoute === link.route;
                                    return (
                                        <Link
                                            key={link.route}
                                            href={route(link.route)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-white/[0.08] text-white'
                                                    : 'text-dark-200 hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            {link.icon}
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right: User */}
                        <div className="flex items-center gap-3">
                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-violet/30 to-accent-indigo/30 border border-white/10 flex items-center justify-center text-white text-xs font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:flex flex-col text-left">
                                        <span className="text-sm font-medium text-white leading-none">{user.name}</span>
                                        <span className="text-xs text-dark-300 leading-none mt-0.5">{user.email}</span>
                                    </div>
                                    <svg className={`w-4 h-4 text-dark-300 transition-transform duration-200 hidden md:block ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-56 glass-card p-1.5 z-50 animate-fade-in-down">
                                            <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                                                <p className="text-sm font-medium text-white">{user.name}</p>
                                                <p className="text-xs text-dark-300 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href={route("profile.edit")}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-100 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                Profile
                                            </Link>
                                            <form method="POST" action={route("logout")}>
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="md:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-dark-200 hover:text-white transition"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    {open ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {open && (
                    <div className="md:hidden border-t border-white/[0.06] bg-dark-800/95 backdrop-blur-xl animate-fade-in-down">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(link => {
                                const isActive = currentRoute === link.route;
                                return (
                                    <Link
                                        key={link.route}
                                        href={route(link.route)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-white/[0.08] text-white'
                                                : 'text-dark-200 hover:text-white hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <div className="border-t border-white/[0.06] mt-2 pt-2">
                                <Link
                                    href={route("profile.edit")}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-200 hover:text-white hover:bg-white/[0.04] transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    Profile
                                </Link>
                                <form method="POST" action={route("logout")}>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page header */}
            {header && (
                <div className="border-b border-white/[0.04]">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {typeof header === 'string' ? (
                            <h1 className="text-xl font-semibold text-white">{header}</h1>
                        ) : (
                            header
                        )}
                    </div>
                </div>
            )}

            <main>
                {children}
            </main>
        </div>
    );
}
