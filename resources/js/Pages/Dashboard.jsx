import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ stats, worker, models = [] }) {
    const user = usePage().props.auth.user;
    const workerIsActive = Boolean(worker?.active && worker?.fresh);
    const workerStateLabel = workerIsActive
        ? "Queue worker active and ready"
        : worker?.active
          ? "Queue worker heartbeat stale"
          : "Queue worker not detected";

    const statItems = [
        { label: "Total pages", value: stats?.total ?? 0 },
        {
            label: "Generated",
            value: stats?.generated ?? 0,
            color: "text-green-600",
        },
        {
            label: "Pending",
            value: stats?.pending ?? 0,
            color: "text-amber-600",
        },
        { label: "Failed", value: stats?.failed ?? 0, color: "text-red-600" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome back, {user.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Here's an overview of your sales pages.
                </p>
                {/* <div
                    className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${workerIsActive ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                >
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${workerIsActive ? "bg-green-500" : "bg-amber-500"}`}
                    />
                    <span>{workerStateLabel}</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Queue: {worker?.queue || "sales-pages,default"}
                    {worker?.last_seen
                        ? ` · last heartbeat ${new Date(worker.last_seen).toLocaleTimeString()}`
                        : ""}
                </p> */}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {statItems.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 px-5 py-4"
                    >
                        <p
                            className={`text-2xl font-semibold ${stat.color || "text-gray-900"}`}
                        >
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            OpenRouter model pool
                        </h2>
                        <p className="text-sm text-gray-500">
                            Available models and current cooldown status.
                        </p>
                    </div>
                    <Link
                        href={route("ai.model-status")}
                        className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                        View JSON
                    </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {models.map((model) => (
                        <div
                            key={model.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                        >
                            <div className="flex items-center gap-2">
                                <span>{model.icon}</span>
                                <div className="font-semibold text-gray-900">
                                    {model.label}
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm">
                                <span
                                    className={`rounded-full px-2 py-0.5 font-medium ${model.status === "available" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                                >
                                    {model.status}
                                </span>
                                {model.available_at ? (
                                    <span className="text-xs text-gray-500">
                                        {model.available_at}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Link
                    href={route("pages.create")}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-accent-300 hover:shadow-sm transition group"
                >
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-accent-700 transition">
                        Create new page
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Enter your product details and generate a
                        high-converting sales page with AI.
                    </p>
                </Link>

                <Link
                    href={route("pages.history")}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition group"
                >
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                        View history
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Browse, manage, and export your previously generated
                        sales pages.
                    </p>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
