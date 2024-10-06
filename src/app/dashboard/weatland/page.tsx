import WetlandCard from "@/components/WetlandCard";

const dashboardData = [
    {
        id: 1,
        name: 'Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1Humedal 1',
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
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        ph: 2.5,
        oxygen: 3,
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        ph: 2.5,
        oxygen: 3,
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        ph: 2.5,
        oxygen: 3,
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        ph: 2.5,
        oxygen: 3,
        turbidity: 10,
        flow: { in: 10, out: 8 },
        status: 'good',
        lastUpdated: '2021-10-01 12:00:00',
    },
];


const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-10 w-full mx-auto mt-5 sm:mt-10 lg:mt-24">
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
        // <div className="flex justify-center p-4">
        // </div>
    );
};
export default Dashboard;