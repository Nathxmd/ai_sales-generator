import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ page }) {
    const c = page.generated_content;
    const [regenerating, setRegenerating] = useState(false);

    const handleDelete = () => {
        if (confirm("Delete this sales page?")) {
            router.delete(route("pages.destroy", page.id));
        }
    };

    const handleRegenerate = () => {
        if (confirm("Regenerate content? Current version will be replaced.")) {
            setRegenerating(true);
            router.post(route("pages.regenerate", page.id), {}, {
                onFinish: () => setRegenerating(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={page.product_name} />

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <Link
                    href={route("pages.history")}
                    className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1"
                >
                    ← Back to history
                </Link>

                <div className="flex items-center gap-2">
                    <a
                        href={route("pages.export", page.id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                    >
                        Export HTML
                    </a>
                    <button
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        className="rounded-lg bg-accent-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-800 transition disabled:opacity-50"
                    >
                        {regenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Status */}
            {page.status !== 'generated' && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-medium mb-6 shadow-sm ${
                    page.status === 'failed'
                        ? 'bg-red-600 border-red-700 text-white'
                        : 'bg-amber-600 border-amber-700 text-white'
                }`}>
                    {page.status === 'failed'
                        ? 'Generation failed. Try regenerating this page.'
                        : 'Your page is being generated. Please refresh in a moment.'}
                </div>
            )}

            {/* No content */}
            {!c && (
                <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
                    <p className="text-gray-500">No generated content yet.</p>
                </div>
            )}

            {/* Preview */}
            {c && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Hero */}
                    <section className="bg-gray-900 text-white text-center px-6 py-20 sm:py-28">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl mx-auto leading-tight">
                            {c.headline}
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                            {c.sub_headline}
                        </p>
                        <button className="bg-accent-600 hover:bg-accent-700 text-white font-medium px-8 py-3 rounded-lg transition">
                            {c.cta_text}
                        </button>
                    </section>

                    {/* Description */}
                    <section className="max-w-3xl mx-auto py-16 px-6 text-center">
                        <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                            {c.description}
                        </p>
                    </section>

                    {/* Benefits */}
                    <section className="bg-gray-50 border-y border-gray-100 py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-10">Why choose us</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {c.benefits?.map((benefit, i) => (
                                    <div key={i} className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <p className="text-gray-700 text-sm">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-10">Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {c.features?.map((f, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-5">
                                        <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{f.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonial */}
                    <section className="bg-gray-50 border-y border-gray-100 py-14 px-6">
                        <blockquote className="text-center max-w-2xl mx-auto">
                            <p className="text-lg text-gray-700 italic leading-relaxed">
                                "{c.social_proof}"
                            </p>
                        </blockquote>
                    </section>

                    {/* CTA */}
                    <section className="text-center py-20 px-6">
                        <p className="text-xl font-semibold text-gray-900 mb-2">{c.pricing_text}</p>
                        <p className="text-gray-500 text-sm mb-8">No hidden fees. Cancel anytime.</p>
                        <button className="bg-accent-700 hover:bg-accent-800 text-white font-medium px-10 py-3.5 rounded-lg text-base transition">
                            {c.cta_text}
                        </button>
                    </section>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
