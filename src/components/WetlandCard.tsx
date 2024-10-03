interface WetlandCardProps {
    name: string;
    location: string;
    status: 'good' | 'warning' | 'alert';
    oxygen: number;
    ph: number;
    // temperature: number;
    turbidity: number;
    // flow: { in: number, out: number };
    lastUpdated: string;
}

const WetlandCard: React.FC<WetlandCardProps> = ({ name, location, status, oxygen, ph, turbidity, lastUpdated }) => {
    const statusColor = {
        good: 'bg-green-100 border-green-400',
        warning: 'bg-yellow-100 border-yellow-400',
        alert: 'bg-red-100 border-red-400',
    };
    
    return (
        <div className={`flex flex-col border-l-4 p-4 rounded-lg shadow-md min-w-[25rem]`}>
            <div>
                <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-normal">{name}</h3>
                    <div className={`w-5 h-5 rounded-lg ${statusColor[status]}`}></div>
                </div>
                <p className="text-sm text-gray-500">{location}</p>
            </div>

            <div className="flex mt-[1.88rem] gap-6">
                <div>
                    <p className="text-xs font-medium text-gray-600">pH</p>
                    <p className="text-xl font-normal">{ph}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-600">Oxígeno Disuelto</p>
                    <p className="text-[0.5rem] font-normal text-right">{oxygen} mg/L</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-600">Turbidez</p>
                    <p className="text-[0.5rem] font-normal text-right">{turbidity} NTU</p>
                </div>
            </div>

            <div className="text-xs text-gray-500 mb-4 text-right">Última actualización: {lastUpdated}</div>
        </div>
    );
}

export default WetlandCard;