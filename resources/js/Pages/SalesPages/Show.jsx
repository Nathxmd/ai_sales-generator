import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ page }) {
    const c = page.generated_content;
    const [regenerating, setRegenerating] = useState(false);

    const statusMeta = {
        pending: {
            icon: "⏳",
            label: "Pending",
            className: "badge-warning",
            message: "Your sales page is being generated. Please refresh in a moment.",
        },
        failed: {
            icon: "⚠️",
            label: "Failed",
            className: "badge-danger",
            message: "Generation failed. You can try regenerating this page.",
        },
        generated: {
            icon: "✅",
            label: "Generated",
            className: "badge-success",
            message: null,
        },
    };

    const meta = statusMeta[page.status] || statusMeta.pending;

    const handleDelete = () => {
        if (confirm("Delete this sales page? This action cannot be undone.")) {
            router.delete(route("pages.destroy", page.id));
        }
    };

    const handleRegenerate = () => {
        if (confirm("Regenerate AI content? Current content will be replaced.")) {
            setRegenerating(true);
            router.post(route("pages.regenerate", page.id), {}, {
                onFinish: () => setRegenerating(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={page.product_name} />

            {/* Floating action bar */}
            <div className="sticky top-16 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <Link
                        href={route("pages.history")}
                        className="flex items-center gap-2 text-sm text-dark-200 hover:text-white transition group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to History
                    </Link>

                    <div className="flex items-center gap-2">
                        <a
                            href={route("pages.export", page.id)}
                            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span className="hidden sm:inline">Export HTML</span>
                        </a>

                        <button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-accent-violet bg-accent-violet/10 hover:bg-accent-violet/20 border border-accent-violet/20 rounded-lg transition disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                            </svg>
                            <span className="hidden sm:inline">{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status banner */}
            {(page.status !== 'generated' || meta.message) && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
                    <div className={`glass-card px-5 py-4 flex items-start gap-3 animate-fade-in-down ${
                        page.status === 'failed' ? 'border-red-500/20' :
                        page.status === 'pending' ? 'border-amber-500/20' : ''
                    }`}>
                        <span className={`badge ${meta.className} mt-0.5`}>
                            {meta.label}
                        </span>
                        {meta.message && (
                            <p className="text-sm text-dark-200">{meta.message}</p>
                        )}
                    </div>
                </div>
            )}

            {/* No content fallback */}
            {!c && page.status !== "generated" && (
                <section className="max-w-4xl mx-auto px-6 py-24 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-violet/20 to-accent-indigo/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <svg className="w-10 h-10 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Content Yet</h3>
                    <p className="text-dark-300">The page is likely still being generated. Refresh shortly.</p>
                </section>
            )}

            {/* Generated Landing Page Preview */}
            {c && (
                <div className="animate-fade-in">
                    {/* HERO */}
                    <section className="relative overflow-hidden py-32 px-6 text-center">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet via-accent-indigo to-purple-900" />
                        {/* Decorative elements */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.15) 0%, transparent 50%)',
                        }} />
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-float" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow" />

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance animate-fade-in-up">
                                {c.headline}
                            </h1>
                            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                {c.sub_headline}
                            </p>
                            <button className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                {c.cta_text}
                            </button>
                        </div>
                    </section>

                    {/* DESCRIPTION */}
                    <section className="py-20 px-6 bg-dark-800">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-8">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                About {page.product_name}
                            </div>
                            <p className="text-dark-100 text-lg leading-relaxed whitespace-pre-line">
                                {c.description}
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS */}
                    <section className="py-20 px-6 bg-dark-900 relative">
                        <div className="orb orb-violet w-[300px] h-[300px] top-0 -right-32 opacity-20" />
                        <div className="max-w-5xl mx-auto relative z-10">
                            <div className="text-center mb-14">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                                    Why Choose <span className="gradient-text">Us?</span>
                                </h2>
                                <p className="text-dark-300">The advantages that set us apart</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                                {c.benefits?.map((benefit, i) => (
                                    <div
                                        key={i}
                                        className="glass-card-hover p-6 flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-accent-violet font-bold text-sm">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <p className="text-dark-100 leading-relaxed">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FEATURES */}
                    <section className="py-20 px-6 bg-dark-800">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-14">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                                    Powerful <span className="gradient-text">Features</span>
                                </h2>
                                <p className="text-dark-300">Everything you need to succeed</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                                {c.features?.map((f, i) => {
                                    const featureIcons = [
                                        <svg key="0" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
                                        <svg key="1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                                        <svg key="2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
                                    ];
                                    return (
                                        <div
                                            key={i}
                                            className="glass-card-hover p-7 text-center group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mx-auto mb-5 text-accent-violet group-hover:scale-110 transition-transform duration-300">
                                                {featureIcons[i % 3]}
                                            </div>
                                            <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                                            <p className="text-dark-200 text-sm leading-relaxed">{f.detail}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* SOCIAL PROOF */}
                    <section className="py-20 px-6 bg-dark-900 relative">
                        <div className="max-w-3xl mx-auto text-center relative z-10">
                            <svg className="w-16 h-16 text-accent-violet/20 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                            </svg>
                            <blockquote className="text-xl sm:text-2xl text-dark-50 italic leading-relaxed mb-8 font-light">
                                "{c.social_proof}"
                            </blockquote>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan mx-auto" />
                        </div>
                    </section>

                    {/* PRICING + CTA */}
                    <section className="py-24 px-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 to-accent-indigo/5" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-violet/5 blur-3xl animate-pulse-glow" />

                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <p className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                {c.pricing_text}
                            </p>
                            <p className="text-dark-300 mb-10 text-lg">
                                No hidden fees. Cancel anytime. Start transforming today.
                            </p>
                            <button className="gradient-btn px-14 py-5 text-xl rounded-2xl hover:scale-105 transition-transform duration-300 shadow-2xl shadow-accent-violet/20">
                                {c.cta_text}
                            </button>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-8 px-6 border-t border-white/[0.04] bg-dark-950">
                        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dark-400">
                            <p>Generated with AI Sales Generator</p>
                            <p>© {new Date().getFullYear()} {page.product_name}. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
