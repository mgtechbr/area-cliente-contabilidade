import React from 'react';
import Base from '../Layouts/Base';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

export default function Dashboard(props) {
    const { companies, users } = props.stats;

    const data = [
        { name: 'Usuários', value: users },
        { name: 'Empresas', value: companies }
    ];

    const recentActivities = [
        "Usuário João cadastrou um novo imóvel",
        "Empresa XPTO atualizou seus dados",
        "Novo usuário Maria se registrou",
        "Imóvel de código #234 foi vendido"
    ];

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-xl-6 col-sm-6 mb-4">
                    <div className="card text-center p-3">
                        <h5 className="font-weight-bolder">Usuários cadastrados</h5>
                        <h3><CountUp end={users} duration={2} /></h3>
                    </div>
                </div>
                <div className="col-xl-6 col-sm-6 mb-4">
                    <div className="card text-center p-3">
                        <h5 className="font-weight-bolder">Empresas cadastradas</h5>
                        <h3><CountUp end={companies} duration={2} /></h3>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <div className="card p-3">
                        <h5 className="font-weight-bolder">Estatísticas</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card p-3">
                        <h5 className="font-weight-bolder">Atividades Recentes</h5>
                        <ul>
                            {recentActivities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <Base children={page} title={"Dashboard"} />;