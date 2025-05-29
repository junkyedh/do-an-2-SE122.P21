import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const RevenueChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // const sampleRevenueData = [
    //     { date: '2024-12-01', revenue: 100 },
    //     { date: '2024-12-02', revenue: 150 },
    //     // Các dữ liệu mẫu khác...
    //     { date: '2024-12-30', revenue: 120 },
    // ];

    const sampleRevenueData = data?.last30DaysBookingValue || [];

    useEffect(() => {
        const labels = sampleRevenueData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const values = sampleRevenueData.map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Daily Revenue',
                    data: values,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                    tension: 0.1,
                }
            ]
        });
    }, [data]);

    return (
        <div className="chart">
            {/* <h3 className='h3'>Daily Revenue in the Last 14 Days</h3> */}
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Daily Revenue in the Last 30 Days'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Revenue (VND)'
                                },
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default RevenueChart;
