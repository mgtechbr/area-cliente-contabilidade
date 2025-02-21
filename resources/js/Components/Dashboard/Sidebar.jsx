import { Link } from '@inertiajs/inertia-react'
import React from 'react'

export default function Sidebar({ user }) {    
    return (        
        <aside className="sidenav bg-default navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 " id="sidenav-main">
            <div className="sidenav-header">
                <i className="fas fa-times p-3 cursor-pointer opacity-5 position-absolute end-0 top-0 d-none d-xl-none opacity-8 text-white" aria-hidden="true" id="iconSidenav" />
                <Link className="navbar-brand m-0" href={route('login')} target="_blank">
                    <span className="ms-1 font-weight-bold"> Franco Gestão Empresarial</span>
                </Link>
            </div>
            <hr className="horizontal dark mt-0" />
            <div className="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
                <ul className="navbar-nav">
                    {user.role === 'admin' && (
                        <>
                            <li className="nav-item">
                                <Link className={`${route().current('dashboard') && 'active'} nav-link`} href={route('dashboard')}>
                                    <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                        <i className="ni ni-tv-2 text-primary text-sm opacity-10" />
                                    </div>
                                    <span className="nav-link-text ms-1">Dashboard</span>
                                </Link>
                            </li>
                            
                            <li className="nav-item mt-3">
                                <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Gerenciar</h6>
                            </li>
                            
                            <li className="nav-item">
                                <Link className={`${route().current('companies.*') && 'active'} nav-link`} href={route('companies.index')}>
                                    <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                        <i className="fas fa-building text-warning text-sm opacity-10" />
                                    </div>
                                    <span className="nav-link-text ms-1">Empresas</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={`${route().current('users.*') && 'active'} nav-link`} href={route('users.index')}>
                                    <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                        <i className="fas fa-user-lock text-warning text-sm opacity-10" />
                                    </div>
                                    <span className="nav-link-text ms-1">Usuários</span>
                                </Link>
                            </li>
                        </>
                    )}

                    <li className="nav-item mt-3">
                        <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Empresa</h6>
                    </li>

                    <li className="nav-item">
                        <Link
                            className={`${route().current('onedrive.files', { company: user.company_id }) && 'active'} nav-link`}
                            href={route('onedrive.files', { company: user.company_id })}
                        >
                            <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                <i className="fas fa-folder-open text-info text-sm opacity-10" />
                            </div>
                            <span className="nav-link-text ms-1">Empresa Arquivos</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                    <Link
                        className={`${route().current('onedrive.login') && 'active'} nav-link`}
                        href={route('onedrive.redirect')}  // Redireciona para o método que inicia a autenticação do OneDrive
                        target="_blank" // Garante que a autenticação aconteça em uma nova guia
                    >
                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                        <i className="fas fa-folder-open text-info text-sm opacity-10" />
                        </div>
                        <span className="nav-link-text ms-1">Conectar One Drive</span>
                    </Link>
                    </li>


                    <li className="nav-item">
                        <Link className="nav-link" as='a' method='post' href={route('logout')}>
                            <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                <i className="fas fa-sign-out-alt text-danger text-sm opacity-10"></i>
                            </div>
                            <span className="nav-link-text ms-1">Sair</span>
                        </Link>
                    </li>
                </ul>
            </div>                
        </aside>
    )
}
