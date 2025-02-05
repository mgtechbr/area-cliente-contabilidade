import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faTrash, faPencil, faFolderPlus, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import FileUpload from './FileUpload'; // Importe o componente FileUpload

const Folder = ({
    folder,
    index,
    parentIndex,
    onFolderNameChange,
    deleteFolder,
    addFolder,
    onFileChange,
    deleteFile,
    renderFolders,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar a edição do nome
    const [folderName, setFolderName] = useState(folder.name); // Estado para o nome da pasta

    const handleNameChange = (e) => {
        setFolderName(e.target.value); // Atualiza o estado local
    };

    const saveNameChange = () => {
        onFolderNameChange({ target: { value: folderName } }, index, parentIndex); // Atualiza o nome no estado global
        setIsEditing(false); // Sai do modo de edição
    };

    return (
        <div className="folder-item">
            <div className="folder-header">
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <FontAwesomeIcon icon={isExpanded ? faFolderOpen : faFolder} />
                </button>

                {/* Exibe o nome da pasta ou o input de edição */}
                {isEditing ? (
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control"
                            value={folderName}
                            onChange={handleNameChange}
                            onBlur={saveNameChange} // Salva ao sair do input
                            onKeyPress={(e) => e.key === 'Enter' && saveNameChange()} // Salva ao pressionar Enter
                            autoFocus // Foca automaticamente no input
                        />
                    </div>
                ) : (
                    <span className="folder-name" onClick={() => setIsEditing(true)}>
                        {folder.name}
                    </span>
                )}

                {/* Ícone de lápis para editar o nome da pasta */}
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <FontAwesomeIcon icon={faPencil} />
                </button>

                {/* Ícone de pasta com sinal de "+" para adicionar subpasta */}
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => addFolder(index, parentIndex)}
                >
                    <FontAwesomeIcon icon={faFolderPlus} />
                </button>

                {/* Ícone de lixeira para excluir a pasta */}
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteFolder(index, parentIndex)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            {isExpanded && (
                <>
                    <FileUpload
                        index={index}
                        parentIndex={parentIndex}
                        onFileChange={onFileChange}
                        files={folder.files}
                        deleteFile={deleteFile}
                    />

                    {folder.subFolders.length > 0 && (
                        <div className="subfolder-container">
                            <FontAwesomeIcon icon={faCaretRight} style={{ marginRight: '5px' }} />
                            {renderFolders(folder.subFolders, index)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Folder;