import React from "react";
import { Card, ProgressBar } from "./ui";
import { formatCurrency } from "../ownerConstants";

const BreakdownCard = ({ data }) => (
    <Card>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">Doanh thu theo nhóm</p>
                <p className="text-lg font-semibold text-slate-900">Khám bệnh & thuốc</p>
            </div>
        </div>
        <div className="mt-4 space-y-3">
            {data.map((row, idx) => (
                <div key={row.name} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">{row.name}</span>
                        <span className="font-semibold text-teal-700">{formatCurrency(row.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{row.visits.toLocaleString("vi-VN")} lượt</span>
                        <span>{idx === 0 ? "Lâm sàng" : idx === 1 ? "Cận lâm sàng" : "Thuốc"}</span>
                    </div>
                    <ProgressBar value={Math.min((row.revenue / data[0].revenue) * 100, 100)} />
                </div>
            ))}
        </div>
    </Card>
);

export default BreakdownCard;

