import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

const statusStyles = {
    generated: { className: 'bg-green-50 text-green-700 border-green-200', label: 'Generated' },
    pending: { className: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
    failed: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Failed' },
};

export default function History({ pages, filters }) {
    const { data, setData, get } = useForm({ search: filters?.search || "" });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("pages.history"), { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Delete this page?")) {
            router.delete(route("pages.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Sales Pages" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My sales pages</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {pages.total ?? pages.data.length} page{(pages.total ?? pages.data.length) !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    href={route("pages.create")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-700 px-4 py-2 text-sm font-medium text-white hover:bg-accent-800 transition self-start"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New page
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={data.search}
                        onChange={(e) => setData("search", e.target.value)}
                        placeholder="Search by product name..."
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none"
                    />
                    <button type="submit" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition">
                        Search
                    </button>
                </div>
            </form>

            {pages.data.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
                    <p className="text-gray-500 mb-3">No sales pages yet.</p>
                    <Link href={route("pages.create")} className="text-sm text-accent-700 hover:text-accent-800 font-medium">
                        Create your first page →
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-5 py-3 font-medium text-gray-500">Product</th>
                                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Created</th>
                                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pages.data.map((page) => {
                                const status = statusStyles[page.status] || statusStyles.pending;
                                return (
                                    <tr key={page.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-3.5 font-medium text-gray-900">{page.product_name}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                                            {new Date(page.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={route("pages.show", page.id)} className="text-accent-700 hover:text-accent-800 font-medium">
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => router.post(route("pages.regenerate", page.id))}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    Regen
                                                </button>
                                                <button onClick={() => handleDelete(page.id)} className="text-red-500 hover:text-red-700">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pages.links && pages.links.length > 3 && (
                <div className="flex justify-center gap-1 mt-6">
                    {pages.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || "#"}
                            className={`px-3 py-1.5 rounded-md text-sm transition ${
                                link.active
                                    ? "bg-accent-700 text-white"
                                    : link.url
                                    ? "text-gray-600 hover:bg-gray-100"
                                    : "text-gray-300 cursor-not-allowed"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveState
                        />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
