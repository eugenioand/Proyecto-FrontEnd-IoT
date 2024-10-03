import Header from "@/components/Header";
import WetlandCard from "@/components/WetlandCard";

const dashboardData = [
    {
        id: 1,
        name: 'Humedal 1',
        location: 'Ubicación 1',
        ph: 7.5,
        oxygen: 5,
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'warning',
        lastUpdated: '2021-10-01 12:00:00',
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        ph: 2.5,
        oxygen: 3,
        turbidity: 30,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
    // Agrega más humedales aquí
];


const Dashboard = () => {
    return (
        <div>
            <Header />
            <main className="flex">
                <div className="flex flex-wrap justify-center p-4">
                    {dashboardData.map((wetland) => (
                        <WetlandCard
                            key={wetland.id}
                            name={wetland.name}
                            location={wetland.location}
                            ph={wetland.ph}
                            oxygen={wetland.oxygen}
                            turbidity={wetland.turbidity}
                            status={wetland.status as 'good' | 'warning' | 'alert'}
                            lastUpdated={wetland.lastUpdated}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;