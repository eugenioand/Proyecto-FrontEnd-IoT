import Header from "@/components/Header";
import WetlandCard from "@/components/WetlandCard";

const dashboardData = [
    {
        id: 1,
        name: 'Humedal 1',
        location: 'Ubicación 1',
        status: 'warning',
        flow: { in: 10, out: 8 },
    },
    {
        id: 2,
        name: 'Humedal 2',
        location: 'Ubicación 2',
        status: 'good',
        flow: { in: 10, out: 8 },
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
                            status={wetland.status}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;