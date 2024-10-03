"use client";

import Header from './Header';
import WetlandCard from './WetlandCard';



const WetlandDashboard = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-wrap justify-center p-4">
                {dashboardData.map((wetland) => (
                    <WetlandCard key={wetland.id} {...wetland} />
                ))}
            </div>
        </div>
    );
};

export default WetlandDashboard;