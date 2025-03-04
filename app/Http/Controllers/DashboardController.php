<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Company;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        $countCompanies = Company::all()->count();
        $countUser = User::all()->count();

        $stats = [
            'companies' => $countCompanies,
            'users' => $countUser,
        ];

        return inertia('Dashboard', [
            'user' => Auth::user(),
            'stats' => $stats,
        ]);
    }
}
