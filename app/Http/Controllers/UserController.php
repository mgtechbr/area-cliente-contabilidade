<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index()
    {
        $users = UserResource::collection(User::latest()->paginate(10));
        $companies = Company::select('id', 'name')->get(); 
        
        return inertia('Users/Index', [
            'users' => $users,
            'companies' => $companies,
        ]);
        
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'username' => 'nullable|string',
            'email' => 'nullable|string',
            'company_id' => 'nullable|int'
        ]);


        User::create($request->all());

        return back()->with([
            'type' => 'success',
            'message' => 'Usuário criado com sucesso!',
        ]);
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'username' => 'nullable|string',
            'email' => 'nullable|string',
            'company_id' => 'nullable|int'
        ]);
    
        $user->update($request->only(['name', 'username', 'email', 'company_id']));
    
        return back()->with([
            'type' => 'success',
            'message' => 'Usuário atualizado com sucesso!',
        ]);
    }
    

    public function destroy(User $user)
    {
        $user->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'User has been deleted',
        ]);
    }
}
