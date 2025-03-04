import { Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Dialog from '../../Components/Dashboard/Dialog';
import Base from '../../Layouts/Base';
import useDialog from '../../Hooks/useDialog';
import EditCompany from '../../Components/Dashboard/Companies/EditCompany.jsx';
import { Inertia } from '@inertiajs/inertia';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Index(props) {
    const companies = props.companies.data || []; // Evita erro caso seja undefined

    const [state, setState] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [UpdateDialogHandler, UpdateCloseTrigger, UpdateTrigger] = useDialog();
    const [destroyDialogHandler, destroyCloseTrigger, destroyTrigger] = useDialog();

    const openUpdateDialog = (company) => {
        if (company) {
            setState(company);
            UpdateDialogHandler();
        }
    };

    const openDestroyDialog = (company) => {
        if (company) {
            setState(company);
            destroyDialogHandler();
        }
    };

    const destroyCompany = () => {
        Inertia.delete(route('companies.destroy', state.id), {
            onSuccess: () => {
                setSuccessMessage('Empresa excluída com sucesso!');
                destroyCloseTrigger();
            },
            onError: () => {
                setErrorMessage('Erro ao excluir empresa!');
            }
        });
    };

    return (
        <>
            <div className="container-fluid py-4">

                {/* Mensagens de Sucesso e Erro */}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Modais de Edição e Exclusão */}
                <Dialog trigger={UpdateTrigger} title={`Editar Empresa: ${state?.name || 'Empresa'}`}>
                    <EditCompany model={state} close={UpdateCloseTrigger} />
                </Dialog>

                <Dialog trigger={destroyTrigger} title={`Excluir Empresa: ${state?.name || 'Empresa'}`}>
                    <p>Tem certeza que deseja excluir a empresa?</p>
                    <div className="modal-footer">
                        <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" onClick={destroyCompany} className="btn bg-gradient-danger">Deletar</button>
                    </div>
                </Dialog>

                <div className="row pb-4">
                    <div className="col-12 w-100">
                        <div className="card h-100 w-100">
                            <div className="card-header pb-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Empresas</h6>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end">
                                        <Link href={route('companies.create')} className="btn bg-gradient-success btn-block mb-3">
                                            Cadastrar nova empresa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body px-0 pt-0 pb-2">
                                <div className="table-responsive-xxl p-0" width="100%">
                                    <table className="table align-items-center justify-content-center mb-0" width="100%">
                                        <thead>
                                            <tr>
                                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">Número da Empresa</th>
                                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Empresa</th>
                                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">CNPJ</th>
                                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.length > 0 ? (
                                                companies.map((company, index) => (
                                                    
                                                    <tr key={company.id}>
                                                        <td className='text-center'>{company.codCompany}</td>
                                                        <td className='text-left'>
                                                            <div className="d-flex px-2">
                                                                <div>
                                                                    <img src="/img/company-icon.png" className="avatar avatar-sm me-3" alt="Avatar" />
                                                                </div>
                                                                <div className="my-auto">
                                                                    <h6 className="mb-0 text-sm">{company.name}</h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='text-left'>
                                                            <p className="text-sm font-weight-bold mb-0">{company.cnpj}</p>
                                                        </td>
                                                        <td className="align-middle text-center" width="10%">
                                                            <div>
                                                                <button type="button" onClick={() => openUpdateDialog(company)} className="btn btn-vimeo btn-icon-only mx-2">
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </button>
                                                                <button type="button" onClick={() => openDestroyDialog(company)} className="btn btn-youtube btn-icon-only">
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">Nenhuma empresa encontrada.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Paginação */}
                {props.meta?.links?.length > 0 && (
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            {props.meta.links.map((link, k) => (
                                <li key={k} className="page-item">
                                    <Link
                                        disabled={!link.url}
                                        as="button"
                                        className={`${link.active ? 'bg-info' : ''} ${!link.url && 'btn bg-gradient-secondary text-white'} page-link`}
                                        href={link.url || ''}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <Base key={page} children={page} title={"Gerenciamento de Empresas"} />;
