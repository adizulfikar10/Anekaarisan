<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Province;

class ProvinceController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $province = $this->searchGenerator($request);
            return response()->json($province, 200);
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
            'name' => 'required',
        ]);

        try {
            $province = Province::create($request->all());
            return response()->json($province, 201);
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
            'provinces' => 'required|array',
        ]);

        try {
            foreach ($request->provinces as $key => $value) {
                $province = Province::create($value);
            }
            return response()->json($request->provinces, 201);
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
            $province = Province::findOrFail($request->id);
//            SELECT provinces.*, r.* FROM `provinces` JOIN regions AS r WHERE provinces.id="11" AND r.id LIKE "11.%"

            return response()->json($province, 200);
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
            'name' => 'required',
        ]);

        try {
            $province = Province::findOrFail($request->id);

            $province->update($request->all());

            return response()->json($province, 200);
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
            $province = Province::findOrFail($request->id);

            Province::destroy($id);

            return response()->json($province, 200);
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

        $province = new Province;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                $province = $province->whereHas($words[0], function ($query) use ($words) {
                    $query->where($words[1], $words[2]);
                });
            }
        }


        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $province = $province->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $province = $province->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $province = $province->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $province = $province->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $province = $province->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $province = $province->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $province = $province->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $province = $province->paginate($per_page);
            }else{
                $province = $province->get();
            }
        }

        return $province;
    }
}
