"use client"
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Page A',
        income: 4000,
        expense: 2400,

    },
    {
        name: 'Page B',
        income: 3000,
        expense: 1398,

    },
    {
        name: 'Page C',
        income: 2000,
        expense: 9800,

    },
    {
        name: 'Page D',
        income: 2780,
        expense: 3908,

    },
    {
        name: 'Page E',
        income: 1890,
        expense: 4800,

    },
    {
        name: 'Page F',
        income: 2390,
        expense: 3800,

    },
    {
        name: 'Page G',
        income: 3490,
        expense: 4300,

    },
];

const FinanceChart = () => {
    return (
        <div className="bg-white rounded-lg h-full p-4">

            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold'>Finance Chart</h1>
                <Image src="/moreDark.png" alt="More" width={20} height={20} />
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}

                >
                    <CartesianGrid strokeDasharray="3 3" stroke='#ddd' />
                    {/* criando uma xaxis com tick a 45 graus negativos */}
                    <XAxis dataKey="name" tick={{ fill: "#d1d5db" }} tickLine={false} angle={-45} textAnchor="end" />
                    <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                    <Tooltip />
                    <Legend align='center' verticalAlign='top' wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />
                    <Line type="monotone" dataKey="expense" stroke="#C3EBFA" strokeWidth={5} />
                    <Line type="monotone" dataKey="income" stroke="#CFCEFF" strokeWidth={5} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
export default FinanceChart;