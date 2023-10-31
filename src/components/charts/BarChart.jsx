import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
        barStrokeWidth: 0,
    },
    // scales: {
    //     xAxes: [{
    //         categorySpacing: 0
    //     }]
    // },
    skipNull: true,
    maintainAspectRatio: false
};

const data = {
    labels: ["KLB", "STB", "ACB", "TCB", "VCB", "BIDV", "AGR"],
    datasets: [
        {
            label: 'ACB',
            data: [800, 550, null, 450, null, 500, 400],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            // barThickness: 30,
            barPercentage: 0.3,
        },
        {
            label: 'VCB',
            data: [null, 350, 250, 200, null, 300, 150],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // barThickness: 30,
            barPercentage: 0.3,
        },
        {
            label: 'BIDV',
            data: [100, 750, 700, 650, 600, null, 600],
            backgroundColor: 'rgba(100, 100, 235, 0.5)',
            // barThickness: 30,
            barPercentage: 0.3,
        }
    ],
};

const data1 = {
    "labels": [
        "KLB",
        "STB",
        "ACB",
        "TCB",
        "VCB",
        "BIDV",
        "AGR"
    ],
    "datasets": [
        {
            "label": "ACB",
            "data": [
                800,
                550,
                null,
                450,
                null,
                500,
                400
            ],
            "backgroundColor": "rgb(34,178,34,0.5)"
        },
        {
            "label": "VCB",
            "data": [
                null,
                350,
                250,
                200,
                null,
                300,
                150
            ],
            "backgroundColor": "rgb(139,0,0,0.5)"
        },
        {
            "label": "BIDV",
            "data": [
                100,
                750,
                700,
                650,
                600,
                null,
                600
            ],
            "backgroundColor": "rgb(255,0,255,0.5)"
        }
    ]
}

export default function BarChart() {
    return <Bar options={options} data={data1} className='w-full h-full' />;
}
