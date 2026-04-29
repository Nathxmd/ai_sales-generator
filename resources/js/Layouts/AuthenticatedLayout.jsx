import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Toast from "@/Components/Toast";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const currentRoute = route().current();

    const navLinks = [
        { name: 'Dashboard', route: 'dashboard' },
        { name: 'Create', route: 'pages.create' },
        { name: 'History', route: 'pages.history' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />

            {/* Navbar */}
            <header className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="flex h-14 items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-accent-700 flex items-center justify-center text-white font-semibold text-xs">
                                    AI
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:block">
                                    Sales Generator
                                </span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.route}
                                        href={route(link.route)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                            currentRoute === link.route
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                                >
                                    <div className="h-7 w-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:block font-medium text-gray-700">{user.name}</span>
                                    <svg className={`w-3.5 h-3.5 text-gray-400 hidden md:block transition ${userOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                                            <div className="px-3 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href={route("profile.edit")}
                                                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                                            >
                                                Profile
                                            </Link>
                                            <form method="POST" action={route("logout")}>
                                                <button
                                                    type="submit"
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                                >
                                                    Log out
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    {mobileOpen ? (
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
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.route}
                                    href={route(link.route)}
                                    className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                                        currentRoute === link.route
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                <Link href={route("profile.edit")} className="block px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">
                                    Profile
                                </Link>
                                <form method="POST" action={route("logout")}>
                                    <button type="submit" className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition">
                                        Log out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page header */}
            {header && (
                <div className="bg-white border-b border-gray-200">
                    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
                        {typeof header === 'string' ? (
                            <h1 className="text-lg font-semibold text-gray-900">{header}</h1>
                        ) : (
                            header
                        )}
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {children}
            </main>
        </div>
    );
}
