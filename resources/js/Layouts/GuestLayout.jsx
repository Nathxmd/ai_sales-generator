import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo.webp"
                        alt="Logo"
                        className="mx-auto h-24 w-auto"
                    />
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                        AI Sales Page Generator
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Generate high-converting sales pages in seconds.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-8">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Laravel · Inertia · React · Gemini AI
                </p>
            </div>
        </div>
    );
}
