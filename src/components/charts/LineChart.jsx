
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
            text: 'Chart.js Line Chart',
        },
    },
    skipNull: true,
    maintainAspectRatio: false
};


const data = {
    labels: ['04/10', '05/10', '6/10', '7/10'],
    datasets: [
        {
            label: 'VCB',
            data: [1000, 1100, 982, 1834],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'TCB',
            data: [2000, 1900, 1645, 1745],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'BIDV',
            data: [3000, 2456, 1745, 1303],
            borderColor: 'rgb(153, 0, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export default function LineChart() {
    return <Line options={options} data={data} />;
}
