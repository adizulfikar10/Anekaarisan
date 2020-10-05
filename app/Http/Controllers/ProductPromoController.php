<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\ProductPromo;

class ProductPromoController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            $productpromo = $this->searchGenerator($request);
            return response()->json($productpromo, 200);
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
            'product_id' => 'required|exists:products,id',
            'promo_id' => 'required|exists:promos,id',
        ]);

        try {
            $productpromo = ProductPromo::create($request->all());
            return response()->json($productpromo, 201);
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
            'productpromos' => 'required|array',
        ]);

        try {
            foreach ($request->productpromos as $key => $value) {
               $productpromo = ProductPromo::create($value);
            }
            return response()->json($request->productpromos, 201);
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
            $productpromo = ProductPromo::findOrFail($request->id);
            return response()->json($productpromo, 200);
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
            'product_id' => 'required|exists:products,id',
            'promo_id' => 'required|exists:promos,id',
        ]);

        try {
            $productpromo = ProductPromo::findOrFail($request->id);

            $productpromo->update($request->all());

            return response()->json($productpromo, 200);
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
            $productpromo = ProductPromo::findOrFail($request->id);

            ProductPromo::destroy($id);

            return response()->json($productpromo, 200);
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
       
        $productpromo = new ProductPromo;

        if(is_array($whereHas)){
            foreach ($whereHas as $item => $value) {
                $words = explode(",",$value);
                     $productpromo = $productpromo->whereHas($words[0], function ($query) use ($words) {
                        $query->where($words[1], $words[2]);
                    });
            }
        }

        if($join !== ''){
            $join = Str::lower($join);
            $words = explode(",",$join);
            $productpromo = $productpromo->with($words);
        }

        if($count !== ''){
            $count = Str::lower($count);
            $words = explode(",",$count);
            $productpromo = $productpromo->withCount($words);
        }

        if(is_array($filter)){
            foreach ($filter as $item => $value) {
                $words = explode(",",$value);
                if(array_key_exists(2, $words)){
                    if($words[2] || $words[2] == 'AND'){
                        $productpromo = $productpromo->orWhere($words[0], 'LIKE', '%'.$words[1].'%');
                    }else{
                        $productpromo = $productpromo->where($words[0], 'LIKE', '%'.$words[1].'%');
                    }
                }else{
                    $productpromo = $productpromo->where($words[0], 'LIKE', '%'.$words[1].'%');
                }
            }
        }

        $sortItem = explode(",",$sort);
        if(strtoupper($sortItem[1]) == 'ASC' || strtoupper($sortItem[1]) == 'DESC'){
            $productpromo = $productpromo->orderBy($sortItem[0], $sortItem[1]);
        }

        if($limit != ''){
            $productpromo = $productpromo->limit($limit)->get();
        }else{
            if($per_page !== 'all'){
                $productpromo = $productpromo->paginate($per_page);
            }else{
                $productpromo = $productpromo->get();
            }
        }
        
        return $productpromo;
    }
}