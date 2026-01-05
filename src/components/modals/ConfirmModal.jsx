import { createPortal } from "react-dom";

export default function ConfirmModal({
    open,
    title = "Xác nhận",
    message,
    onConfirm,
    onCancel,
    confirmText = "Đồng ý",
    cancelText = "Hủy",
    loading = false,
}) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-sm font-semibold
                                   bg-gray-100 text-gray-700
                                   hover:bg-gray-200 hover:cursor-pointer transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-sm font-semibold
                                   bg-red-500 text-white
                                   hover:bg-red-600 hover:cursor-pointer transition disabled:opacity-50"
                    >
                        {loading ? "Đang xử lý..." : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
