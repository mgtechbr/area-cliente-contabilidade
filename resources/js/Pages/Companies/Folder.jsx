import { Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Dialog from '../../Components/Dashboard/Dialog';
import Base from '../../Layouts/Base';
import useDialog from '../../Hooks/useDialog';
import { Inertia } from '@inertiajs/inertia';

export default function Folder(props) {
    const { company, directories } = props;
    const [state, setState] = useState([]);
    const [addDialogHandler, addCloseTrigger, addTrigger] = useDialog();
    const [currentDirectory, setCurrentDirectory] = useState(null);

    // Função para lidar com o clique em uma pasta e expandir a navegação
    const handleFolderClick = (directory) => {
        setCurrentDirectory(directory);
    };

    // Função para realizar o download do arquivo
    const handleFileDownload = (file) => {
        // Você pode criar um link de download para o arquivo diretamente
        const fileUrl = `/storage/app/${file}`; // Caminho do arquivo no servidor
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.split('/').pop(); // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container-fluid py-4">
            <Dialog trigger={addTrigger} title="Upload New Files">
                {/* Criar um formulário para upload de arquivos aqui */}
            </Dialog>

            <div className="row pb-4">
                <div className="col-12 w-100">
                    <div className="card h-100 w-100">
                        <div className="card-header pb-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Arquivos da empresa: {company.name}</h6>
                                </div>
                                <div className="col-md-6 d-flex justify-content-end">
                                    <button
                                        onClick={addDialogHandler}
                                        type="button"
                                        className="btn bg-gradient-success btn-block mb-3"
                                    >
                                        Criar nova pasta ou arquivo
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive-xxl p-0" width="100%">
                                <table className="table align-items-center justify-content-center mb-0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">Pasta</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Arquivos</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {directories.map((directory, index) => (
                                            <tr key={index}>
                                                <td className='text-center' onClick={() => handleFolderClick(directory)}>
                                                    <strong>{directory.folder.split('/').pop()}</strong>
                                                </td>
                                                <td className='text-left'>
                                                    {directory.files.length > 0 ? (
                                                        <ul>
                                                            {directory.files.map((file, idx) => (
                                                                <li key={idx}>
                                                                    {file.split('/').pop()}
                                                                    <button
                                                                        onClick={() => handleFileDownload(file)}
                                                                        className="btn btn-link"
                                                                    >
                                                                        Baixar
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span>Nenhum arquivo encontrado</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {/* Você pode adicionar outras ações, como excluir ou editar */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aqui você pode mostrar a navegação expandida para o diretório atual */}
            {currentDirectory && (
                <div className="expanded-directory">
                    <h6>Conteúdo da pasta: {currentDirectory.folder.split('/').pop()}</h6>
                    {/* Aqui você pode mostrar os arquivos da pasta ou subpastas se houver */}
                </div>
            )}
        </div>
    );
}

Folder.layout = (page) => <Base key={page} children={page} title={`Arquivos da empresa`} />;
