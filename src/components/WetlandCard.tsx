import ProgressBar from "./ProgressBar";

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
        <div className="
            flex flex-col p-4 rounded-lg shadow-md w-80 min-w-64 h-[13rem]
            md:w-[25rem] md:h-[13rem]
        ">
            <div>
                <div className="flex flex-row justify-between">
                    <h3 className="
                        text-lg font-normal w-[90%] overflow-hidden text-ellipsis whitespace-nowrap
                        md:text-xl
                        " title={name}
                    >{name}</h3>
                    <div className={`w-5 h-5 rounded-full ${statusColor[status]}`}></div>
                </div>
                <p className="text-sm text-gray-500">{location}</p>
            </div>

            <div className="flex mt-[1.88rem] gap-6">
                <div>
                    <p className="text-xs font-medium text-gray-600">pH</p>
                    <p className="text-xl font-normal">{ph}</p>
                    <ProgressBar value={ph} max={73} label="pH" color="blue" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-600">Oxígeno Disuelto</p>
                    <div className="flex flex-row items-baseline">
                        <p className="text-xl font-normal">{oxygen}</p>
                        <span className="text-[0.5rem] font-normal text-right">mg/L</span>
                    </div>
                    <ProgressBar value={oxygen} max={10} label="Oxígeno Disuelto" color="orange" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-600">Turbidez</p>
                    <div className="flex flex-row items-baseline">
                        <p className="text-xl font-normal">{turbidity}</p>
                        <span className="text-[0.5rem] font-normal text-right">NTU</span>
                    </div>
                    <ProgressBar value={turbidity} max={15} label="Turbidez" color="green" />
                </div>
            </div>

            <div className="
                text-xs text-gray-500 text-right
                md:mt-[0.44rem]
            ">Última actualización: {lastUpdated}</div>
        </div>
    );
}

export default WetlandCard;