<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OneDriveController;


Route::middleware('auth')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
    
    Route::apiResource('users', UserController::class);

    Route::middleware(['auth', 'user.folder'])->group(function () {
        Route::apiResource('companies', CompanyController::class);
   //     Route::get('company/{company}/files', [CompanyController::class, 'files'])->name('company.files');
        Route::get('company/{company}/files', [OneDriveController::class, 'files'])->name('onedrive.files');
        Route::get('create', [CompanyController::class, 'create'])->name('companies.create');
    });
    
    Route::get('profile', ProfileController::class)->name('profile');
});

Route::middleware('guest')->group(function () {
    Route::get('/', [LoginController::class, 'create'])->name('login'); // Define a página inicial como login
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
});



Route::prefix('onedrive')->group(function() {
    Route::get('/login', [OneDriveController::class, 'redirectToOneDrive'])->name('onedrive.redirect');
    Route::get('/callback', [OneDriveController::class, 'handleOneDriveCallback']);
    Route::get('/files/{company}', [OneDriveController::class, 'files']);
    Route::get('/download/{fileId}', [OneDriveController::class, 'downloadFile']);
});





