import { useState, useEffect } from "react";
import axios from "axios";

export default function ModelStatusWidget() {
    const [models, setModels] = useState([]);
    const [checkedAt, setCheckedAt] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await axios.get("/ai/model-status");
            setModels(res.data.models);
            setCheckedAt(res.data.checked_at);
        } catch (e) {
            console.error("Failed to fetch model status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Auto-refresh tiap 60 detik
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const availableCount = models.filter(
        (m) => m.status === "available",
    ).length;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                        🤖 AI Model Status
                    </span>
                    {!loading && (
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                availableCount > 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {availableCount}/{models.length} available
                        </span>
                    )}
                </div>
                <button
                    onClick={() => {
                        setLoading(true);
                        fetchStatus();
                    }}
                    className="text-xs text-gray-400 hover:text-indigo-600 transition"
                    title="Refresh status"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Model list */}
            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-8 bg-gray-100 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {models.map((model) => (
                        <div
                            key={model.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border ${
                                model.status === "available"
                                    ? "bg-green-50 border-green-100"
                                    : "bg-red-50 border-red-100"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span>{model.icon}</span>
                                <span
                                    className={`font-medium ${
                                        model.status === "available"
                                            ? "text-gray-800"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {model.label}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {model.status === "available" ? (
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                                        Available
                                    </span>
                                ) : (
                                    <span className="text-red-400 text-xs">
                                        ⏳ Ready {model.available_at}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer info */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    {availableCount === 0
                        ? "⚠️ All models are rate limited. Generation will auto-retry when available."
                        : "✓ System will auto-fallback if a model hits its rate limit."}
                </p>
                {checkedAt && (
                    <p className="text-xs text-gray-300 mt-1">
                        Last checked: {checkedAt}
                    </p>
                )}
            </div>
        </div>
    );
}
