import React, { useState } from 'react';

const Folder = ({ folder, addFile, addFolder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddFile = (e) => {
        e.stopPropagation(); // Evita a propagação do evento
        const fileName = prompt('Digite o nome do arquivo:');
        if (fileName) {
            addFile(folder, fileName);
        }
    };

    const handleAddFolder = (e) => {
        e.stopPropagation(); // Evita a propagação do evento
        const folderName = prompt('Digite o nome da pasta:');
        if (folderName) {
            addFolder(folder, folderName);
        }
    };

    return (
        <div>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <span>{isOpen ? '📂' : '📁'}</span> {/* Ícone para indicar estado aberto/fechado */}
                <span style={{ marginLeft: '5px' }}>{folder.name}</span>
                <button type="button" onClick={handleAddFile} style={{ marginLeft: '10px' }}>+ Arquivo</button>
                <button type="button" onClick={handleAddFolder} style={{ marginLeft: '10px' }}>+ Pasta</button>
            </div>
            {isOpen && (
                <div style={{ marginLeft: '20px' }}>
                    {folder.files.map((file, index) => (
                        <div key={index}>📄 {file}</div>
                    ))}
                    {folder.subFolders.map((subFolder, index) => (
                        <Folder
                            key={index}
                            folder={subFolder}
                            addFile={addFile}
                            addFolder={addFolder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Folder;