import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-lg bg-accent-700 flex items-center justify-center text-white font-semibold text-sm">
                            AI
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Sales Generator</span>
                    </Link>
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
