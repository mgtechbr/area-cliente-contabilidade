import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Folder from '../../Components/Dashboard/ManagerFilesFolder/Folder'; // Componente Folder para gerenciamento de pastas
import Dialog from '../../Components/Dashboard/Dialog'; // Diálogo de upload
import Base from '../../Layouts/Base';
import useDialog from '../../Hooks/useDialog';
import { Inertia } from '@inertiajs/inertia';
import styles from './styles/CreateCompany.module.css'; // Estilos para o layout


export default function CreateCompany({ close }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        cnpj: '',
        folders: [
                {
                    name: 'Pasta Inicial',
                    files: [],
                    subFolders: [],
                },
            ],
    });

    const addFolder = (folder, folderName) => {
        const newFolder = {
            id: Date.now(), // Identificador único para a nova pasta
            name: folderName,
            files: [],
            subFolders: [],
        };
    
        setData((prev) => {
            const updatedFolders = updateFolders(prev.folders, folder, newFolder);
            console.log("Pastas atualizadas:", updatedFolders);
            return { ...prev, folders: updatedFolders };
        });
    };
    
    const updateFolders = (folders, targetFolder, newFolder) => {
        return folders.map((folder) => {
            if (folder === targetFolder) {
                return {
                    ...folder,
                    subFolders: [...folder.subFolders, newFolder],
                };
            } else if (folder.subFolders.length > 0) {
                return {
                    ...folder,
                    subFolders: updateFolders(folder.subFolders, targetFolder, newFolder),
                };
            }
            return folder;
        });
    };

    const addFile = (file, parentPath = 'Pasta Inicial') => {
        setData(prev => {
            const updatedFolders = updateFiles(prev.folders, parentPath, file);
            return { ...prev, folders: updatedFolders };
        });
    };
    
    const updateFiles = (folders, targetName, file) => {
        return folders.map(folder => {
            if (folder.name === targetName) {
                return {
                    ...folder,
                    files: [...folder.files, file]
                };
            } else if (folder.subFolders.length > 0) {
                return {
                    ...folder,
                    subFolders: updateFiles(folder.subFolders, targetName, file)
                };
            }
            return folder;
        });
    };
    
    
    const deleteFolder = (index, parentIndex = null) => {
        const newFolders = [...data.folders];
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders.splice(index, 1);
        } else {
            newFolders.splice(index, 1);
        }
        setData({ ...data, folders: newFolders });
    };

    const onFolderNameChange = (e, index, parentIndex = null) => {
        const newFolders = [...data.folders];
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders[index].name = e.target.value;
        } else {
            newFolders[index].name = e.target.value;
        }
        setData({ ...data, folders: newFolders });
    };

    const onFileChange = (e, index, parentIndex = null) => {
        const newFolders = [...data.folders];
        const files = e.target.files;
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders[index].files = Array.from(files);
        } else {
            newFolders[index].files = Array.from(files);
        }
        setData({ ...data, folders: newFolders });
    };

    const renderFolders = (folders = [], parentIndex = null) => {
        if (!Array.isArray(folders)) {
            return null;
        }
    
        return folders.map((folder, index) => (
            <Folder
                key={folder.id || index}
                folder={folder}
                index={index}
                parentIndex={parentIndex}
                onFolderNameChange={onFolderNameChange}
                deleteFolder={deleteFolder}
                addFolder={addFolder}
                addFile={addFile}
                onFileChange={onFileChange}
            />
        ));
    };
    
    

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('cnpj', data.cnpj);

        data.folders.forEach((folder, index) => {
            formData.append(`folders[${index}].name`, folder.name);
            folder.files.forEach((file) => {
                formData.append(`folders[${index}].files[]`, file);
            });
            folder.subFolders.forEach((subFolder, subIndex) => {
                formData.append(`folders[${index}].subFolders[${subIndex}].name`, subFolder.name);
                subFolder.files.forEach((file) => {
                    formData.append(`folders[${index}].subFolders[${subIndex}].files[]`, file);
                });
            });
        });

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

                                {/* Renderiza as pastas e subpastas */}
                                <div className={styles.folderContainer}>
                                    {renderFolders(data.folders)}
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
