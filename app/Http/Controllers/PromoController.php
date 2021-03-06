<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Promo;

class PromoController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $promo = $this->searchGenerator($request);
            return response()->json($promo, 200);
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
            'name' => 'required|string|max:100',
            'status' => 'required|in:ENABLE,DISABLE',
            'banner_status' => 'required|in:ENABLE,DISABLE',
            'date_start' => 'required|date',
            'date_end' => 'required|date',
            'promo_percent' => 'required|digits_between:1,3',
            'image_ids' => 'array',
            'image_ids.*' => 'string|exists:master_images,id',
        ]);

        try {
            $promo = Promo::create($request->all());
            return response()->json($promo, 201);
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
            'promos' => 'required|array',
        ]);

        try {
            foreach ($request->promos as $key => $value) {
               $promo = Promo::create($value);
            }
            return response()->json($request->promos, 201);
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
            $promo = Promo::findOrFail($request->id);
            return response()->json($promo, 200);
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
            'name' => 'required|string|max:100',
            'status' => 'required|in:ENABLE,DISABLE',
            'banner_status' => 'required|in:ENABLE,DISABLE',
            'date_start' => 'required|date',
            'date_end' => 'required|date',
            'promo_percent' => 'required|digits_between:1,3',
            'image_ids' => 'array',
            'image_ids.*' => 'string|exists:master_images,id',
        ]);

        try {
            $promo = Promo::findOrFail($request->id);

            $promo->update($request->all());

            return response()->json($promo, 200);
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
            $promo = Promo::findOrFail($request->id);

            Promo::destroy($id);

            return response()->json($promo, 200);
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
       
        $promo = new Promo;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $promo = $promo->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $promo = $promo->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $promo = $promo->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $promo = $promo->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $promo = $promo->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $promo = $promo->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $promo = $promo->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $promo = $promo->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $promo = $promo->paginate($per_page);
            }else{
                $promo = $promo->get();
            }
        }
        
        return $promo;
    }
}