"use client";

import { useState} from 'react';
// import { useAuth } from '@/hooks/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const logos = {
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
        src_md:'/assets/images/logos/UA_logo_sh_md.png',
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

type LogoKeys = 'unibarranquilla' | 'ua' | 'uniguajira';

const Login = () => {
    // const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [visibleLogo, setVisibleLogo] = useState<LogoKeys | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(null);
        setIsButtonDisabled(false);
    };

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const domain = e.target.value;
        let newLogo: LogoKeys | null = null;

        if (domain.includes('@unibarranquilla.edu.co')) {
            newLogo = 'unibarranquilla';
        } else if (domain.includes('@uniatlantico.edu.co')) {
            newLogo = 'ua';
        } else if (domain.includes('@uniguajira.edu.co')) {
            newLogo = 'uniguajira';
        }

        setVisibleLogo(newLogo);
        setEmail(domain);
        setError(null);
        setIsButtonDisabled(false);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsButtonDisabled(true);
        
        try {
            const response = await axios.post('/api/auth', { email, password});
            localStorage.setItem('token', response.data.token);
            // login(response.data.token);
            console.log('Login successful');
            router.push('/')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // validate if message exists, if not, set a default message
                setError(err.response?.data?.message || 'Correo o contraseña incorrectos');
            } else {
                // set a default message
                setError('Algo salió mal, por favor intenta de nuevo');
            }
            setIsButtonDisabled(false);
        }
    };

    return (
        <div className="flex flex-col h-screen md:flex-row md:items-center md:justify-center">
            <div className='relative hidden flex-col items-center justify-center md:flex h-screen md:w-3/5'>
                <div className='absolute inset-0 bg-[url("/assets/images/bg_working.png")] bg-cover bg-center'></div>
                <div className='absolute inset-0 bg-blue2 opacity-76'></div>
                {visibleLogo ? (
                    <div className='relative flex self-center justify-center  items-center transition-opacity duration-300 opacity-100'>
                        <Image
                            src={logos[visibleLogo].src_md}
                            alt={logos[visibleLogo].alt}
                            width={logos[visibleLogo].width_md}
                            height={logos[visibleLogo].height_md}
                        />
                    </div>
                ) : (
                    <div className='relative flex justify-center items-center mx-8 space-x-5'>
                        <Image src='/assets/images/logos/IUB_logo_sh_md.png' alt='Logo de la Institución Universitaria de Barranquilla' width={148} height={102} />
                        <hr className='w-1 h-5 bg-white' />
                        <Image src='/assets/images/logos/UA_logo_sh_md.png' alt='Logo de la Universidad del Atlantico' width={102} height={156} />
                        <hr className='w-1 h-5 bg-white' />
                        <Image src='/assets/images/logos/UniGuajira_logo_sh_md.png' alt='Logo de la Universidad de La Guajira' width={159} height={156} />
                    </div>
                )}
                
                <p id='subtitle' className='relative text-lg font-normal mt-8 px-20 text-center text-white'>
                    El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.
                </p>
            </div>
            <div className='md:relative md:w-2/5 md:h-screen md:justify-center md:bg-white'>
                <form id='login' action='#' method='POST' onSubmit={handleLogin} className='flex flex-col justify-center md:h-full text-center'>
                    {visibleLogo ? (
                        <div className='
                            flex self-center justify-center  items-center max-w-20 min-w-20 mt-[3.2rem] py-[0.62rem] px-[1.25rem] rounded-[3.125rem] bg-blue1 md:hidden
                            transition-opacity duration-300 opacity-100
                        '>
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
                        <p id='subtile' className='text-sm font-normal mx-[3.62rem] mt-5 md:hidden'>El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.</p>
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
                            onChange={handlePasswordChange}
                            placeholder='Contraseña'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                        />
                        <a href="#" className='text-sm text-end mt-5 text-blue-600'>¿Has olvidado tu contraseña?</a>
                        {error && (
                            <div className="flex items-center bg-red-100 border border-red-400 border-l-4 text-red-700 px-4 py-3 rounded mt-4 w-full shadow-sm">
                                <svg
                                    className="fill-current w-6 h-6 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm.93-10.36a1.07 1.07 0 00-1.86 0L3.14 16.3c-.4.77.15 1.7.93 1.7h12.86c.78 0 1.33-.93.93-1.7L10.93 4.64zM9 8h2v4H9V8zm0 6h2v2H9v-2z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`p-2 mb-4 w-full rounded transition-transform duration-300 transform ${isButtonDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            disabled={isButtonDisabled}
                        >
                            Iniciar sesión
                        </button>
                        {/* <button className='bg-indigo-600 text-white rounded-md py-2 px-4'>Iniciar sesión</button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;