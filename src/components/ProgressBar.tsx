import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    color?: keyof typeof colors;
}

const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = 'blue' }) => {
    const widthPercentage = (value / max) * 100;

    return (
        <div className="mb-4">
            {/* <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-medium">{value}/{max}</span>
            </div> */}
            <div className="w-full h-[0.1875rem] mt-[0.62rem] bg-gray-200 rounded-sm">
                <div
                    className={`h-full rounded-sm transition-width duration-300 ease-in-out ${colors[color]}`}
                    style={{ width: `${widthPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
