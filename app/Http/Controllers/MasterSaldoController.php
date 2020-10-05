<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\MasterSaldo;

class MasterSaldoController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request, $userId)
    {
        try {
            $mastersaldo = MasterSaldo::where('user_id', $userId)->with('user')->first();
            return response()->json($mastersaldo, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'something went wrong';
            return response()->json($this->content, 500);
        }
    }

    // public function index(Request $request)
    // {
    //     try {
    //         $mastersaldo = $this->searchGenerator($request);
    //         return response()->json($mastersaldo, 200);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 500;
    //         $this->content['error'] = 'Internal Server Error';
    //         $this->content['message'] = 'something went wrong';
    //         return response()->json($this->content, 500);
    //     }
    // }

    // public function create(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required',
    //     ]);

    //     try {
    //         $mastersaldo = MasterSaldo::create($request->all());
    //         return response()->json($mastersaldo, 201);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 500;
    //         $this->content['error'] = 'Internal Server Error';
    //         $this->content['message'] = 'Failed to create';
    //         return response()->json($this->content, 500);
    //     }
    // }

    // public function bulk(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'mastersaldos' => 'required|array',
    //     ]);

    //     try {
    //         foreach ($request->mastersaldos as $key => $value) {
    //            $mastersaldo = MasterSaldo::create($value);
    //         }
    //         return response()->json($request->mastersaldos, 201);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 500;
    //         $this->content['error'] = 'Internal Server Error';
    //         $this->content['message'] = 'Failed to create';
    //         return response()->json($this->content, 500);
    //     }
    // }

    // public function show(Request $request)
    // {

    //     try {
    //         $mastersaldo = MasterSaldo::findOrFail($request->id);
    //         return response()->json($mastersaldo, 200);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 404;
    //         $this->content['error'] = 'Not Found';
    //         $this->content['message'] = 'Data Not Found';
    //         return response()->json($this->content, 404);
    //     }
    // }

    // public function update(Request $request, $id)
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required',
    //     ]);

    //     try {
    //         $mastersaldo = MasterSaldo::findOrFail($request->id);

    //         $mastersaldo->update($request->all());

    //         return response()->json($mastersaldo, 200);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 404;
    //         $this->content['error'] = 'Not Found';
    //         $this->content['message'] = 'Data Not Found';
    //         return response()->json($this->content, 404);
    //     }
    // }

    // public function delete(Request $request, $id)
    // {
    //     try {
    //         $mastersaldo = MasterSaldo::findOrFail($request->id);

    //         MasterSaldo::destroy($id);

    //         return response()->json($mastersaldo, 200);
    //     } catch (\Throwable $th) {
    //         $this->content['statusCode'] = 404;
    //         $this->content['error'] = 'Not Found';
    //         $this->content['message'] = 'Data Not Found';
    //         return response()->json($this->content, 404);
    //     }
    // }

    // public function searchGenerator($request) {
    //     $per_page = $request->per_page ?  $request->per_page : 'all';
    //     $filter = $request->filter ? $request->filter : [];
    //     $sort = $request->sort ? $request->sort : 'created_at,ASC';
    //     $join = $request->join ? $request->join : '';
    //     $count = $request->count ? $request->count : '';
    //     $whereHas = $request->where_has ? $request->where_has : [];
    //     $limit = $request->limit ? $request->limit : '';

    //     $mastersaldo = new MasterSaldo;

    //     if(is_array($whereHas)){
    //         foreach ($whereHas as $item => $value) {
    //             $words = explode(",",$value);
    //                  $mastersaldo = $mastersaldo->whereHas($words[0], function ($query) use ($words) {
    //                     $query->where($words[1], $words[2]);
    //                 });
    //         }
    //     }

    //     if($join !== ''){
    //         $join = Str::lower($join);
    //         $words = explode(",",$join);
    //         $mastersaldo = $mastersaldo->with($words);
    //     }

    //     if($count !== ''){
    //         $count = Str::lower($count);
    //         $words = explode(",",$count);
    //         $mastersaldo = $mastersaldo->withCount($words);
    //     }

    //     if(is_array($filter)){
    //         foreach ($filter as $item => $value) {
    //             $words = explode(",",$value);
    //             if(array_key_exists(2, $words)){
    //                 if($words[2] || $words[2] == 'AND'){
    //                     $mastersaldo = $mastersaldo->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
    //                 }else{
    //                     $mastersaldo = $mastersaldo->where($words[0], 'LIKE', '%'.$words[1].'%');
    //                 }
    //             }else{
    //                 $mastersaldo = $mastersaldo->where($words[0], 'LIKE', '%'.$words[1].'%');
    //             }
    //         }
    //     }

    //     $sortItem = explode(",",$sort);
    //     if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
    //         $mastersaldo = $mastersaldo->orderBy($sortItem[0], $sortItem[1]);
    //     }

    //     if($limit != ''){
    //         $mastersaldo = $mastersaldo->limit($limit)->get();
    //     }else{
    //         if($per_page !== 'all'){
    //             $mastersaldo = $mastersaldo->paginate($per_page);
    //         }else{
    //             $mastersaldo = $mastersaldo->get();
    //         }
    //     }

    //     return $mastersaldo;
    // }
}
