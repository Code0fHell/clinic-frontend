import React from "react";
import { Bar } from "react-chartjs-2";
import "./chartSetup";
import { EmptyState, SkeletonBlock } from "./ui";

const MedicineSalesChart = ({ data, isLoading, error }) => {
    if (isLoading) return <SkeletonBlock lines={8} />;
    if (error) return <EmptyState message={error} />;
    if (!data || data.length === 0) return <EmptyState message="Không có dữ liệu bán hàng" />;

    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: "Số lượng bán",
                data: data.map((item) => item.quantity ?? item.qty ?? item.value ?? 0),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const val = context.parsed.y;
                        return `Số lượng: ${val}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { maxRotation: data.length > 10 ? 45 : 0, minRotation: data.length > 10 ? 45 : 0 },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                ticks: { stepSize: 1 },
            },
        },
    };

    return (
        <div className="h-72 w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default MedicineSalesChart;
