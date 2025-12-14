import React from "react";
import { Bar } from "react-chartjs-2";
import "./chartSetup";
import { EmptyState, SkeletonBlock } from "./ui";

const DualBarChart = ({ data, isLoading, error }) => {
    if (isLoading) return <SkeletonBlock lines={10} />;
    if (error) return <EmptyState message={error} />;
    if (!data.length) return <EmptyState />;

    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: "Khám bệnh",
                data: data.map((item) => item.revenueClinic / 1_000_000),
                backgroundColor: "rgba(20, 184, 166, 0.8)",
                borderColor: "rgba(20, 184, 166, 1)",
                borderWidth: 1,
            },
            {
                label: "Bán thuốc",
                data: data.map((item) => item.revenuePharma / 1_000_000),
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}M ₫`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: data.length > 10 ? 45 : 0,
                    minRotation: data.length > 10 ? 45 : 0,
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(148, 163, 184, 0.1)",
                },
                ticks: {
                    callback: function (value) {
                        return value + "M";
                    },
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    return (
        <div className="h-72 w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DualBarChart;

