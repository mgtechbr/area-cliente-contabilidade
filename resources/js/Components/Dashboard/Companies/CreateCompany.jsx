import { useForm } from '@inertiajs/inertia-react';
import React from 'react';
import Folder from '../ManagerFilesFolder/Folder'; // Importe o componente Folder
import styles from './styles/CreateCompany.module.css';

export default function CreateCompany({ close }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        cnpj: '',
        folders: [{ name: 'Root', files: [], subFolders: [] }],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('cnpj', data.cnpj);
        formData.append('folders', JSON.stringify(data.folders));

        post(route('companies.store'), {
            data: formData,
            onSuccess: () => {
                reset();
                close();
            },
        });
    };

    const addFileToFolder = (folder, fileName) => {
        if (!fileName) return; // Validação simples
        const updatedFolders = updateFolderStructure(data.folders, folder, (f) => ({
            ...f,
            files: [...f.files, fileName],
        }));
        setData({ ...data, folders: updatedFolders });
    };

    const addFolderToFolder = (folder, folderName) => {
        if (!folderName) return; // Validação simples
        const updatedFolders = updateFolderStructure(data.folders, folder, (f) => ({
            ...f,
            subFolders: [...f.subFolders, { name: folderName, files: [], subFolders: [] }],
        }));
        setData({ ...data, folders: updatedFolders });
    };

    const updateFolderStructure = (folders, targetFolder, updateFn) => {
        return folders.map((folder) => {
            if (folder === targetFolder) {
                return updateFn(folder);
            } else if (folder.subFolders.length > 0) {
                return {
                    ...folder,
                    subFolders: updateFolderStructure(folder.subFolders, targetFolder, updateFn),
                };
            }
            return folder;
        });
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Empresa:</label>
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
                        <label htmlFor="cnpj">CNPJ:</label>
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
                        <label>Estrutura de Pastas e Arquivos:</label>
                        {data.folders.map((folder, index) => (
                            <Folder
                                key={index}
                                folder={folder}
                                onAddFile={addFileToFolder}
                                onAddFolder={addFolderToFolder}
                            />
                        ))}
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
        </>
    );
}