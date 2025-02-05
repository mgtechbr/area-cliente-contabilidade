import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ index, parentIndex, onFileChange, files, deleteFile }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileChange({ target: { files } }, index, parentIndex);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="file-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <label htmlFor={`files_${parentIndex}_${index}`} className="col-form-label">
                Arraste e solte arquivos aqui ou clique para selecionar:
            </label>
            <input
                type="file"
                className="form-control"
                id={`files_${parentIndex}_${index}`}
                onChange={(e) => onFileChange(e, index, parentIndex)}
                multiple
            />
            {files.length > 0 && (
                <ul>
                    {files.map((file, idx) => (
                        <li key={idx}>
                            {file.name}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteFile(idx, index, parentIndex)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUpload;