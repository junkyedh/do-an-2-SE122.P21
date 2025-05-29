import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BookingsChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // const sampleData = [
    //     { date: '2024-12-01', bookings: 10 },
    //     { date: '2024-12-02', bookings: 12 },
    //     { date: '2024-12-03', bookings: 8 },
    //     { date: '2024-12-04', bookings: 15 },
    //     { date: '2024-12-05', bookings: 20 },
    //     { date: '2024-12-06', bookings: 7 },
    //     { date: '2024-12-07', bookings: 13 },
    //     { date: '2024-12-08', bookings: 9 },
    //     { date: '2024-12-09', bookings: 11 },
    //     { date: '2024-12-10', bookings: 14 },
    //     { date: '2024-12-11', bookings: 5 },
    //     { date: '2024-12-12', bookings: 6 },
    //     { date: '2024-12-13', bookings: 19 },
    //     { date: '2024-12-14', bookings: 16 },
    //     { date: '2024-12-15', bookings: 10 },
    //     { date: '2024-12-16', bookings: 12 },
    //     { date: '2024-12-17', bookings: 18 },
    //     { date: '2024-12-18', bookings: 17 },
    //     { date: '2024-12-19', bookings: 9 },
    //     { date: '2024-12-20', bookings: 8 },
    //     { date: '2024-12-21', bookings: 13 },
    //     { date: '2024-12-22', bookings: 14 },
    //     { date: '2024-12-23', bookings: 10 },
    //     { date: '2024-12-24', bookings: 11 },
    //     { date: '2024-12-25', bookings: 15 },
    //     { date: '2024-12-26', bookings: 19 },
    //     { date: '2024-12-27', bookings: 7 },
    //     { date: '2024-12-28', bookings: 12 },
    //     { date: '2024-12-29', bookings: 9 },
    //     { date: '2024-12-30', bookings: 10 },
    // ];
    const sampleData = data?.last14DaysBooking || [];

    useEffect(() => {
        const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const values = sampleData.map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Number of Rooms Booked',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    }, [data]);

    return (
        <div className="chart">
            {/* <h3 className='h3'>Room Bookings in the Last 14 Days</h3> */}
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Room Bookings in the Last 14 Days'
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
                                    text: 'Number of Rooms Booked'
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

export default BookingsChart;
