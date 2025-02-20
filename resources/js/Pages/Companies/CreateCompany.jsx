import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Folder from '../../Components/Dashboard/ManagerFilesFolder/Folder'; // Componente Folder para gerenciamento de pastas
import Dialog from '../../Components/Dashboard/Dialog'; // Diálogo de upload
import Base from '../../Layouts/Base';
import useDialog from '../../Hooks/useDialog';
import { Inertia } from '@inertiajs/inertia';


export default function CreateCompany({ close }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        cnpj: '',
        codCompany: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('cnpj', data.cnpj);
        formData.append('codCompany', data.codCompany);



        post(route('companies.store'), {
            data: formData,
            onSuccess: () => {
                reset();
                close();
            },
        });
    };

    return (
        <div className="container-fluid py-4">
            <form onSubmit={onSubmit}>
                <div className="row pb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h6>Cadastro da Empresa</h6>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="name">Empresa:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cnpj">CNPJ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="cnpj"
                                        value={data.cnpj}
                                        onChange={(e) => setData({ ...data, cnpj: e.target.value })}
                                    />
                                    {errors.cnpj && <div className="text-danger">{errors.cnpj}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="codCompany">Código da Empresa:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="codCompany"
                                        value={data.codCompany}
                                        onChange={(e) => setData({ ...data, codCompany: e.target.value })}
                                    />
                                    {errors.codCompany && <div className="text-danger">{errors.codCompany}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">
                        Fechar
                    </button>
                    <button type="submit" className="btn bg-gradient-primary">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
}

CreateCompany.layout = (page) => <Base key={page} children={page} title="Cadastro de Empresa" />;
