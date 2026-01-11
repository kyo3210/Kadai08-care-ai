<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CareController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\ScheduleController; // ★追加
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. 初期リダイレクト
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// 2. メインダッシュボード画面
Route::get('/dashboard', function () {
    return view('index'); 
})->middleware(['auth', 'verified'])->name('dashboard');

// 3. Web-API ルート (JavaScriptからの非同期通信用)
Route::middleware(['auth'])->prefix('web-api')->group(function () {
    
    // --- 利用者(Client)関連 ---
    Route::get('/clients', [ClientController::class, 'index']); 
    Route::post('/clients', [ClientController::class, 'store']); 
    Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
    
    // --- ケア記録(Record)関連 ---
    Route::get('/all-records', [CareController::class, 'getAllRecords']);
    Route::get('/search', [CareController::class, 'search']);
    Route::post('/records', [CareController::class, 'storeRecord']);
    Route::post('/ask-ai', [CareController::class, 'askAI']);

    // --- スケジュール(Schedule)関連 ★追加 ---
    // 予定一覧の取得
    Route::get('/schedules', [ScheduleController::class, 'index']);
    // 予定の保存
    Route::post('/schedules', [ScheduleController::class, 'store']);    
    Route::patch('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);

    // --- 事業所(Office)関連 ---
    Route::get('/offices', [OfficeController::class, 'index']);
    Route::post('/offices/update', [OfficeController::class, 'update']);
    Route::get('/staff', [OfficeController::class, 'indexStaff']);
    Route::post('/staff', [OfficeController::class, 'storeStaff']);

    // --- 外部API連携 ---
    Route::get('/zipcode/{zip}', function($zip) {
        return Http::get("https://zipcloud.ibsnet.co.jp/api/search?zipcode={$zip}")->json();
    });
});

// 4. プロフィール管理 (Breeze標準)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';