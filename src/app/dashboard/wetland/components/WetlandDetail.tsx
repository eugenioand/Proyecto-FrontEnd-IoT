import { MapPinIcon } from '@heroicons/react/24/solid';
import  Map from '@/components/NewMap';
import PHIndicator from './PHIndicator';
import Carousel from '@/app/dashboard/wetland/components/Carousel';


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
        <div className="flex flex-col w-full gap-4">
            <div className='flex flex-col w-full rounded-md p-4 bg-white'>
                <h2>{name}</h2>
                <div className='flex gap-2'>
                    <MapPinIcon className="w-5 h-5 text-blue3" />
                    <p className='text-sm text-gray-500'>{location}</p>
                </div>
                <div className='h-60 w-full'>
                    <Map center={[51.505, -0.09]} zoom={-0.09}  />
                </div>
            </div>
            <div className='rounded-md p-4 h-60'>
                <Carousel items={sensors} />
            </div>
        </div>
    );
};

export default WetlandDetail;