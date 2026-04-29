import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

const statusConfig = {
    generated: {
        badge: 'badge-success',
        label: 'Generated',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        ),
    },
    pending: {
        badge: 'badge-warning',
        label: 'Pending',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
        ),
    },
    failed: {
        badge: 'badge-danger',
        label: 'Failed',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        ),
    },
};

export default function History({ pages, filters }) {
    const { data, setData, get } = useForm({ search: filters?.search || "" });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("pages.history"), { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Delete this page? This action cannot be undone.")) {
            router.delete(route("pages.destroy", id));
        }
    };

    const handleRegenerate = (id) => {
        if (confirm("Regenerate AI content? Current content will be replaced.")) {
            router.post(route("pages.regenerate", id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Sales Pages" />

            <div className="relative overflow-hidden">
                <div className="orb orb-cyan w-[350px] h-[350px] -top-48 -right-48 animate-float opacity-30" />

                <div className="max-w-6xl mx-auto py-10 px-4 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                My <span className="gradient-text">Sales Pages</span>
                            </h1>
                            <p className="text-dark-300 text-sm">
                                {pages.total ?? pages.data.length} page{(pages.total ?? pages.data.length) !== 1 ? 's' : ''} created
                            </p>
                        </div>
                        <Link
                            href={route("pages.create")}
                            className="gradient-btn flex items-center gap-2 text-sm self-start"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Page
                        </Link>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) => setData("search", e.target.value)}
                                placeholder="Search by product name..."
                                className="glass-input pl-11 pr-24"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-sm text-white rounded-lg transition font-medium"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Content */}
                    {pages.data.length === 0 ? (
                        /* Empty State */
                        <div className="glass-card p-16 text-center animate-scale-in">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-violet/20 to-accent-indigo/20 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h3.75M9 21h6m-6-9h6m-3-6v6m12 0a9 9 0 11-18 0" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No sales pages yet</h3>
                            <p className="text-dark-300 mb-6 max-w-sm mx-auto">
                                Create your first AI-powered sales page and watch the magic happen.
                            </p>
                            <Link href={route("pages.create")} className="gradient-btn inline-flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Generate Your First Page
                            </Link>
                        </div>
                    ) : (
                        /* Cards Grid */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                            {pages.data.map((page) => {
                                const status = statusConfig[page.status] || statusConfig.pending;
                                return (
                                    <div
                                        key={page.id}
                                        className="glass-card-hover p-5 flex flex-col"
                                    >
                                        {/* Top: Status + Date */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`badge ${status.badge}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                            <span className="text-xs text-dark-400">
                                                {new Date(page.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                            {page.product_name}
                                        </h3>

                                        {/* Preview snippet */}
                                        {page.generated_content?.headline && (
                                            <p className="text-sm text-dark-300 mb-4 line-clamp-2 flex-1">
                                                "{page.generated_content.headline}"
                                            </p>
                                        )}
                                        {!page.generated_content?.headline && (
                                            <p className="text-sm text-dark-400 italic mb-4 flex-1">
                                                No preview available
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                            <Link
                                                href={route("pages.show", page.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-lg transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleRegenerate(page.id)}
                                                className="px-3 py-2 text-sm text-accent-violet hover:bg-accent-violet/10 rounded-lg transition tooltip"
                                                data-tip="Regenerate"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition tooltip"
                                                data-tip="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pages.links && pages.links.length > 3 && (
                        <div className="flex justify-center items-center gap-1.5 mt-8">
                            {pages.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                        link.active
                                            ? "gradient-btn !py-1.5 !px-3"
                                            : link.url
                                            ? "text-dark-200 hover:text-white hover:bg-white/[0.06]"
                                            : "text-dark-500 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
