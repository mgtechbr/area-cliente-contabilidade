<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use Illuminate\Support\Facades\Storage;
use App\Models\Company;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Lista as empresas com paginação e retorno em formato Inertia
    public function index()
    {
        $companies = CompanyResource::collection(Company::latest()->paginate(10));

        return inertia('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        $companies = CompanyResource::collection(Company::latest()->paginate(10));

        return inertia('Companies/CreateCompany', [
            'companies' => $companies,
        ]);
    }

    // Criação de nova empresa
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cnpj' => 'required|string|max:20',
            'folders' => 'nullable|array', // As pastas podem ser enviadas como array
        ]);

        // Criação da empresa
        $company = Company::create($request->only('name', 'cnpj'));

        // Criação do diretório da empresa dentro de 'storage/app/companies'
        $companyFolder = 'companies/' . $company->id;
        Storage::makeDirectory($companyFolder);

        // Se houver pastas, processa as pastas e subpastas
        if ($request->has('folders')) {
            foreach ($request->input('folders') as $folderIndex => $folder) {
                // Criação da pasta no diretório da empresa
                $folderPath = $companyFolder . '/' . $folder['name'];
                Storage::makeDirectory($folderPath);

                // Se houver arquivos nesta pasta, faz o upload
                if (!empty($folder['files'])) {
                    foreach ($folder['files'] as $file) {
                        $path = Storage::putFileAs($folderPath, $file, $file->getClientOriginalName());
                        // Você pode salvar o caminho do arquivo no banco, se necessário
                    }
                }

                // Processa as subpastas, se existirem
                if (!empty($folder['subFolders'])) {
                    foreach ($folder['subFolders'] as $subFolderIndex => $subFolder) {
                        $subFolderPath = $folderPath . '/' . $subFolder['name'];
                        Storage::makeDirectory($subFolderPath);

                        // Se houver arquivos na subpasta, faz o upload
                        if (!empty($subFolder['files'])) {
                            foreach ($subFolder['files'] as $file) {
                                $path = Storage::putFileAs($subFolderPath, $file, $file->getClientOriginalName());
                                // Salva o caminho do arquivo no banco de dados, se necessário
                            }
                        }
                    }
                }
            }
        }

        return back()->with([
            'type' => 'success',
            'message' => 'Empresa, pastas e arquivos cadastrados com sucesso!',
        ]);
    }


    // Atualização de uma empresa existente
    public function update(CompanyRequest $request, Company $company)
    {
        $attr = $request->validated();

        $company->update($attr);

        return back()->with([
            'type' => 'success',
            'message' => 'Empresa atualizada com sucesso!',
        ]);
    }

    // Exclusão de uma empresa
    public function destroy(Company $company)
    {
        $company->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Empresa deletada com sucesso!',
        ]);
    }

    // Função para retornar arquivos relacionados a uma empresa
    public function files(Company $company)
    {
        // Recupera todas as subpastas dentro da pasta da empresa
        $directories = Storage::directories('companies/' . $company->id);

        $files = [];
        foreach ($directories as $directory) {
            // Para cada subpasta, recupera os arquivos dentro dela
            $files[] = [
                'folder' => $directory,
                'files' => array_map(function ($file) {
                    // Transformar o caminho do arquivo para ser acessível via /storage/
                    return str_replace('storage/', '', Storage::url($file));
                }, Storage::files($directory)),
            ];
        }

        return inertia('Companies/Folder', [
            'company' => $company,
            'directories' => $files,
        ]);
    }

}
