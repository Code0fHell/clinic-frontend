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
import { exportRevenueExcel, getRevenue, getRevenueService_Breakdown } from "../../api/owner.api";

// Hàm sắp xếp dữ liệu theo timeframe (mới nhất trước)
const sortByTimeframe = (labelA, labelB, timeframe) => {
    try {
        switch (timeframe) {
            case "DAY": {
                const parseDate = (label) => {
                    const [day, month, year] = label.split('/');
                    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                };
                const dateA = parseDate(labelA);
                const dateB = parseDate(labelB);
                return dateB - dateA; // Mới nhất trước (giảm dần)
            }
            case "WEEK": {
                const getWeekNumber = (label) => {
                    const match = label.match(/Tuần (\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                };
                return getWeekNumber(labelB) - getWeekNumber(labelA); // Mới nhất trước
            }
            case "MONTH": {
                const parseMonth = (label) => {
                    const match = label.match(/T(\d+)\/(\d+)/);
                    if (match) {
                        const month = parseInt(match[1], 10);
                        const year = parseInt(match[2], 10);
                        return year * 12 + month;
                    }
                    return 0;
                };
                return parseMonth(labelB) - parseMonth(labelA); // Mới nhất trước
            }
            case "QUARTER": {
                const parseQuarter = (label) => {
                    const match = label.match(/Q(\d+)\/(\d+)/);
                    if (match) {
                        const quarter = parseInt(match[1], 10);
                        const year = parseInt(match[2], 10);
                        return year * 4 + quarter;
                    }
                    return 0;
                };
                return parseQuarter(labelB) - parseQuarter(labelA); // Mới nhất trước
            }
            default:
                return 0;
        }
    } catch (error) {
        console.warn("Lỗi khi sắp xếp dữ liệu:", error);
        return 0;
    }
};

const OwnerDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const todayVN = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh",
        });

    const initialTf = searchParams.get("tf");
    const safeTf = TIMEFRAMES.some((t) => t.key === initialTf) ? initialTf : "DAY";

    const defaultStart = fmt(todayVN);
    const defaultEnd = fmt(todayVN);

    const [startDate, setStartDate] = useState(
        searchParams.get("start") ?? defaultStart
    );
    const [endDate, setEndDate] = useState(
        searchParams.get("end") ?? defaultEnd
    );
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

                // Đảm bảo result là mảng hợp lệ
                if (Array.isArray(result)) {
                    // Nếu mảng rỗng và timeframe là DAY, tạo một entry mặc định để hiển thị
                    if (result.length === 0 && timeframe === "DAY") {
                        const formattedDate = new Date(startDate).toLocaleDateString('vi-VN');
                        setData([{
                            label: formattedDate,
                            revenueClinic: 0,
                            revenueService: 0,
                            revenuePharma: 0,
                            visits: 0
                        }]);
                    } else {
                        // Gộp các entries có cùng label lại với nhau
                        const mergedData = result.reduce((acc, item) => {
                            const existing = acc.find(d => d.label === item.label);
                            if (existing) {
                                // Gộp dữ liệu nếu đã tồn tại label
                                existing.revenueClinic += item.revenueClinic || 0;
                                existing.revenueService += item.revenueService || 0;
                                existing.revenuePharma += item.revenuePharma || 0;
                                existing.visits += item.visits || 0;
                            } else {
                                // Thêm entry mới
                                acc.push({ ...item });
                            }
                            return acc;
                        }, []);

                        // Sắp xếp dữ liệu: mới nhất trước (giảm dần)
                        const sortedData = mergedData.sort((a, b) => {
                            return sortByTimeframe(a.label, b.label, timeframe);
                        });

                        setData(sortedData);
                    }
                } else {
                    console.warn("API trả về dữ liệu không hợp lệ:", result);
                    setData([]);
                }
            } catch (e) {
                console.error("Lỗi khi gọi API getRevenue:", e);
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
        const service = data.reduce((sum, d) => sum + d.revenueService, 0);
        const pharma = data.reduce((sum, d) => sum + d.revenuePharma, 0);
        const visits = data.reduce((sum, d) => sum + d.visits, 0);

        return {
            clinic,
            service,
            pharma,
            total: clinic + service + pharma,
            visits
        };
    }, [data]);

    const handlePreset = (key) => {
        setIsManualDateChange(false);
        const end = fmt(todayVN);
        let start = end;
        if (key === "7d") {
            start = fmt(new Date(todayVN.getTime() - 6 * 86400000));
            setTimeframe("DAY");
        } else if (key === "30d") {
            start = fmt(new Date(todayVN.getTime() - 29 * 86400000));
            setTimeframe("DAY");
        } else {
            start = fmt(new Date(todayVN.getFullYear(), todayVN.getMonth() - 2, todayVN.getDate()));
            setTimeframe("QUARTER");
        }
        setStartDate(start);
        setEndDate(end);
    };

    const handleTimeframeChange = (tf) => {
        setIsManualDateChange(false);
        setTimeframe(tf);
    };

    const handleExportExcel = async () => {
        await exportRevenueExcel({
            startDate: startDate,   // state FE
            endDate: endDate,
            timeframe: timeframe,
        });
        setToast("Đã xuất báo cáo Excel");
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
                                onExportExcel={handleExportExcel}
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
                                        <StatCard title="Lâm sàng" value={formatCurrency(totals.clinic)} subtitle={`${startDate} → ${endDate}`} />
                                        <StatCard title="Cận lâm sàng" value={formatCurrency(totals.service)} subtitle={`${startDate} → ${endDate}`} />
                                        <StatCard title="Bán thuốc" value={formatCurrency(totals.pharma)} subtitle={`${startDate} → ${endDate}`} />
                                        <StatCard title="Tổng doanh thu" value={formatCurrency(totals.total)} subtitle="Lâm sàng + Cận lâm sàng + thuốc" />
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
                                                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-teal-500" /> Lâm sàng</span>
                                                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-purple-500" /> Cận lâm sàng</span>
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

                            <div className="grid lg:grid-cols-2">
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



