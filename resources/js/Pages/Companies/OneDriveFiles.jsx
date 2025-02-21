import { useEffect, useState } from "react";
import { Link } from '@inertiajs/inertia-react';

export default function OneDriveFiles(props) {
    const { files, company, error } = props;  

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Arquivos do OneDrive - {company}</h1> 

            {error && <p className="text-red-500">{error}</p>}  

            {files.length === 0 ? (
                <p className="text-gray-600">Nenhum arquivo encontrado.</p> 
            ) : (
                <ul className="mt-4">
                    {files.map((file) => (
                        <li key={file.id} className="mb-2 flex justify-between items-center">
                            <span>{file.name}</span> 
                            <a
                                href={file.downloadUrl}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                                Baixar
                            </a> 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
