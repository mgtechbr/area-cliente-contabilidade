import { Head, usePage } from '@inertiajs/inertia-react'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../Components/Dashboard/Navbar'
import Sidebar from '../Components/Dashboard/Sidebar'
import Footer from '../Components/Dashboard/Footer'

export default function Base({ children, title }) {
    const { flash, auth } = usePage().props;  // Acessar auth aqui

    // Exibir toast apenas se flash existir e tiver valores válidos
    useEffect(() => {
        if (flash?.type && flash?.message) {
            toast[flash.type](flash.message);
        }
    }, [flash]);

    return (
        <div className="g-sidenav-show bg-gray-100">
            <div className="min-height-300 bg-primary position-absolute w-100"></div>
            <Head title={title} />
            {/* Passando o usuário para o Sidebar */}
            <Sidebar user={auth?.user} />
            <main className="main-content position-relative border-radius-lg d-flex flex-column min-vh-100">
                <Navbar pageName={title} />
                <Toaster position="top-center" duration={4000} />
                {children}
                <Footer />
            </main>
        </div>
    );
}
