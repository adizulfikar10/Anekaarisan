<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\MasterCommission;

class MasterCommissionController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $mastercommission = $this->searchGenerator($request);
            return response()->json($mastercommission, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'something went wrong';
            return response()->json($this->content, 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'commission_percent' => 'required|unique:master_commissions,commission_percent',
        ]);

        try {
            $mastercommission = MasterCommission::create($request->all());
            return response()->json($mastercommission, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function bulk(Request $request)
    {
        $validatedData = $request->validate([
            'master_commissions' => 'required|array',
        ]);

        try {
            foreach ($request->mastercommissions as $key => $value) {
               $mastercommission = MasterCommission::create($value);
            }
            return response()->json($request->mastercommissions, 201);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 500;
            $this->content['error'] = 'Internal Server Error';
            $this->content['message'] = 'Failed to create';
            return response()->json($this->content, 500);
        }
    }

    public function show(Request $request)
    {

        try {
            $mastercommission = MasterCommission::findOrFail($request->id);
            return response()->json($mastercommission, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'commission_percent' => 'required|unique:master_commissions,commission_percent',
        ]);

        try {
            $mastercommission = MasterCommission::findOrFail($request->id);

            $mastercommission->update($request->all());

            return response()->json($mastercommission, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $mastercommission = MasterCommission::findOrFail($request->id);

            MasterCommission::destroy($id);

            return response()->json($mastercommission, 200);
        } catch (\Throwable $th) {
            $this->content['statusCode'] = 404;
            $this->content['error'] = 'Not Found';
            $this->content['message'] = 'Data Not Found';
            return response()->json($this->content, 404);
        }
    }

    public function searchGenerator($request) {
        $per_page = $request->per_page ?  $request->per_page : 'all';
        $filter = $request->filter ? $request->filter : [];
        $sort = $request->sort ? $request->sort : 'created_at,ASC';
        $join = $request->join ? $request->join : '';
        $count = $request->count ? $request->count : '';
        $whereHas = $request->where_has ? $request->where_has : [];
        $limit = $request->limit ? $request->limit : '';

        $mastercommission = new MasterCommission;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $mastercommission = $mastercommission->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $mastercommission = $mastercommission->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $mastercommission = $mastercommission->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $mastercommission = $mastercommission->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $mastercommission = $mastercommission->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $mastercommission = $mastercommission->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $mastercommission = $mastercommission->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $mastercommission = $mastercommission->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $mastercommission = $mastercommission->paginate($per_page);
            }else{
                $mastercommission = $mastercommission->get();
            }
        }

        return $mastercommission;
    }
}
