import React, { useEffect, useState } from "react";
import { Card, EmptyState, SkeletonBlock } from "./ui";
import { formatCurrency } from "../ownerConstants";

const DetailTable = ({ data, isLoading, error }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    return (
        <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Bảng chi tiết</p>
                    <p className="text-lg font-semibold text-slate-900">Doanh thu & lượt khám</p>
                </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <div className="grid grid-cols-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <span>Mốc</span>
                    <span className="text-right">Khám bệnh</span>
                    <span className="text-right">Bán thuốc</span>
                    <span className="text-right">Lượt khám</span>
                </div>
                {isLoading ? (
                    <div className="p-4">
                        <SkeletonBlock lines={8} />
                    </div>
                ) : error ? (
                    <EmptyState message={error} />
                ) : !data.length ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                            {currentData.map((item) => (
                                <div key={item.label} className="grid grid-cols-4 px-4 py-3 text-sm text-slate-700">
                                    <span className="font-medium">{item.label}</span>
                                    <span className="text-right">{formatCurrency(item.revenueClinic)}</span>
                                    <span className="text-right">{formatCurrency(item.revenuePharma)}</span>
                                    <span className="text-right">{item.visits.toLocaleString("vi-VN")}</span>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
                                <div className="text-sm text-slate-600">
                                    Hiển thị {startIndex + 1}-{Math.min(endIndex, data.length)} trong tổng {data.length} mục
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="hover:cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((page) => {
                                                return (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                );
                                            })
                                            .map((page, idx, arr) => {
                                                const showEllipsis = idx > 0 && arr[idx] - arr[idx - 1] > 1;
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsis && (
                                                            <span className="px-2 text-xs text-slate-500">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`hover:cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${currentPage === page
                                                                ? "bg-teal-600 text-white"
                                                                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="hover:cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};

export default DetailTable;

