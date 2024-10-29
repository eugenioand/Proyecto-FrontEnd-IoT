import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    color?: string;
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
                    className={`h-full rounded-sm transition-width duration-300 ease-in-out bg-${color}-500`}
                    style={{ width: `${widthPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
