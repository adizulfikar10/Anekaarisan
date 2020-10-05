<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('login', 'AuthController@login');
Route::post('logout', 'AuthController@logout');
Route::get('me', 'AuthController@me');
Route::get('refresh', 'AuthController@refresh');

Route::post('register', 'UserController@register');


Route::post('users', 'UserController@create');
Route::post('users/bulk', 'UserController@bulk');
Route::get('users', 'UserController@index');
Route::get('users/{id}', 'UserController@show');
Route::patch('users/{id}', 'UserController@update');
Route::patch('users/{id}/status', 'UserController@changeStatusUser');
Route::patch('users/{id}/activation', 'UserController@changeActivationUser');
Route::patch('users/{id}/reset-password/', 'UserController@resetPassword');
Route::patch('users/{id}/change-password', 'UserController@changePassword');
Route::delete('users/{id}', 'UserController@delete');


Route::get('wallets', 'WalletController@index');
Route::post('wallets', 'WalletController@create');
Route::post('wallets/bulk', 'WalletController@bulk');
Route::get('wallets/{id}', 'WalletController@show');
Route::patch('wallets/{id}', 'WalletController@update');
Route::delete('wallets/{id}', 'WalletController@delete');

Route::get('products', 'ProductController@index');
Route::post('products', 'ProductController@create');
Route::post('products/bulk', 'ProductController@bulk');
Route::get('products/{id}', 'ProductController@show');
Route::patch('products/{id}', 'ProductController@update');
Route::delete('products/{id}', 'ProductController@delete');
Route::get('products/catalogue/detail', 'ProductController@productCatalogue');

Route::get('arisanmembers', 'ArisanMemberController@index');
Route::post('arisanmembers', 'ArisanMemberController@create');
Route::post('arisanmembers/bulk', 'ArisanMemberController@bulk');
Route::get('arisanmembers/{id}', 'ArisanMemberController@show');
Route::patch('arisanmembers/{id}', 'ArisanMemberController@update');
Route::delete('arisanmembers/{id}', 'ArisanMemberController@delete');

// Route::get('requestwithdraws', 'RequestWithdrawController@index');
// Route::post('requestwithdraws', 'RequestWithdrawController@create');
// Route::post('requestwithdraws/bulk', 'RequestWithdrawController@bulk');
// Route::get('requestwithdraws/{id}', 'RequestWithdrawController@show');
// Route::patch('requestwithdraws/{id}', 'RequestWithdrawController@update');
// Route::delete('requestwithdraws/{id}', 'RequestWithdrawController@delete');

Route::get('arisans', 'ArisanController@index');
Route::post('arisans', 'ArisanController@create');
Route::post('arisans/bulk', 'ArisanController@bulk');
Route::get('arisans/{id}', 'ArisanController@show');
Route::patch('arisans/{id}', 'ArisanController@update');
Route::delete('arisans/{id}', 'ArisanController@delete');
Route::get('arisans-reminder', 'ArisanController@reminder');

Route::get('arisantransactions', 'ArisanTransactionController@index');
Route::post('arisantransactions', 'ArisanTransactionController@create');
Route::post('arisantransactions/bulk', 'ArisanTransactionController@bulk');
Route::get('arisantransactions/{id}', 'ArisanTransactionController@show');
Route::patch('arisantransactions/{id}', 'ArisanTransactionController@update');
Route::delete('arisantransactions/{id}', 'ArisanTransactionController@delete');

Route::get('payments', 'PaymentController@index');
Route::post('payments', 'PaymentController@create');
Route::post('payments/bulk', 'PaymentController@bulk');
Route::get('payments/{id}', 'PaymentController@show');
Route::patch('payments/{id}', 'PaymentController@update');
Route::delete('payments/{id}', 'PaymentController@delete');

Route::get('masterimages', 'MasterImageController@index');
Route::post('masterimages', 'MasterImageController@create');
Route::post('masterimages/bulk', 'MasterImageController@bulk');
Route::get('masterimages/{id}', 'MasterImageController@show');
// Route::patch('masterimages/{id}', 'MasterImageController@update');
Route::delete('masterimages/{id}', 'MasterImageController@delete');

Route::get('walletrequests', 'WalletRequestController@index');
Route::post('walletrequests', 'WalletRequestController@create');
Route::post('walletrequests/bulk', 'WalletRequestController@bulk');
Route::get('walletrequests/{id}', 'WalletRequestController@show');
Route::patch('walletrequests/{id}', 'WalletRequestController@update');
Route::delete('walletrequests/{id}', 'WalletRequestController@delete');


Route::get('productdetails', 'ProductDetailController@index');
Route::post('productdetails', 'ProductDetailController@create');
Route::post('productdetails/bulk', 'ProductDetailController@bulk');
Route::get('productdetails/{id}', 'ProductDetailController@show');
Route::patch('productdetails/{id}', 'ProductDetailController@update');
Route::patch('productdetails/{idproduct}/bulk', 'ProductDetailController@updateBulk');
Route::delete('productdetails/{id}', 'ProductDetailController@delete');

Route::get('promos', 'PromoController@index');
Route::post('promos', 'PromoController@create');
Route::post('promos/bulk', 'PromoController@bulk');
Route::get('promos/{id}', 'PromoController@show');
Route::patch('promos/{id}', 'PromoController@update');
Route::delete('promos/{id}', 'PromoController@delete');

Route::get('productpromos', 'ProductPromoController@index');
Route::post('productpromos', 'ProductPromoController@create');
Route::post('productpromos/bulk', 'ProductPromoController@bulk');
Route::get('productpromos/{id}', 'ProductPromoController@show');
Route::patch('productpromos/{id}', 'ProductPromoController@update');
Route::delete('productpromos/{id}', 'ProductPromoController@delete');

Route::get('categories', 'CategoryController@index');
Route::post('categories', 'CategoryController@create');
Route::post('categories/bulk', 'CategoryController@bulk');
Route::get('categories/{id}', 'CategoryController@show');
Route::patch('categories/{id}', 'CategoryController@update');
Route::delete('categories/{id}', 'CategoryController@delete');

Route::get('productcategories', 'ProductCategoryController@index');
Route::post('productcategories', 'ProductCategoryController@create');
Route::post('productcategories/bulk', 'ProductCategoryController@bulk');
Route::get('productcategories/{id}', 'ProductCategoryController@show');
Route::patch('productcategories/{id}', 'ProductCategoryController@update');
Route::delete('productcategories/{id}', 'ProductCategoryController@delete');

Route::get('notifications', 'NotificationController@index');
Route::post('notifications', 'NotificationController@create');
Route::post('notifications/bulk', 'NotificationController@bulk');
Route::get('notifications/{id}', 'NotificationController@show');
Route::patch('notifications/{id}', 'NotificationController@update');
Route::delete('notifications/{id}', 'NotificationController@delete');

Route::get('provinces', 'ProvinceController@index');
//  Route::post('provinces', 'ProvinceController@create');
//  Route::post('provinces/bulk', 'ProvinceController@bulk');
Route::get('provinces/{id}', 'ProvinceController@show');
//  Route::patch('provinces/{id}', 'ProvinceController@update');
//  Route::delete('provinces/{id}', 'ProvinceController@delete');

Route::get('regions', 'RegionController@index');
//  Route::post('regions', 'RegionController@create');
//  Route::post('regions/bulk', 'RegionController@bulk');
Route::get('regions/{id}', 'RegionController@show');
//  Route::patch('regions/{id}', 'RegionController@update');
//  Route::delete('regions/{id}', 'RegionController@delete');

Route::get('districts', 'DistrictController@index');
//  Route::post('districts', 'DistrictController@create');
//  Route::post('districts/bulk', 'DistrictController@bulk');
Route::get('districts/{id}', 'DistrictController@show');
//  Route::patch('districts/{id}', 'DistrictController@update');
//  Route::delete('districts/{id}', 'DistrictController@delete');

Route::get('villages', 'VillageController@index');
//  Route::post('villages', 'VillageController@create');
//  Route::post('villages/bulk', 'VillageController@bulk');
Route::get('villages/{id}', 'VillageController@show');
//  Route::patch('villages/{id}', 'VillageController@update');
//  Route::delete('villages/{id}', 'VillageController@delete');

Route::get('commissions', 'MasterCommissionController@index');
Route::post('commissions', 'MasterCommissionController@create');
Route::post('commissions/bulk', 'MasterCommissionController@bulk');
Route::get('commissions/{id}', 'MasterCommissionController@show');
Route::patch('commissions/{id}', 'MasterCommissionController@update');
Route::delete('commissions/{id}', 'MasterCommissionController@delete');

Route::get('mastersaldos/{user_id}', 'MasterSaldoController@index');
// Route::get('mastersaldos', 'MasterSaldoController@index');
// Route::post('mastersaldos', 'MasterSaldoController@create');
// Route::post('mastersaldos/bulk', 'MasterSaldoController@bulk');
// Route::get('mastersaldos/{id}', 'MasterSaldoController@show');
// Route::patch('mastersaldos/{id}', 'MasterSaldoController@update');
// Route::delete('mastersaldos/{id}', 'MasterSaldoController@delete');

// Route::get('reminderarisans', 'ReminderArisanController@index');
// Route::post('reminderarisans', 'ReminderArisanController@create');
// Route::post('reminderarisans/bulk', 'ReminderArisanController@bulk');
// Route::get('reminderarisans/{id}', 'ReminderArisanController@show');
// Route::patch('reminderarisans/{id}', 'ReminderArisanController@update');
// Route::delete('reminderarisans/{id}', 'ReminderArisanController@delete');

// Route::get('notices', 'NoticeController@index');
// Route::post('notices', 'NoticeController@create');
// Route::post('notices/bulk', 'NoticeController@bulk');
// Route::get('notices/{id}', 'NoticeController@show');
// Route::patch('notices/{id}', 'NoticeController@update');
// Route::delete('notices/{id}', 'NoticeController@delete');
Route::get('mynotices', 'NoticeController@myNotice');
Route::post('readmynotice', 'NoticeController@readMyNotice');

Route::post('midtrans/snaptoken', 'MidtransController@snapToken');
Route::post('midtrans/callback', 'MidtransController@midtransCallback');
Route::post('midtrans/{id}/status', 'MidtransController@checkStatusMidtrans');


