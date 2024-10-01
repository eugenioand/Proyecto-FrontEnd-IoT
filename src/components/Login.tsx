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
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //     <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
    //     <h2 className="text-2xl font-bold text-center text-gray-700">Iniciar Sesión</h2>
    //     <form onSubmit={handleLogin} className="space-y-4">
    //         <div>
    //         <label htmlFor="email" className="block text-sm font-medium text-gray-600">
    //             Correo Electrónico
    //         </label>
    //         <input
    //             id="email"
    //             type="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             required
    //             className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //         </div>
    //         <div>
    //         <label htmlFor="password" className="block text-sm font-medium text-gray-600">
    //             Contraseña
    //         </label>
    //         <input
    //             id="password"
    //             type="password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //             className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //         </div>
    //         <button
    //         type="submit"
    //         className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none"
    //         >
    //         Iniciar Sesión
    //         </button>
    //     </form>
    //     </div>
    // </div>
        <div className="flex flex-col h-screen md:flex-row md:items-center md:justify-center">
            <div className='relative hidden flex-col items-center justify-center md:flex h-screen md:w-3/5'>
                <div className='absolute inset-0 bg-[url("/assets/images/bg_working.png")] bg-cover bg-center'></div>
                <div className='absolute inset-0 bg-blue2 opacity-76'></div>
                <div className='relative flex justify-center items-center space-x-5'>
                    <Image src='/assets/images/logos/IUB_logo_sh_sm.png' alt='Logo de la Institución Universitaria de Barranquilla' width={42} height={26} />
                    <hr className='w-1 h-5 bg-white' />
                    <Image src='/assets/images/logos/UA_logo_sh_sm.png' alt='Logo de la Universidad del Atlantico' width={27} height={36} />
                    <hr className='w-1 h-5 bg-white' />
                    <Image src='/assets/images/logos/UniGuajira_logo_sh_sm.png' alt='Logo de la Universidad de La Guajira' width={40} height={37} />
                </div>
                <p id='subtitle' className='relative text-sm font-normal mt-8 text-center text-white'>El monitoreo empieza aquí. Gracias por ser parte de la protección de nuestros humedales.</p>
            </div>
            <div id='login' className='flex flex-col text-center md:relative md:w-2/5 md:h-screen md:justify-center md:bg-white'>
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
            </div>
        </div>
    );
};

export default Login;

// {/* <form action='#' method='POST' className='space-y-6' onSubmit={handleLogin}>
//     <div className='mt-2'>
//         <input
//             id='email'
//             className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
//             name='email'
//             type='email'
//             value={email}
//             placeholder='Correo electrónico'
//             onChange={(e) => setEmail(e.target.value)}
//             autoComplete='email'
//             required
//         />
//     </div>
//     <input
//         type='password'
//         value={password}
//         placeholder='Contraseña'
//         onChange={(e) => setPassword(e.target.value)}
//         required
//     />
//     <button type='submit'>Iniciar Sesión</button>
// </form> */}