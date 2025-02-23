'use client';


import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

const data = [
    {
        name: 'Mon',
        present: 60,
        absent: 40,
    },
    {
        name: 'Tue',
        present: 30,
        absent: 13,
    },
    {
        name: 'Wed',
        present: 20,
        absent: 98,

    },
    {
        name: 'Thu',
        present: 27,
        absent: 39,

    },
    {
        name: 'Fri',
        present: 18,
        absent: 48,

    },
    {
        name: 'Sat',
        present: 23,
        absent: 38,

    },
    {
        name: 'Sun',
        present: 34,
        absent: 43,

    },
];


const AttendanceChart = () => {

    return (

        <div className="bg-white rounded-lg h-full p-4">

            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold'>Attendance</h1>
                <Image src="/moreDark.png" alt="More" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    barSize={20}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc"/>
                    <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
                    <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius:"10px", borderColor: "lightgray" }}/>
                    <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
                    <Bar dataKey="present" fill="#8884d8"
                        legendType='circle' radius={[7, 7, 0, 0]} />
                    <Bar dataKey="absent" fill="#82ca9d" legendType='circle' radius={[7, 7, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
};

export default AttendanceChart;