import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head } from "@inertiajs/react";
import { useMemo } from "react";

const fieldIcons = {
    product_name: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
    ),
    description: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
    ),
    features: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
    ),
    target_audience: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    ),
    price: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    usp: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    ),
};

const formFields = [
    { key: 'product_name', label: 'Product / Service Name', placeholder: 'e.g. ProTask — Project Management Tool', type: 'input' },
    { key: 'description', label: 'Description', placeholder: 'Describe your product or service in detail...', type: 'textarea', rows: 4, hint: 'Min. 20 characters' },
    { key: 'features', label: 'Key Features', placeholder: 'e.g. Real-time collaboration, AI suggestions, Gantt chart', type: 'input', hint: 'Comma-separated list' },
    { key: 'target_audience', label: 'Target Audience', placeholder: 'e.g. Startup founders and remote teams', type: 'input' },
    { key: 'price', label: 'Price', placeholder: 'e.g. $29/month or Free with premium at $49', type: 'input' },
    { key: 'usp', label: 'Unique Selling Points', placeholder: 'What makes this product stand out from competitors?', type: 'textarea', rows: 3 },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        product_name: "",
        description: "",
        features: "",
        target_audience: "",
        price: "",
        usp: "",
    });

    const filledCount = useMemo(() => {
        return Object.values(data).filter(v => v.trim().length > 0).length;
    }, [data]);

    const progress = (filledCount / formFields.length) * 100;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pages.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Sales Page" />

            <div className="relative overflow-hidden">
                {/* Background orbs */}
                <div className="orb orb-violet w-[400px] h-[400px] -top-48 -right-48 animate-float opacity-40" />
                <div className="orb orb-cyan w-[250px] h-[250px] bottom-20 -left-32 animate-float-slow opacity-30" />

                <div className="max-w-2xl mx-auto py-10 px-4 relative z-10">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Create <span className="gradient-text">Sales Page</span>
                        </h1>
                        <p className="text-dark-200">
                            Fill in your product details and let AI craft a stunning, high-converting sales page.
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-dark-300 font-medium">Form Progress</span>
                            <span className="text-xs text-dark-300">
                                <span className="text-white font-semibold">{filledCount}</span> / {formFields.length} fields
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* AI Error */}
                    {errors.ai && (
                        <div className="glass-card border-red-500/20 bg-red-500/10 px-5 py-4 mb-6 flex items-start gap-3 animate-fade-in-down">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-400">Generation Failed</p>
                                <p className="text-sm text-red-400/80 mt-0.5">{errors.ai}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 stagger-children">
                        {formFields.map(field => (
                            <div key={field.key} className="glass-card p-5">
                                <label className="flex items-center gap-2.5 mb-3">
                                    <span className="text-accent-violet">{fieldIcons[field.key]}</span>
                                    <span className="text-sm font-medium text-white">{field.label}</span>
                                    {field.hint && (
                                        <span className="text-xs text-dark-400 ml-auto">{field.hint}</span>
                                    )}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        rows={field.rows || 3}
                                        value={data[field.key]}
                                        onChange={(e) => setData(field.key, e.target.value)}
                                        className="glass-input resize-none"
                                        placeholder={field.placeholder}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={data[field.key]}
                                        onChange={(e) => setData(field.key, e.target.value)}
                                        className="glass-input"
                                        placeholder={field.placeholder}
                                    />
                                )}
                                {errors[field.key] && (
                                    <p className="flex items-center gap-1.5 text-sm text-red-400 mt-2">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full gradient-btn py-4 text-base rounded-xl flex items-center justify-center gap-3 group"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Generating your sales page...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                    <span>Generate Sales Page</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
