import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head } from "@inertiajs/react";
import { useMemo } from "react";
import ModelStatusWidget from "@/Components/ModelStatusWidget";

const formFields = [
    {
        key: "product_name",
        label: "Product / Service name",
        placeholder: "e.g. ProTask — Project Management Tool",
        type: "input",
    },
    {
        key: "description",
        label: "Description",
        placeholder: "Describe your product or service...",
        type: "textarea",
        rows: 4,
        hint: "Minimum 20 characters",
    },
    {
        key: "features",
        label: "Key features",
        placeholder:
            "e.g. Real-time collaboration, AI suggestions, Gantt chart",
        type: "input",
        hint: "Comma-separated",
    },
    {
        key: "target_audience",
        label: "Target audience",
        placeholder: "e.g. Startup founders and remote teams",
        type: "input",
    },
    {
        key: "price",
        label: "Price",
        placeholder: "e.g. $29/month or Free with premium at $49",
        type: "input",
    },
    {
        key: "usp",
        label: "Unique selling points",
        placeholder: "What makes this product stand out?",
        type: "textarea",
        rows: 3,
    },
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
        return Object.values(data).filter((v) => v.trim().length > 0).length;
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pages.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Sales Page" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create sales page
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in your product details. AI will generate a
                        complete landing page for you.
                    </p>
                </div>

                {/* Status widget — taruh di sini */}
                <div className="mb-6">
                    <ModelStatusWidget />
                </div>

                {/* Error dari AI */}
                {errors.ai && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {errors.ai}
                    </div>
                )}

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-500">
                            Progress
                        </span>
                        <span className="text-xs text-gray-400">
                            {filledCount} of {formFields.length} fields
                        </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent-600 rounded-full transition-all duration-300"
                            style={{
                                width: `${(filledCount / formFields.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {errors.ai && (
                    <div className="bg-red-600 border border-red-700 text-white text-sm font-medium rounded-lg px-4 py-3 mb-6 shadow-sm">
                        {errors.ai}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                        {formFields.map((field) => (
                            <div key={field.key} className="px-5 py-4">
                                <div className="flex items-baseline justify-between mb-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    {field.hint && (
                                        <span className="text-xs text-gray-400">
                                            {field.hint}
                                        </span>
                                    )}
                                </div>
                                {field.type === "textarea" ? (
                                    <textarea
                                        rows={field.rows}
                                        value={data[field.key]}
                                        onChange={(e) =>
                                            setData(field.key, e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none resize-none"
                                        placeholder={field.placeholder}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={data[field.key]}
                                        onChange={(e) =>
                                            setData(field.key, e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none"
                                        placeholder={field.placeholder}
                                    />
                                )}
                                {errors[field.key] && (
                                    <p className="text-sm text-red-600 mt-1.5">
                                        {errors[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 w-full rounded-lg bg-accent-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-800 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? "Generating..." : "Generate sales page"}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
