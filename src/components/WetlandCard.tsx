import ProgressBar from "./ProgressBar";
import { GlobeAmericasIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface WetlandCardProps {
    key: number;
    name: string;
    location: string;
    status: 'good' | 'warning' | 'alert';
    sensors: {
        [key: string]: {
            name: string;
            unity: string;
            value: number;
            max: number;
        };
    };
    lastUpdated: string;
}

const colors = ['blue', 'orange', 'green', 'purple', 'red', 'yellow'];


const WetlandCard: React.FC<WetlandCardProps> = ({ key, name, location, status, sensors, lastUpdated }) => {
    const statusColor = {
        good: 'bg-green1 border-green1',
        warning: 'bg-yellow1 border-yellow1',
        alert: 'bg-red1 border-red1',
    };

    let colorIndex = 0;
    
    return (
        <div key={key} className="
            flex flex-col p-4 rounded-lg shadow-md w-full min-w-72 h-[12rem] bg-white
            md:w-[22rem] cursor-pointer
            hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out
        ">
            <div>
                <div className="flex flex-row justify-between">
                    <h3 className="
                        text-lg font-normal w-[90%] overflow-hidden text-ellipsis whitespace-nowrap
                        lg:text-xl
                        " title={name}
                    >{name}</h3>
                    <div className={`w-5 h-5 rounded-full ${statusColor[status]}`}></div>
                </div>
                <div className="flex gap-2 items-center">
                    <MapPinIcon className="w-4 h-4 text-blue3" />           
                    <p className="text-sm text-gray-500">{location}</p>
                </div>
            </div>

            <div className="flex mt-4 gap-6 md:mt-[1.88rem]">
                {Object.values(sensors).map((sensor) => {
                    const color = colors[colorIndex % colors.length];
                    colorIndex++;
                    return (
                        <SensorSection
                            key={sensor.name}
                            title={sensor.name}
                            label={sensor.name}
                            value={sensor.value}
                            unit={sensor.unity}
                            max={sensor.max}
                            color={color}
                        />
                    );
                })}
            </div>
            <div className="text-xs text-gray-500 text-right">Última actualización: {lastUpdated}</div>
        </div>

    );
}

interface SensorSectionProps {
    title: string;
    label: string;
    value: number;
    unit: string;
    max: number;
    color: 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'yellow';
}

const SensorSection: React.FC<SensorSectionProps> = ({ title, label, value, unit, max, color }) => {
    return (
        <div key={title}>
            <p className="text-xs font-medium text-gray-600">{label}</p>
            <div className="flex flex-row items-baseline">
                <p className="text-xl font-normal">{value}</p>
                <span className="text-[0.5rem] font-normal text-right">{unit}</span>
            </div>
            <ProgressBar value={value} max={max} label={label} color={color} />
        </div>
    );
}

export default WetlandCard;