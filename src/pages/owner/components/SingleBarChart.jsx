import React from "react";
import { Bar } from "react-chartjs-2";
import "./chartSetup";
import { EmptyState, SkeletonBlock } from "./ui";

const SingleBarChart = ({ data, isLoading, error }) => {
    if (isLoading) return <SkeletonBlock lines={10} />;
    if (error) return <EmptyState message={error} />;
    if (!data.length) return <EmptyState />;

    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: "Lượt thăm khám",
                data: data.map((item) => item.visits),
                backgroundColor: "rgba(245, 158, 11, 0.8)",
                borderColor: "rgba(245, 158, 11, 1)",
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
                        return `Lượt thăm khám: ${context.parsed.y}`;
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
                    stepSize: 1,
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

export default SingleBarChart;

