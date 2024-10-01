"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const logos = {
    unibarranquilla: {
        src: '/assets/images/logos/IUB_logo_sh_sm.png',
        alt: 'Logo de la Institución Universitaria de Barranquilla',
        width: 42,
        height: 26,
        width_md: 148,
        height_md: 102,
    },
    ua: {
        src:'/assets/images/logos/UA_logo_sh_sm.png',
        alt: 'Logo de la Universidad del Atlantico',
        width: 27,
        height: 36,
        width_md: 102,
        height_md: 156,
    },
    uniguajira: {
        src: '/assets/images/logos/UniGuajira_logo_sh_sm.png',
        alt: 'Logo de la Universidad de La Guajira',
        width: 40,
        height: 30,
        width_md: 159,
        height_md: 156,
    },
};


const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [visibleLogo, setVisibleLogo] = useState<string | null>(null);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (visibleLogo) {
            setFade(true);
        } else {
            setFade(false);
        }
    }, [visibleLogo]);

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const domain = e.target.value;

        if (domain.includes('@unibarranquilla.edu.co')) {
            setVisibleLogo('unibarranquilla');
        } else if (domain.includes('@uniatlantico.edu.co')) {
            setVisibleLogo('ua');
        } else if (domain.includes('@uniguajira.edu.co')) {
            setVisibleLogo('uniguajira');
        } else {
            setVisibleLogo(null); // Hide all logos
        }
        setEmail(domain);
        console.log(e.target.value);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth', { email, password});
            localStorage.setItem('token', response.data.token);
            router.push('/')
        } catch (error) {
            // validate if message exists, if not, set a default message
            // setError(error.message || 'Correo o contraseña incorrectos');
            setError('Correo o contraseña incorrectos');
        }
        // console.log('Email:', email);
        // console.log('Password:', password);
    };

    return (
        <div className="flex flex-col h-screen md:flex-row md:items-center md:justify-center">
            <div className='relative hidden flex-col items-center justify-center md:flex h-screen md:w-3/5'>
                <div className='absolute inset-0 bg-[url("/assets/images/bg_working.png")] bg-cover bg-center'></div>
                <div className='absolute inset-0 bg-blue2 opacity-76'></div>
                <div className='relative flex justify-center items-center mx-8 space-x-5'>
                    <Image src='/assets/images/logos/IUB_logo_sh_md.png' alt='Logo de la Institución Universitaria de Barranquilla' width={148} height={102} />
                    <hr className='w-1 h-5 bg-white' />
                    <Image src='/assets/images/logos/UA_logo_sh_md.png' alt='Logo de la Universidad del Atlantico' width={102} height={156} />
                    <hr className='w-1 h-5 bg-white' />
                    <Image src='/assets/images/logos/UniGuajira_logo_sh_md.png' alt='Logo de la Universidad de La Guajira' width={159} height={156} />
                </div>
                <p id='subtitle' className='relative text-lg font-normal mt-8 px-20 text-center text-white'>El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.</p>
            </div>
            <div className='md:relative md:w-2/5 md:h-screen md:justify-center md:bg-white'>
                <form id='login' action='#' method='POST' onSubmit={handleLogin} className='flex flex-col justify-center md:h-full text-center'>
                    {visibleLogo ? (
                        <div className={`
                            flex self-center justify-center  items-center max-w-20 mt-[3.2rem] py-[0.62rem] px-[1.25rem] rounded-[3.125rem] bg-blue1 md:hidden
                            transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}
                        `}>
                            <Image
                                src={logos[visibleLogo].src}
                                alt={logos[visibleLogo].alt}
                                width={logos[visibleLogo].width}
                                height={logos[visibleLogo].height}
                            />
                        </div>
                    ) : (
                        <div className='
                            flex self-center justify-center items-center max-w-[20rem] min-w-[12rem]
                            py-[0.62rem] px-[1.25rem] mt-[3.2rem] mx-[6.38rem] rounded-[3.125rem] bg-blue1 gap-x-5
                            sm:min-w-[25rem]
                            md:hidden
                        '>
                            <Image src='/assets/images/logos/IUB_logo_sh_sm.png' alt='Logo de la Institución Universitaria de Barranquilla' width={42} height={26} />
                            <hr className='w-1 h-5 bg-white' />
                            <Image src='/assets/images/logos/UA_logo_sh_sm.png' alt='Logo de la Universidad del Atlantico' width={27} height={36} />
                            <hr className='w-1 h-5 bg-white' />
                            <Image src='/assets/images/logos/UniGuajira_logo_sh_sm.png' alt='Logo de la Universidad de La Guajira' width={40} height={37} />
                        </div>
                    )}
                    
                    <div>
                        <h2 className='text-4xl font-medium mt-[9.8rem] md:mt-0 md:mb-20'>Inicio de sesión</h2>
                        <p id='subtile' className='text-sm font-normal mx-[3.62rem] md:hidden'>El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.</p>
                    </div>
                    <div className='flex flex-col space-y-4 mt-[3.87rem] mx-[1.88rem]'>
                        <input
                            type='email'
                            value={email}
                            onChange={handleDomainChange}
                            placeholder='Correo electrónico'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                        />
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Contraseña'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <button className='bg-indigo-600 text-white rounded-md py-2 px-4'>Iniciar sesión</button>
                    </div>
                    <a href="#" className='text-sm'>¿Has olvidado tu contraseña?</a>
                </form>
            </div>
        </div>
    );
};

export default Login;