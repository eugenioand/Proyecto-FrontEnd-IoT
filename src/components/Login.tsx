// import ThemeToggleButton from './ThemeToggleButton';
import Image from 'next/image';
import { useState } from 'react';

const Login = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const handleLogin = (e: React.FormEvent) => {
    // e.preventDefault();

    // // Aquí va la lógica para manejar el login
    
    // console.log('Email:', email);
    // console.log('Password:', password);
    // };

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
                <form id='login' action='#' method='POST' className='flex flex-col justify-center md:h-full text-center'>
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
                    <div>
                        <h2 className='text-4xl font-medium mt-[9.8rem] md:mt-0 md:mb-20'>Inicio de sesión</h2>
                        <p id='subtile' className='text-sm font-normal mx-[3.62rem] md:hidden'>El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.</p>
                    </div>
                    <div className='flex flex-col space-y-4 mt-[3.87rem] mx-[1.88rem]'>
                        <input
                            type='email'
                            placeholder='Correo electrónico'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                        />
                        <input
                            type='password'
                            placeholder='Contraseña'
                            className='border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                        />
                        <button className='bg-indigo-600 text-white rounded-md py-2 px-4'>Iniciar sesión</button>
                    </div>
                    <a href="#" className='text-sm'>¿Has olvidado tu contraseña?</a>
                </form>
            </div>
        </div>
    );
};

export default Login;