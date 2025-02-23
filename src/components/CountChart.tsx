"use client"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
const data = [
    {
        name: 'Total',
        count: 100,
        fill: 'white',
    },
    {
        name: 'Girls',
        count: 50,
        fill: '#8884d8',
    },
    {
        name: 'Boys',
        count: 50,
        fill: '#83a6ed',
    }
];

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};

const CountChart = () => {
    return (
        <div className="bg-white rounded-xl h-full p-4">
            {/* Title */}
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold'> Students</h1>
                <Image src="/moreDark.png" alt="More" width={20} height={20} />
            </div>

            {/* chart */}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer >
                    <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                        <RadialBar
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image src="/maleFemale.png" alt="More" width={50} height={50} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
            </div>

            {/* buttons */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-lamaSky rounded-full" />
                    <h1 className='font-bold'>1,234</h1>
                    <h2 className='text-xs text-gray-300 '>Boy (55%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-lamaYellow rounded-full" />
                    <h1 className='font-bold'>1,234</h1>
                    <h2 className='text-xs text-gray-300 '>Girls (45%)</h2>


                </div>
            </div>
        </div>
    )
}

export default CountChart;   
