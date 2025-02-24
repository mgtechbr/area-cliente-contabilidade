import { useForm } from '@inertiajs/inertia-react'
import React, { useEffect } from 'react'

export default function EditUser({close, model, companies}) {

    const { data, setData, put, reset, errors } = useForm({
        name: model.name || '',
        email: model.email || '',
        username: model.username || '',
        password: model.password || '',
        company_id: model.company_id || ''
    });

    const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', model.id), data, {
            onSuccess: () => {
                reset();
                close();
            },
        });        
    }

     useEffect(() => {
        setData({
            name: model.name || '',
            email: model.email || '',
            username: model.username || '',
            password: model.password || '',
            company_id: model.company_id || ''
        });
    }, [model]);

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name" className="col-form-label">Name:</label>
                            <input type="text" className="form-control" name='name' value={data.name} onChange={onChange} id="name"/>
                            {errors && <div className='text-danger mt-1'>{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="username" className="col-form-label">Username:</label>
                            <input type="text" className="form-control" name='username' value={data.username} onChange={onChange} id="username"/>
                            {errors && <div className='text-danger mt-1'>{errors.username}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-form-label">Email:</label>
                            <input type="email" className="form-control" name='email' value={data.email} onChange={onChange} id="email"/>
                            {errors && <div className='text-danger mt-1'>{errors.email}</div>}
                        </div>
                       <div className="form-group">
                            <label htmlFor="company_id" className="col-form-label">Selecione uma Empresa:</label>
                            <select className="form-control" name="company_id" value={data.company_id} onChange={onChange} id="company_id">
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <div className='text-danger mt-1'>{errors.company_id}</div>}
                        </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" className="btn bg-gradient-primary">Atualizar</button>
                </div>
            </form>
        </>

    )
}
