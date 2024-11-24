"use client";

import { useEffect, useState} from 'react';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import ErrorModal from '@/components/dialogs/ErrorModal';
import { debounce } from '@mui/material';
import { Logo, logos } from '@/components/Logo';
import { LogoKeys } from '@/types';
import { useRouter } from "next/navigation";
import LoadingSpinner from '@/components/LoadingSpinner';

const Login = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [visibleLogo, setVisibleLogo] = useState<LogoKeys | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            
            router.push("/dashboard");
        }
    }, [isAuthenticated, loading, router]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const determineLogo = (domain: string): LogoKeys | null => {
        if (domain.includes("@unibarranquilla.edu.co")) return "unibarranquilla";
        if (domain.includes("@uniatlantico.edu.co")) return "ua";
        if (domain.includes("@uniguajira.edu.co")) return "uniguajira";
        return null;
    };

    const debouncedDomainChange = debounce((domain: string) => {
        const logoKey = determineLogo(domain);
        setVisibleLogo(logoKey);
    }, 300);

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const domain = e.target.value;
        setEmail(domain);
        debouncedDomainChange(domain);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsButtonDisabled(true);
            await login(email, password);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
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
                        <Logo type={visibleLogo} />
                    </div>
                ) : (
                    <div className="relative flex justify-center items-center mx-8 space-x-5">
                        {Object.keys(logos).map((key) => ( 
                            // <Image
                            //     key={key}
                            //     src={logos[key as LogoKeys].src_md}
                            //     alt={logos[key as LogoKeys].alt}
                            //     width={logos[key as LogoKeys].width_md}
                            //     height={logos[key as LogoKeys].height_md}
                            // />
                            <Logo key={key} type={key as LogoKeys} />
                        ))}
                    </div>
                )}
                
                <p id='subtitle' className='relative text-lg font-normal mt-8 px-20 text-center text-white'>
                    El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.
                </p>
            </div>

            {/* Panel derecho con formulario */}
            <div className='md:relative md:w-2/5 md:h-screen md:justify-center md:bg-white'>
                <form id='login' action='#' method='POST' onSubmit={handleLogin} className='flex flex-col justify-center md:h-full text-center'>
                    {visibleLogo ? (
                        <div className='
                            flex self-center justify-center  items-center max-w-20 min-w-20 mt-[3.2rem] py-[0.62rem] px-[1.25rem] rounded-[3.125rem] bg-blue1 md:hidden
                            transition-opacity duration-300 opacity-100
                        '>
                            <Logo type={visibleLogo} />
                        </div>
                    ) : (
                        <div className='
                            flex self-center justify-center items-center max-w-[20rem] min-w-[12rem]
                            py-[0.62rem] px-[1.25rem] mt-[3.2rem] mx-[6.38rem] rounded-[3.125rem] bg-blue1 gap-x-5
                            sm:min-w-[25rem]
                            md:hidden
                        '>
                            {Object.keys(logos).map((key) => (
                                <Image
                                    key={key}
                                    src={logos[key as LogoKeys].src}
                                    alt={logos[key as LogoKeys].alt}
                                    width={logos[key as LogoKeys].width}
                                    height={logos[key as LogoKeys].height}
                                />
                            ))}
                            {/* <Image src='/assets/images/logos/IUB_logo_sh_sm.png' alt='Logo de la Institución Universitaria de Barranquilla' width={42} height={26} />
                            <hr className='w-1 h-5 bg-white' />
                            <Image src='/assets/images/logos/UA_logo_sh_sm.png' alt='Logo de la Universidad del Atlantico' width={27} height={36} />
                            <hr className='w-1 h-5 bg-white' />
                            <Image src='/assets/images/logos/UniGuajira_logo_sh_sm.png' alt='Logo de la Universidad de La Guajira' width={40} height={37} /> */}
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
                            required
                        />
                        <input
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder='Contraseña'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                            min={1}
                            required
                        />
                        <a href="#" className='text-sm text-end mt-5 text-blue-600'>¿Has olvidado tu contraseña?</a>
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
            { error && <ErrorModal errorMessage={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default Login;