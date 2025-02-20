import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function EditCompany({ close, model }) {
    const { data, setData, put, reset, errors } = useForm({
        name: model.name || "",
        cnpj: model.cnpj || "",
        codCompany: model.codCompany || "",
    });
    
    useEffect(() => {
        if (model) {
            setData({
                name: model.name || "",
                cnpj: model.cnpj || "",
                codCompany: model.codCompany || "",
                
            });
        }
    }, [model]); ;
    


    const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("companies.update", model.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                close();
            },
        });
    };
    

    return (
        <form onSubmit={onSubmit}>
            <div className="modal-body">
                <div className="form-group">
                    <label htmlFor="name">Empresa:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={data.name}
                        onChange={onChange}
                    />
                    {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="cnpj">CNPJ:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cnpj"
                        value={data.cnpj}
                        onChange={onChange}
                    />
                    {errors.cnpj && <div className="text-danger mt-1">{errors.cnpj}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="codCompany">codCompany:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codCompany"
                        value={data.codCompany}
                        onChange={onChange}
                    />
                    {errors.codCompany && <div className="text-danger mt-1">{errors.codCompany}</div>}
                </div>

            </div>

            <div className="modal-footer">
                <button
                    type="button"
                    className="btn bg-gradient-secondary"
                    onClick={close}
                >
                    Fechar
                </button>
                <button type="submit" className="btn bg-gradient-primary">
                    Atualizar
                </button>
            </div>
        </form>
    );
}
