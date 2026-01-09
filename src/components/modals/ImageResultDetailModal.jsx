import React, { useState } from "react";
import Barcode from "react-barcode";

const ImageResultDetailModal = ({ imageResult, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!imageResult) return null;

    // Handle both single image_url and array of images
    const images = imageResult.image_url
        ? Array.isArray(imageResult.image_url)
            ? imageResult.image_url
            : [imageResult.image_url]
        : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Kết quả chẩn đoán hình ảnh
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    Phòng khám PMedClinic
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Barcode */}
                    {imageResult.barcode && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-center">
                            <Barcode
                                value={imageResult.barcode}
                                height={40}
                                displayValue
                                background="white"
                                lineColor="black"
                            />
                        </div>
                    )}

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                                Ngày thực hiện
                            </p>
                            <p className="font-semibold text-gray-800">
                                {imageResult.created_at
                                    ? new Date(
                                          imageResult.created_at
                                      ).toLocaleDateString("vi-VN", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "--"}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                                Bác sĩ chẩn đoán
                            </p>
                            <p className="font-semibold text-gray-800">
                                {imageResult.doctor?.user?.full_name || "--"}
                            </p>
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    {images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Hình ảnh chẩn đoán
                            </h3>
                            <div className="space-y-4">
                                {/* Main Image Display */}
                                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                                    <img
                                        src={images[selectedImageIndex]}
                                        alt={`Ảnh CĐHA ${selectedImageIndex + 1}`}
                                        className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                                    />
                                </div>

                                {/* Thumbnail Gallery */}
                                {images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    setSelectedImageIndex(idx)
                                                }
                                                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedImageIndex === idx
                                                        ? "border-blue-600 ring-2 ring-blue-200"
                                                        : "border-gray-200 hover:border-blue-400"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="text-center text-sm text-gray-600">
                                        Ảnh {selectedImageIndex + 1} /{" "}
                                        {images.length}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Kết quả */}
                    {imageResult.result && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Kết quả chẩn đoán
                            </h3>
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                                <p className="text-base text-gray-800 whitespace-pre-line">
                                    {imageResult.result}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Kết luận */}
                    {imageResult.conclusion && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Kết luận
                            </h3>
                            <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                                <p className="text-base text-gray-800 whitespace-pre-line">
                                    {imageResult.conclusion}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                        {images.length > 0 && (
                            <a
                                href={images[selectedImageIndex]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Tải ảnh
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ml-auto"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageResultDetailModal;

