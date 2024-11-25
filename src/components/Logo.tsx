import useMediaQuery from '@/hooks/useMediaQuery';
import Image from 'next/image';
import { LogoKeys } from '@/types'; // Adjust the import path as necessary

export const Logo = ({ type }: { type: LogoKeys }) => {
    const { src, src_md, alt, width, height, width_md, height_md } = logos[type];
    const isMobile = useMediaQuery('max-width: 768px');
    return (
        <Image
            src={isMobile ? src : src_md}
            alt={alt}
            width={isMobile ? width : width_md}
            height={isMobile ? height : height_md}
        />
    );
};

export const logos = {
    unibarranquilla: {
        src: '/assets/images/logos/IUB_logo_sh_sm.png',
        src_md: '/assets/images/logos/IUB_logo_sh_md.png',
        alt: 'Logo de la Institución Universitaria de Barranquilla',
        width: 42,
        height: 26,
        width_md: 148,
        height_md: 102,
    },
    ua: {
        src: '/assets/images/logos/UA_logo_sh_sm.png',
        src_md: '/assets/images/logos/UA_logo_sh_md.png',
        alt: 'Logo de la Universidad del Atlantico',
        width: 27,
        height: 36,
        width_md: 102,
        height_md: 156,
    },
    uniguajira: {
        src: '/assets/images/logos/UniGuajira_logo_sh_sm.png',
        src_md: '/assets/images/logos/UniGuajira_logo_sh_md.png',
        alt: 'Logo de la Universidad de La Guajira',
        width: 40,
        height: 30,
        width_md: 159,
        height_md: 156,
    },
};