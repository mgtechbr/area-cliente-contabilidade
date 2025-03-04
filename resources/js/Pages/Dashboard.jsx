import React, { useEffect, useState } from 'react';
import Base from '../Layouts/Base';
import axios from 'axios';

export default function Dashboard(props) {
    const { companies, users } = props.stats; 

    console.log( props.stats)
    return (
        <>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-xl-6 col-sm-6 mb-4">
                        <div className="card">
                            <div className="card-body p-3">
                                <h5 className="font-weight-bolder">Usuários cadastrados</h5>
                                <h3>{users}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-sm-6 mb-4">
                        <div className="card">
                            <div className="card-body p-3">
                                <h5 className="font-weight-bolder">Empresas cadastradas</h5>
                                <h3>{companies}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-lg-12">
                        <div className="card card-carousel overflow-hidden h-100 p-0">
                            <div id="carouselExampleCaptions" className="carousel slide h-100" data-bs-ride="carousel">
                                <div className="carousel-inner border-radius-lg h-100">
                              
                                </div>
                                <button className="carousel-control-prev w-5 me-3" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next w-5 me-3" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <Base children={page} title={"Dashboard"} />;