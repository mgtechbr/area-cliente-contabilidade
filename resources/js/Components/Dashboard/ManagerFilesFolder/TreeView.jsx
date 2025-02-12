import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFile, faTrash, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

const TreeView = ({ directories = [], onFolderClick, onFileDownload, onFileDelete, onFolderAdd }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [treeData, setTreeData] = useState(directories);

    const toggleFolder = (folderPath) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [folderPath]: !prev[folderPath],
        }));
    };

    const addFolder = (parentPath) => {
        const newFolderName = prompt("Digite o nome da nova subpasta:");
        if (!newFolderName) return;

        // Atualiza a estrutura da árvore de pastas, diferenciando pastas e arquivos
        setTreeData((prevTree) => {
            const updateTree = (folders) => {
                return folders.map(folder => {
                    if (folder.folder === parentPath) {
                        // Adiciona a nova pasta no caminho correto
                        return {
                            ...folder,
                            subFolders: [
                                ...folder.subFolders,
                                { folder: `${parentPath}/${newFolderName}`, files: [], subFolders: [] }
                            ]
                        };
                    } else if (folder.subFolders.length > 0) {
                        // Continua a busca por subpastas
                        return {
                            ...folder,
                            subFolders: updateTree(folder.subFolders)
                        };
                    }
                    return folder;
                });
            };
            return updateTree(prevTree);
        });

        if (onFolderAdd) {
            onFolderAdd(parentPath, newFolderName); // Chama a função de callback
        }
    };

    const renderTree = (directories, level = 0) => {
        return directories.map((directory, index) => {
            const folderPath = directory.folder;
            const isExpanded = expandedFolders[folderPath] || false;

            return (
                <div key={index} style={{ marginLeft: `${level * 20}px` }}>
                    <div className="folder-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span onClick={() => toggleFolder(folderPath)}>
                            <FontAwesomeIcon icon={isExpanded ? faFolderOpen : faFolder} />
                            <span style={{ marginLeft: '10px' }}>
                                {folderPath ? folderPath.split('/').pop() : 'Pasta Desconhecida'}
                            </span>
                        </span>

                        {/* Botão de adicionar nova pasta */}
                        <button onClick={() => addFolder(folderPath)} className="btn btn-link">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>

                    {isExpanded && (
                        <>
                            {directory.files && directory.files.map((file, idx) => (
                                <div key={idx} className="file-item" style={{ marginLeft: `${(level + 1) * 20}px` }}>
                                    <FontAwesomeIcon icon={faFile} />
                                    <span style={{ marginLeft: '10px' }}>{file}</span>

                                    {/* Botões para manipulação de arquivos */}
                                    <button onClick={() => onFileDownload(file)} className="btn btn-link">
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                    <button onClick={() => onFileDelete(file)} className="btn btn-link">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}

                            {/* Renderiza subpastas */}
                            {directory.subFolders && renderTree(directory.subFolders, level + 1)}
                        </>
                    )}
                </div>
            );
        });
    };

    return <div>{renderTree(treeData)}</div>;
};

export default TreeView;
