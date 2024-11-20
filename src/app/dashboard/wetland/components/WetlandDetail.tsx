import { MapPinIcon } from '@heroicons/react/24/solid';
import  Map from '@/components/NewMap';
import PHIndicator from './PHIndicator';

interface WetlandDetailProps {
    id: string;
    name: string;
    location: string;
    status: 'good' | 'warning' | 'alert';
    nodes: {
        [key: string]: {
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
        };
    };
}

const WetlandDetail: React.FC<WetlandDetailProps> = ({ id, name, location, status, nodes }) => {
    const sensors = Object.values(nodes).map(node => node.sensors);
    return (
        <div className="flex w-full">
            <div className='flex flex-col w-full rounded-md p-4 bg-white'>
                <h2>{name}</h2>
                <div className='flex gap-2'>
                    <MapPinIcon className="w-5 h-5 text-blue3" />
                    <p className='text-sm text-gray-500'>{location}</p>
                </div>
                <Map center={[51.505, -0.09]} zoom={-0.09}  />
            </div>
            <div className='grid grid-cols-1 gap-3 lg:gird-cols-3'>
                {sensors.map((sensor) => (
                    <PHIndicator value={sensor.name} />
                ))}
            </div>
        </div>
    );
};

export default WetlandDetail;