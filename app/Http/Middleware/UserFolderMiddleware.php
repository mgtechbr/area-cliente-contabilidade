<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserFolderMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $folderId = $request->route('company'); // Captura o ID da empresa

        if (!$folderId || $user->role === 'admin') {
            return $next($request);
        }

        if ($user->company?->id === $folderId->id) {
            return $next($request);
        }

        return response()->json(['error' => 'Acesso negado!'], 403);
    }
}
