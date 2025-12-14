import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BreakdownCard from "./components/BreakdownCard";
import DetailTable from "./components/DetailTable";
import DualBarChart from "./components/DualBarChart";
import FilterBar from "./components/FilterBar";
import SingleBarChart from "./components/SingleBarChart";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { Card, SkeletonBlock, StatCard } from "./components/ui";
import { TIMEFRAMES, formatCurrency } from "./ownerConstants";
import { getRevenue, getRevenueService_Breakdown } from "../../api/owner.api";

const OwnerDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const today = new Date();
    const fmt = (d) => d.toISOString().slice(0, 10);

    const initialTf = searchParams.get("tf");
    const safeTf = TIMEFRAMES.some((t) => t.key === initialTf) ? initialTf : "DAY";
    // const defaultStart = fmt(new Date(today.getTime() - 6 * 86400000));
    const defaultStart = fmt(today);
    const defaultEnd = fmt(today);
    const [startDate, setStartDate] = useState(searchParams.get("start") ?? defaultStart);
    const [endDate, setEndDate] = useState(searchParams.get("end") ?? defaultEnd);
    const [timeframe, setTimeframe] = useState(safeTf);
    const [data, setData] = useState([]);
    const [dataServiceBreakdown, setDataServiceBreakdown] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState("");
    const [isManualDateChange, setIsManualDateChange] = useState(false);

    // Sync query params to keep state on reload
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("start", startDate);
        params.set("end", endDate);
        params.set("tf", timeframe);
        setSearchParams(params, { replace: true });
    }, [endDate, setSearchParams, startDate, timeframe]);

    // Tự động chuyển timeframe khi thay đổi ngày thủ công
    useEffect(() => {
        if (!isManualDateChange) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
        if (start > end) return;

        const diffDays = Math.round((end - start) / 86400000);
        let newTimeframe = timeframe;

        if (diffDays <= 14) {
            newTimeframe = "DAY";
        } else if (diffDays <= 60) {
            newTimeframe = "WEEK";
        } else if (diffDays <= 180) {
            newTimeframe = "MONTH";
        } else {
            newTimeframe = "QUARTER";
        }

        if (newTimeframe !== timeframe) {
            setTimeframe(newTimeframe);
        }
        setIsManualDateChange(false);
    }, [startDate, endDate, isManualDateChange, timeframe]);

    // Gọi API từ BE
    useEffect(() => {
        const fetchRevenue = async () => {
            setIsLoading(true);
            setError(null);

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                setError("Ngày không hợp lệ");
                setData([]);
                setIsLoading(false);
                return;
            }

            if (start > end) {
                setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                setData([]);
                setIsLoading(false);
                return;
            }

            try {
                const result = await getRevenue({
                    startDate,
                    endDate,
                    timeframe
                });

                setData(result || []);
            } catch (e) {
                setError("Không thể tải dữ liệu doanh thu");
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRevenue();
    }, [startDate, endDate, timeframe]);

    // Lấy dữ liệu cho div doanh thu theo nhóm (Khám bệnh & thuốc)
    useEffect(() => {
        const fetchRevenueService_Breakdown = async () => {
            try {
                const result = await getRevenueService_Breakdown();

                setDataServiceBreakdown(result || []);
            } catch (e) {
                setError("Không thể tải dữ liệu doanh thu");
                setDataServiceBreakdown([]);
            }
        }

        fetchRevenueService_Breakdown();
    }, [])

    // console.log("Doanh thu: " + JSON.stringify(data));

    const totals = useMemo(() => {
        const clinic = data.reduce((sum, d) => sum + d.revenueClinic, 0);
        const pharma = data.reduce((sum, d) => sum + d.revenuePharma, 0);
        const visits = data.reduce((sum, d) => sum + d.visits, 0);
        return { clinic, pharma, total: clinic + pharma, visits };
    }, [data]);

    const handlePreset = (key) => {
        setIsManualDateChange(false);
        const end = fmt(today);
        let start = end;
        if (key === "7d") {
            start = fmt(new Date(today.getTime() - 6 * 86400000));
            setTimeframe("DAY");
        } else if (key === "30d") {
            start = fmt(new Date(today.getTime() - 29 * 86400000));
            setTimeframe("DAY");
        } else {
            start = fmt(new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()));
            setTimeframe("QUARTER");
        }
        setStartDate(start);
        setEndDate(end);
    };

    const handleTimeframeChange = (tf) => {
        setIsManualDateChange(false);
        setTimeframe(tf);
    };

    const handleExportPDF = () => {
        setToast("Đã xuất báo cáo PDF");
        setTimeout(() => setToast(""), 1500);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* ==== HEADER – CỐ ĐỊNH ==== */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>


            <div className="flex flex-1 pt-13 overflow-y-auto">
                {/* ==== SIDEBAR – CỐ ĐỊNH ==== */}
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <SideBar />
                </div>

                {/* ==== MAIN CONTENT – KHÔNG CUỘN TOÀN TRANG ==== */}
                <main className="flex-1 ml-24 flex flex-col">
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
                        <div className="mx-auto max-w-7xl space-y-6">
                            <FilterBar
                                startDate={startDate}
                                endDate={endDate}
                                onChangeStart={setStartDate}
                                onChangeEnd={setEndDate}
                                timeframe={timeframe}
                                onTimeframeChange={handleTimeframeChange}
                                onPreset={handlePreset}
                                onExportPDF={handleExportPDF}
                                onManualDateChange={() => setIsManualDateChange(true)}
                            />

                            {toast && (
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                                    {toast}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {isLoading ? (
                                    <>
                                        <SkeletonBlock lines={5} />
                                        <SkeletonBlock lines={5} />
                                        <SkeletonBlock lines={5} />
                                        <SkeletonBlock lines={5} />
                                    </>
                                ) : (
                                    <>
                                        <StatCard title="Doanh thu khám bệnh" value={formatCurrency(totals.clinic)} subtitle={`${startDate} → ${endDate}`} />
                                        <StatCard title="Doanh thu bán thuốc" value={formatCurrency(totals.pharma)} subtitle={`${startDate} → ${endDate}`} />
                                        <StatCard title="Tổng doanh thu" value={formatCurrency(totals.total)} subtitle="Khám + thuốc" />
                                        <StatCard title="Lượt thăm khám" value={totals.visits.toLocaleString("vi-VN")} subtitle="Theo khoảng đã lọc" />
                                    </>
                                )}
                            </div>

                            <div className="grid gap-6 lg:grid-cols-10 lg:items-stretch">
                                <div className="lg:col-span-7">
                                    <Card className="flex flex-col h-full">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Doanh thu khám bệnh & bán thuốc</p>
                                                {/* <p className="text-lg font-semibold text-slate-900">Khám bệnh vs Bán thuốc</p> */}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                                                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-teal-500" /> Khám</span>
                                                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-indigo-500" /> Thuốc</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex-1">
                                            <DualBarChart data={data} isLoading={isLoading} error={error} />
                                        </div>
                                    </Card>
                                </div>
                                <div className="lg:col-span-3">
                                    <Card className="flex flex-col h-full">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Lượt thăm khám</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                                                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-500/80" /> Số lượt</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex-1">
                                            <SingleBarChart data={data} isLoading={isLoading} error={error} />
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <DetailTable data={data} isLoading={isLoading} error={error} />

                            <div className="grid lg:grid-cobs-2">
                                <div className="lg:col-span-2 mb-6">
                                    <BreakdownCard data={dataServiceBreakdown} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OwnerDashboard;



