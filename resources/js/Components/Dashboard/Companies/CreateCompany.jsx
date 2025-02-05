import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Folder from '../ManagerFilesFolder/Folder'; // Importe o componente Folder
import styles from './styles/CreateCompany.module.css'; // Importe os estilos

export default function CreateCompany({ close }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        cnpj: '',
        folders: [], // Inicializa com um array de pastas vazias
    });

    // Função para adicionar uma nova pasta
    const addFolder = (parentIndex = null, grandParentIndex = null) => {
        const newFolder = { name: '', files: [], subFolders: [] };
    
        const newFolders = [...data.folders];
    
        if (grandParentIndex !== null) {
            // Adiciona uma subpasta dentro de uma subpasta
            newFolders[grandParentIndex].subFolders[parentIndex].subFolders.push(newFolder);
        } else if (parentIndex !== null) {
            // Adiciona uma subpasta dentro de uma pasta
            newFolders[parentIndex].subFolders.push(newFolder);
        } else {
            // Adiciona uma nova pasta no nível superior
            newFolders.push(newFolder);
        }
    
        setData({ ...data, folders: newFolders });
    };

    // Função para excluir uma pasta ou subpasta
    const deleteFolder = (index, parentIndex = null) => {
        const newFolders = [...data.folders];
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders.splice(index, 1);
        } else {
            newFolders.splice(index, 1);
        }
        setData({ ...data, folders: newFolders });
    };

    // Função para excluir um arquivo
    const deleteFile = (fileIndex, folderIndex, parentIndex = null) => {
        const newFolders = [...data.folders];
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders[folderIndex].files.splice(fileIndex, 1);
        } else {
            newFolders[folderIndex].files.splice(fileIndex, 1);
        }
        setData({ ...data, folders: newFolders });
    };

    // Função para atualizar o nome de uma pasta
    const onFolderNameChange = (e, index, parentIndex = null) => {
        const newFolders = [...data.folders];
        if (parentIndex !== null) {
            newFolders[parentIndex].subFolders[index].name = e.target.value;
        } else {
            newFolders[index].name = e.target.value;
        }
        setData({ ...data, folders: newFolders });
    };

    // Atualiza os arquivos de uma pasta
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

    // Função recursiva para renderizar as pastas e arquivos
    const renderFolders = (folders, parentIndex = null) => {
        return folders.map((folder, index) => (
            <Folder
                key={index}
                folder={folder}
                index={index}
                parentIndex={parentIndex}
                onFolderNameChange={onFolderNameChange}
                deleteFolder={deleteFolder}
                addFolder={addFolder}
                onFileChange={onFileChange}
                deleteFile={deleteFile}
                renderFolders={renderFolders}
            />
        ));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('id', data.id);
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
        <>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name" className="col-form-label">Empresa:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            id="name"
                        />
                        {errors && <div className="text-danger mt-1">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cnpj" className="col-form-label">CNPJ:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cnpj"
                            value={data.cnpj}
                            onChange={(e) => setData({ ...data, cnpj: e.target.value })}
                            id="cnpj"
                        />
                        {errors && <div className="text-danger mt-1">{errors.cnpj}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="id" className="col-form-label">ID da Empresa:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="id"
                            value={data.id}
                            onChange={(e) => setData({ ...data, id: e.target.value })}
                            id="id"
                        />
                        {errors && <div className="text-danger mt-1">{errors.id}</div>}
                    </div>

                    {/* Renderiza as pastas e subpastas */}
                    <div className={styles.folderContainer}>
                        {renderFolders(data.folders)}
                    </div>

                    <button type="button" className="btn btn-link" onClick={() => addFolder()}>
                        Adicionar nova pasta
                    </button>
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
        </>
    );
}