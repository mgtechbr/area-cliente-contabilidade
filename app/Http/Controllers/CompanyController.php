<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use Illuminate\Support\Facades\Storage;
use app\Http\Controllers\Controller;
use app\Http\Controllers\OneDriveController;
use App\Models\Company;
use Illuminate\Support\Facades\Http;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Lista as empresas com paginação e retorno em formato Inertia
    public function index()
    {
        $companies = Company::latest()->paginate(10);

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
            'codCompany' => 'required|int|max:40',
        ]);

        Company::create($request->only('name', 'cnpj', 'codCompany'));

        return back()->with([
            'type' => 'success',
            'message' => 'Empresa, pastas e arquivos cadastrados com sucesso!',
        ]);
    }


    // Atualização de uma empresa existente
    public function update(Request $request, Company $company)
    {
        // Valida os dados recebidos, incluindo arquivos
        $validated = $request->validate([
            'name' => 'nullable|string',
            'cnpj' => 'nullable|string',
            'codCompany' => 'nullable|int'
        ]);
    

        $company->update($request->only(['name', 'cnpj', 'codCompany']));
    
    
        return redirect()->route('companies.index');
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
    
}
